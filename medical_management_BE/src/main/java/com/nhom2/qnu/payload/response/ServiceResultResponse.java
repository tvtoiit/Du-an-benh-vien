package com.nhom2.qnu.payload.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ServiceResultResponse {
    private String resultId;
    private String serviceName;
    private String resultData;
    private String note;
    private String imageUrl;
    private String doctorName;
    private LocalDateTime createdAt;
}
