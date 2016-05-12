package com.mydomain.servlets;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.mydomain.service.HibernateUtil;

public class HibernateSessionFilter implements Filter {
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		Transaction tx = null;
		HttpServletRequest request = (HttpServletRequest) req;
		try {
			// Begin and Commit Transaction
			Session ses = HibernateUtil.currentSession();
			tx = ses.beginTransaction();
			chain.doFilter(req, res);
			tx.commit();
		} catch (Exception e) {
			tx.rollback();
			throw new ServletException(e);
		} finally {
			HibernateUtil.closeSession();
		}
	}

	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}
}
