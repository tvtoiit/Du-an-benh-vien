package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VisitReportResponse {
    private java.util.Date date;
    private Long totalVisits;
}
