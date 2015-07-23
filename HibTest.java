package com.mydomain.myapp;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

public class HibTest {
	public static void main(String[] args) {
		Configuration configuration = new Configuration().configure("hibernate.cfg.xml");
        ServiceRegistry serviceRegistry
            = new StandardServiceRegistryBuilder()
                .applySettings(configuration.getProperties()).build();
         
        // builds a session factory from the service registry
       SessionFactory sessionFactory = configuration.buildSessionFactory(serviceRegistry);
       
       Session ses = sessionFactory.openSession();
       List<User> users = ses.createQuery("select u from User u").list();
       System.out.println(users);
       ses.close();
	}
}
