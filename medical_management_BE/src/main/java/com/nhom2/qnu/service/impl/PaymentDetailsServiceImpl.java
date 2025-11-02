package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.paymentetails.CreatePaymentDetailsResponse;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.PaymentDetailsRepository;
import com.nhom2.qnu.repository.PrescriptionHistoryRepository;
import com.nhom2.qnu.service.PaymentDetailsService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

  @Autowired
  private PatientsRepository patientsRepository;

  @Autowired
  private PrescriptionHistoryRepository prescriptionHistoryRepository;

  @Autowired
  private PaymentDetailsRepository paymentDetailsRepository;

  @Override
  public ResponseEntity<CreatePaymentDetailsResponse> save(
      PaymentDetailsRequest paymentDetailsRequest) {
    Optional<Patients> patients = patientsRepository.findById(paymentDetailsRequest.getPatientId());
    Optional<PrescriptionHistory> prescriptionHistory =
        prescriptionHistoryRepository.findById(paymentDetailsRequest.getPrescriptionHistoryId());

    if (patients.isPresent() && prescriptionHistory.isPresent()) {
      PaymentDetails payment = new PaymentDetails();
      payment.setPatient(patients.get());
      payment.setPrescriptionHistory(prescriptionHistory.get());
      payment.setTotal_amount(paymentDetailsRequest.getTotal_amount());
      paymentDetailsRepository.save(payment);
      CreatePaymentDetailsResponse response = CreatePaymentDetailsResponse.builder()
          .data(paymentDetailsRequest).status("201").massage("create successfully").build();
      return new ResponseEntity<CreatePaymentDetailsResponse>(response, HttpStatus.CREATED);
    }
    return new ResponseEntity<CreatePaymentDetailsResponse>(HttpStatus.NOT_FOUND);
  }
}
