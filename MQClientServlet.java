package com.mydomain.servlets;

import java.io.IOException;

import javax.jms.JMSException;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/MQClientServlet")
public class MQClientServlet extends HttpServlet {
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			init(new InitialContext(), "queue/email_events");
			sendMsg();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public final static String QUEUE_NAME = "queue/email_events";

	private static QueueConnectionFactory qconFactory;
	private static QueueConnection qcon;
	private static QueueSession qsession;
	private static QueueSender qsender;
	private static Queue queue;
	private static TextMessage msg;

	public static void init(Context ctx, String queueName) throws NamingException,
			JMSException {
		qconFactory = (QueueConnectionFactory) ctx.lookup("/ConnectionFactory");
		qcon = qconFactory.createQueueConnection();
		qsession = qcon.createQueueSession(false, Session.AUTO_ACKNOWLEDGE);
		queue = (Queue) ctx.lookup(queueName);
		qsender = qsession.createSender(queue);
		msg = qsession.createTextMessage();
		qcon.start();
	}

	private static void sendMsg() throws IOException, JMSException {
		System.out.println("Following Messages has been sent !!!");
		System.out.println("====================================");
		for (int j = 1; j <= 3; j++) {
			msg.setText("" + j); // Messages
			qsender.send(msg); // Messages sent
			System.out.println("Message Sent = " + j);
		}
		System.out.println("====================================");
	}

}
