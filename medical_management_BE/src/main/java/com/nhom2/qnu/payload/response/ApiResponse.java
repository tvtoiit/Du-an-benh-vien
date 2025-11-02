package com.nhom2.qnu.payload.response;

import java.io.Serializable;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
		"success",
		"message"
})
public class ApiResponse implements Serializable {
	private static final long serialVersionUID = 1L;
	@JsonProperty("success")
	private Boolean isSuccess;

	@JsonProperty("message")
	private String message;

	@JsonIgnore
	private HttpStatus status;

	public ApiResponse() {

	}

	public ApiResponse(Boolean isSuccess, String message) {
		this.isSuccess = isSuccess;
		this.message = message;
	}

	public ApiResponse(String message, HttpStatus status) {
		this.isSuccess = (status == HttpStatus.OK); // tự set true/false
		this.message = message;
		this.status = status;
	}

	public Boolean getSuccess() {
		return isSuccess;
	}

	public void setSuccess(Boolean isSuccess) {
		this.isSuccess = isSuccess;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public void setStatus(HttpStatus status) {
		this.status = status;
	}
}