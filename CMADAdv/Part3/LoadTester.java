package com.mydomain.servlets;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class LoadTester {

	public static AtomicInteger count = new AtomicInteger(0);
	public static void main(String[] args) {
		ExecutorService exec = Executors.newFixedThreadPool(500);
		for(int i =0; i< 300; i++){
			exec.execute(r);
		}
	}
	private static Runnable r = new Runnable() {
		public void run() {
			try {
				LoadTester.sendGet();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	};
	public static void sendGet() throws Exception {
		int i = LoadTester.count.incrementAndGet();
		System.out.println("Starting request in thread: "+i);
		String url = "http://localhost:8080/Web/AsyncServlet";
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		// optional default is GET
		con.setRequestMethod("GET");
		con.setConnectTimeout(0);
		con.setReadTimeout(0);//Infinite
		//add request header
		con.setRequestProperty("User-Agent", "Java agent");
		int responseCode = con.getResponseCode();
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
 
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
		//print result
		System.out.println("Server response = "+response.toString());
 
	}

}
