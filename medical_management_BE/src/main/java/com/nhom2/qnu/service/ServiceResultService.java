package com.nhom2.qnu.service;

import com.nhom2.qnu.payload.request.ServiceResultRequest;
import com.nhom2.qnu.model.ServiceResult;

import java.io.IOException;

public interface ServiceResultService {
    ServiceResult saveServiceResult(ServiceResultRequest request) throws IOException;
}
