package com.mydomain;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

/**
 * Message-Driven Bean implementation class for: EventProcessorMDB
 */
/**
 * @MessageDriven(activationConfig = {
		@ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
		@ActivationConfigProperty(propertyName = "destination", propertyValue = "email_events") }, mappedName = "email_events")
		*/
public class EventProcessorMDB implements MessageListener {

	/**
	 * Default constructor.
	 */
	public EventProcessorMDB() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see MessageListener#onMessage(Message)
	 */
	public void onMessage(Message message) {
		try {
			System.out.println("Processing Message: " + message);
			TextMessage tm = (TextMessage) message;
			System.out.println("Message : " + tm.getText());
		} catch (JMSException e) {
			e.printStackTrace();
		}

	}

}
