package com.mydomain;

import java.lang.reflect.Method;

public class ReflectionsDemo {
	public static void main(String[] args) throws Exception{
		Class c = Class.forName("java.lang.String");
		Object o = c.newInstance();
		Method m = c.getMethod("length");
		System.out.println(m.invoke(o));
		
		
		Method[] methods = String.class.getMethods();
		for (Method method : methods) {
			System.out.println(method.getName());
		}
	}
}
