package com.mydomain.dao;

import java.util.List;

import com.mydomain.model.User;

public interface UserDao {

	public List<User> getAllUsers() throws Exception;
	
	public User getUser(Integer id) throws Exception;

	public void addUser(User u) throws Exception;

	public void updateUser(User u) throws Exception;

	public void deleteUser(Integer id) throws Exception;
}
