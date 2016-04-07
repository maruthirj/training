package com.mydomain.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import com.mydomain.model.User;
import com.mydomain.service.HibernateUtil;

public class UserDao {


	public User getUser( Integer id) {
		Session ses = HibernateUtil.currentSession();
		try {
			Criteria crit =  ses.createCriteria(User.class);
			crit.add(Restrictions.idEq(id));
			User u = (User)crit.uniqueResult();
			return u;
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public List<User> getUsers() {
		Session ses = HibernateUtil.currentSession();
		try {
			return ses.createCriteria(User.class).list();
		} finally {
			HibernateUtil.closeSession();
		}
	}
	
	
}


