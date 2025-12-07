package com.nhom2.qnu.payload.request;

import java.util.List;

import lombok.Data;

@Data
public class ServiceAssignRequest {
    private List<String> serviceIds;
}
