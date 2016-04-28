package com.mydomain.service;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

public class HibernateUtil {

	private static SessionFactory sesFac = null;
	private static ThreadLocal<Session> tlSessions = new ThreadLocal<Session>();
	static{
		 Configuration configuration = new Configuration().configure("hibernate.cfg.xml");
         ServiceRegistry serviceRegistry
             = new StandardServiceRegistryBuilder()
                 .applySettings(configuration.getProperties()).build();
        sesFac = configuration.buildSessionFactory(serviceRegistry);
	}
	
	

	public static Session currentSession() {
		Session ses = tlSessions.get();
		if(ses == null){
			ses = sesFac.openSession();
			tlSessions.set(ses);
		}
		return ses;
	}

	public static void closeSession() {
		Session ses = tlSessions.get();
		if(ses!=null){
			ses.close();
			tlSessions.set(null);
		}
		
	}
}
