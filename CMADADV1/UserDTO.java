package com.mysocial.model;

import java.io.Serializable;

import org.bson.types.ObjectId;

/**
 * DTO class for transfering User data over json
 * @author maruthir 
 *
 */
public class UserDTO implements Serializable{
    private String id;
    private String userName;
    private String first;
    private String last;
    private String email;
	private String siteId;
    private String password;
    private String companyId;
    private String deptId;
    private String companyName;
    private String subdomain;
    private String deptName;
    private Boolean isCompany;
    
    
    public User toModel(){
    	User u = new User();
    	if(id!=null)
    		u.setId(new ObjectId(id));
    	u.setUserName(userName);
    	u.setFirst(first);
    	u.setLast(last);
    	u.setEmail(email);
    	if(siteId!=null)
    		u.setSiteId(new ObjectId(siteId));
    	u.setPassword(password);
    	return u;
    }
    
    public UserDTO fillFromModel(User u){
    	id = u.getId()!=null?u.getId().toHexString():null;
    	userName = u.getUserName();
    	first = u.getFirst();
    	last = u.getLast();
    	email = u.getEmail();
    	siteId = u.getSiteId()!=null?u.getSiteId().toHexString():null;
    	password = u.getPassword();
    	return this;
    }
    
	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public Boolean getIsCompany() {
		return isCompany;
	}

	public void setIsCompany(Boolean isCompany) {
		this.isCompany = isCompany;
	}

	public String getCompanyId() {
		return companyId;
	}
	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getSubdomain() {
		return subdomain;
	}
	public void setSubdomain(String subdomain) {
		this.subdomain = subdomain;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getFirst() {
		return first;
	}
	public void setFirst(String first) {
		this.first = first;
	}
	public String getLast() {
		return last;
	}
	public void setLast(String last) {
		this.last = last;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public String getSiteId() {
		return siteId;
	}
	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}

	@Override
	public String toString() {
		return "UserDTO [id=" + id + ", userName=" + userName + ", first="
				+ first + ", last=" + last + "]";
	}
    
}
