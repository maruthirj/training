package com.mydomain.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.mydomain.model.User;
import com.mydomain.security.Secure;
import com.mydomain.security.Secureable;

@Secure
public abstract class UserDaoImpl implements UserDao, Secureable, UserDaoRemote {
	Logger log = Logger.getLogger(UserDaoImpl.class.getName()); 
	
	public UserDaoImpl(){
		log.log(Level.INFO, "Creating dao impl");
	}

	
	
	private Connection getConnection() throws Exception{
		Class.forName("org.apache.derby.jdbc.ClientDriver");
		return DriverManager.getConnection("jdbc:derby://localhost:1527//Users/maruthir/Documents/Training/workspace/CRUD/WebContent/WEB-INF/mydb");
	}
	
	public abstract Connection getCon();
	

	public List<User> getAllUsers() throws Exception{
		Statement statement = getCon().createStatement();
		ResultSet rs = statement.executeQuery("select * from users");
		List<User> users = new ArrayList<User>();
		while(rs.next()){
			User u = new User();
			u.setId(rs.getInt("id"));
			u.setAge(rs.getInt("age"));
			u.setEmailId(rs.getString("email_id"));
			u.setJoinDate(rs.getDate("join_date"));
			u.setName(rs.getString("name"));
			u.setPassword(rs.getString("password"));
			u.setState(rs.getString("state"));
			users.add(u);
		}
		return users;
	}
	
	public User getUser(Integer id) throws Exception{
		Statement statement = getCon().createStatement();
		ResultSet rs = statement.executeQuery("select * from users where id="+id);
		while(rs.next()){
			User u = new User();
			u.setId(rs.getInt("id"));
			u.setAge(rs.getInt("age"));
			u.setEmailId(rs.getString("email_id"));
			u.setJoinDate(rs.getDate("join_date"));
			u.setName(rs.getString("name"));
			u.setPassword(rs.getString("password"));
			u.setState(rs.getString("state"));
			return u;
		}
		return null;//User not found
	}

	public void addUser(User u) throws Exception{
		Statement st = getCon().createStatement();
		st.execute("insert into users (name,age) values ('"+u.getName()+"',"+u.getAge()+")");
	}

	public void updateUser(User u) throws Exception{
		Statement st = getCon().createStatement();
		st.execute("update users set name='"+u.getName()+"', age="+u.getAge()+" where id="+u.getId());
	}

	public void deleteUser(Integer id) throws Exception{
		Statement st = getCon().createStatement();
		st.execute("delete from users where id="+id);
	}

}
