package com.nhom2.qnu.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	/*
	 * --------------------------
	 * HÀM DÙNG CHUNG CHO TẤT CẢ LỖI
	 * --------------------------
	 */
	private ResponseEntity<Map<String, Object>> buildResponse(String message, HttpStatus status) {
		Map<String, Object> body = new HashMap<>();
		body.put("success", false);
		body.put("message", message);
		return new ResponseEntity<>(body, status);
	}

	@ExceptionHandler(DataNotFoundException.class)
	public ResponseEntity<?> handleDataNotFoundException(DataNotFoundException e, WebRequest request) {
		return buildResponse(e.getMessage(), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(DataExistException.class)
	public ResponseEntity<?> handleDataExistException(DataExistException e, WebRequest request) {
		return buildResponse(e.getMessage(), HttpStatus.CONFLICT);
	}

	@ExceptionHandler(AccessDenyException.class)
	public ResponseEntity<?> handleAccessDenyException(AccessDenyException e, WebRequest request) {
		return buildResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
	}

	/*
	 * --------------------------
	 * RuntimeException (bao gồm lỗi throw new RuntimeException())
	 * --------------------------
	 */
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntime(RuntimeException ex) {
		return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
	}
}
