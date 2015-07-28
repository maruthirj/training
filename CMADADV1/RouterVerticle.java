package com.mydomain;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.AuthHandler;
import io.vertx.ext.web.handler.BasicAuthHandler;
import io.vertx.ext.web.handler.CookieHandler;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.handler.UserSessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.mongodb.morphia.Datastore;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Transaction;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mydomain.infra.ServicesFactory;
import com.mysocial.model.User;
import com.mysocial.model.UserDTO;

public class RouterVerticle extends AbstractVerticle {
	@Override
	public void start(Future<Void> startFuture) throws Exception {
		HttpServer server = vertx.createHttpServer();

		Router router = Router.router(vertx);

		router.route().handler(CookieHandler.create());
		router.route().handler(
				SessionHandler.create(LocalSessionStore.create(vertx)));
		AuthProvider ap = new MyAuthProvier();
		router.route().handler(UserSessionHandler.create(ap));

		AuthHandler basicAuthHandler = BasicAuthHandler.create(ap);

		router.route("/private/*").handler(basicAuthHandler);
		router.route("/private/*").handler(new Handler<RoutingContext>() {
			@Override
			public void handle(RoutingContext rc) {
				System.out.println("Handler: " + rc.user().principal());
				rc.response().end("Done");
			}
		});

		router.get("/services/users/:id").handler(new UserLoader());
		router.post("/services/users").handler(new UserPersister());

		server.requestHandler(router::accept).listen(8080);
		System.out.println("Thread Router Start: "
				+ Thread.currentThread().getId());
		System.out.println("STARTED ROUTER");
		startFuture.complete(); 
	}
}

class MyAuthProvier implements AuthProvider {

	@Override
	public void authenticate(JsonObject json,
			Handler<AsyncResult<io.vertx.ext.auth.User>> handler) {
		System.out.println("Authenticating users with: " + json);
		AsyncResult<io.vertx.ext.auth.User> result = new AsyncResult<io.vertx.ext.auth.User>() {
			public boolean succeeded() {
				return json.getString("username").equals("admin")
						&& json.getString("password").equals("admin123");
			}

			public io.vertx.ext.auth.User result() {
				return new io.vertx.ext.auth.User() {
					public void setAuthProvider(AuthProvider provider) {
						System.out
								.println("Setting auth provider: " + provider);
					}

					public JsonObject principal() {
						Map<String, Object> dataMap = new HashMap<>();
						dataMap.put("buffer", json.getString("username"));
						JsonObject obj = new JsonObject(dataMap);
						return obj;
					}

					public io.vertx.ext.auth.User isAuthorised(String url,
							Handler<AsyncResult<Boolean>> handler) {
						System.out.println("Is authorized call: " + url);
						return this;
					}

					public io.vertx.ext.auth.User clearCache() {
						return null;
					}
				};
			}

			public boolean failed() {
				return !(json.getString("username").equals("admin") && json
						.getString("password").equals("admin123"));
			}

			public Throwable cause() {
				return null;
			}
		};
		handler.handle(result);
	}
}

class GraphLoader implements Handler<RoutingContext> {
	@Override
	public void handle(RoutingContext arg0) {
		GraphDatabaseFactory dbFactory = new GraphDatabaseFactory();
		File f = new File("/Users/maruthir/Documents/Training/neo4jdb");
		GraphDatabaseService db = dbFactory.newEmbeddedDatabase(f);
		try (Transaction tx = db.beginTx()) {
			// Perform DB operations
			tx.success();
		}
	}
}

class UserPersister implements Handler<RoutingContext> {
	public void handle(RoutingContext routingContext) {
		System.out.println("Thread UserPersister: "
				+ Thread.currentThread().getId());
		// This handler will be called for every request
		HttpServerResponse response = routingContext.response();
		routingContext.request().bodyHandler(new Handler<Buffer>() {
			public void handle(Buffer buf) {
				String json = buf.toString("UTF-8");
				ObjectMapper mapper = new ObjectMapper();
				UserDTO dto = null;
				try {
					dto = mapper.readValue(json, UserDTO.class);
				} catch (IOException e) {
					e.printStackTrace();
				}
				User u = dto.toModel();
				Datastore dataStore = ServicesFactory.getMongoDB();
				dataStore.save(u);
				response.setStatusCode(204).end("Data saved");
			};
		});
	}
}

class UserLoader implements Handler<RoutingContext> {
	public void handle(RoutingContext routingContext) {
		System.out.println("Thread UserLoader: "
				+ Thread.currentThread().getId());
		// This handler will be called for every request
		HttpServerResponse response = routingContext.response();
		String id = routingContext.request().getParam("id");

		response.putHeader("content-type", "application/json");
		Datastore dataStore = ServicesFactory.getMongoDB();
		ObjectId oid = null;
		try {
			oid = new ObjectId(id);
		} catch (Exception e) {// Ignore format errors
		}
		List<User> users = dataStore.createQuery(User.class).field("id")
				.equal(oid).asList();
		if (users.size() != 0) {
			UserDTO dto = new UserDTO().fillFromModel(users.get(0));
			ObjectMapper mapper = new ObjectMapper();
			JsonNode node = mapper.valueToTree(dto);
			response.end(node.toString());
		} else {
			response.setStatusCode(404).end("not found");
		}
	}
}