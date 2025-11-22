package com.nhom2.qnu.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

  @ManyToMany(mappedBy = "services", fetch = FetchType.LAZY)
  @JsonIgnore
  private Set<Patients> patients = new HashSet<>();
}
