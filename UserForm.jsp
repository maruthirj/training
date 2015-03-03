<%@page import="com.mydomain.model.User"%>
<%@ page isELIgnored="false"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<form action="addUser" method="post" name="userForm">
<% User u = (User)request.getAttribute("user"); 
if (u==null){
	u = new User();
}else{%>
	<input type="hidden" value="<%=u.getId()%>" name="id"></input>
<%
}
%>
Name: <input type="text" name="name" value="${u.name}"></input>

Age:  <input type="text" name="age" value="${u.age}"></input> 
<input type="submit" value="Save"></input><br>
</form>
</body>
</html>