package com.nhom2.qnu.model;

import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.nhom2.qnu.enums.ServiceType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_service")
@Builder
public class Services implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(generator = "uuid", strategy = GenerationType.AUTO)
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  @Column(name = "service_id", length = 36, nullable = false)
  private String serviceId;

  @Column(name = "service_name", length = 50, nullable = false)
  private String serviceName;

  @Column(name = "description", length = 255, nullable = false)
  private String description;

  @Column(name = "price", nullable = false, length = 18)
  private BigDecimal price;

  @Enumerated(EnumType.STRING)
  @Column(name = "service_type", nullable = false)
  private ServiceType serviceType;

  @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
  private java.util.List<AppointmentServiceItem> appointmentAppointments = new java.util.ArrayList<>();

}
