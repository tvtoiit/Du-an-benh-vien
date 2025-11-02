package com.nhom2.qnu.exception;

import org.springframework.web.bind.annotation.ResponseStatus;

import com.nhom2.qnu.payload.response.ApiResponse;

import org.springframework.http.HttpStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED)
public class AccessDeniedException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	private ApiResponse apiResponse;

	private String message;

	public AccessDeniedException(ApiResponse apiResponse) {
		super();
		this.apiResponse = apiResponse;
	}

	public AccessDeniedException(String message) {
		super(message);
		this.message = message;
	}

	public AccessDeniedException(String message, Throwable cause) {
		super(message, cause);
	}

	public ApiResponse getApiResponse() {
		return apiResponse;
	}

	public void setApiResponse(ApiResponse apiResponse) {
		this.apiResponse = apiResponse;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
