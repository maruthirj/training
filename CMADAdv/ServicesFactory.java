package com.mydomain.infra;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;

public class ServicesFactory {
	
	
	private static ThreadLocal<Datastore> mongoTL = new ThreadLocal<Datastore>();
	
	/**
	 * Method to retrieve a mongo database client from the thread local storage
	 * @return
	 */
	public static Datastore getMongoDB(){
		if(mongoTL.get()==null){
			MongoClientURI connectionString = new MongoClientURI("mongodb://localhost:27017");
			MongoClient mongoClient = new MongoClient(connectionString);	
			Morphia morphia = new Morphia();
			morphia.mapPackage("com.mysocial.model");
			Datastore datastore = morphia.createDatastore(mongoClient, "test");
			datastore.ensureIndexes();
			mongoTL.set(datastore);
			return datastore;
		}
		return mongoTL.get();
	}
	
}
