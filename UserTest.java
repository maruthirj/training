package com.mydomain.test;

import static org.junit.Assert.fail;
import static com.jayway.restassured.RestAssured.*;
import static com.jayway.restassured.matcher.RestAssuredMatchers.*;
import static org.hamcrest.Matchers.*;
import static com.jayway.restassured.module.jsv.JsonSchemaValidator.*;

import org.hamcrest.Matchers;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Test;
import org.omg.CORBA.portable.ApplicationException;

import com.jayway.restassured.builder.RequestSpecBuilder;
import com.jayway.restassured.builder.ResponseSpecBuilder;
import com.jayway.restassured.filter.Filter;
import com.jayway.restassured.filter.FilterContext;
import com.jayway.restassured.http.ContentType;
import com.jayway.restassured.internal.http.Status;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.FilterableRequestSpecification;
import com.jayway.restassured.specification.FilterableResponseSpecification;
import com.jayway.restassured.specification.RequestSpecification;
import com.jayway.restassured.specification.ResponseSpecification;

public class UserTest {

	// @Test
	public void testUserCount() {
		given().log().all().accept(ContentType.JSON).then()
				.get("http://localhost:8080/RestSample/services/users").then()
				.log().all().body("$.size()", is(14));
	}

	@Test
	public void testUserCountWithAuth() {
		given().log().all().authentication().basic("admin", "admin123")
				.accept(ContentType.JSON).then()
				.get("http://localhost:8080/RestSample/services/users").then()
				.log().all().body("$.size()", is(14));
	}

	@Test
	public void testJsonValidation() {
		given().accept(ContentType.JSON).authentication()
				.basic("admin", "admin123").when()
				.get("http://localhost:8080/RestSample/services/users").then()
				.assertThat()
				.body(matchesJsonSchemaInClasspath("users-schema.json"));
	}

	@Test
	public void testJsonUpdate() {
		String usersJson = given().accept(ContentType.JSON).authentication()
				.basic("admin", "admin123").when()
				.get("http://localhost:8080/RestSample/services/users/307")
				.body().asString();
		JSONObject json = new JSONObject(usersJson);
		Assert.assertEquals("Hari2", json.get("name"));
		json.put("name", "Hari");
		json.remove("links");
		System.out.println(json.toString());
		given().log().all().body(json.toString()).contentType(ContentType.JSON)
				.put("http://localhost:8080/RestSample/services/users").then()
				.statusCode(equalTo(204));
	}

	@Test
	public void testUserGet() {
		given().pathParam("uid", 307).then()
		.get("http://localhost:8080/RestSample/services/users/{uid}").then().body(
				"id", equalTo(307));
	}

	// @Test
	public void testUserGetAll() {
		// get("http://localhost:8080/RestSample/services/users").then().body("id",
		// hasItems(307,605,619));
		useRelaxedHTTPSValidation();
		given().accept(ContentType.JSON).authentication()
				.basic("admin", "admin123").when()
				.get("https://localhost:8443/RestSample/services/users").then()
				.body("id", hasItems(307, 605, 619));
	}

}

class MyAuthFilter implements Filter {
	public Response filter(FilterableRequestSpecification requestSpec,
			FilterableResponseSpecification responseSpec, FilterContext ctx) {
		requestSpec.authentication().basic("admin", "admin123");
		return ctx.next(requestSpec, responseSpec);
	}
}