package io.vengine.inventory.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "DELIVERY")
@Getter
@Setter
public class Delivery implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "DELIVERY_NUMBER")
	private String deliveryNumber;

	@Column(name = "DELIVERY_DATE")
	private String deliveryDate;

	@Column(name = "COMPANY")
	private String company;

	@Column(name = "SUPPLIER")
	private String supplier;

	@Column(name = "PACKING_MEASUREMENT")
	private String packingMeasurement;

	@Column(name = "PACKING_QUANTITY", precision = 22, scale = 2)
	private BigDecimal packingQuantity;

	@Column(name = "UNIT_MEASUREMENT")
	private String unitMeasurement;

	@Column(name = "UNIT_QUANTITY", precision = 22, scale = 2)
	private BigDecimal unitQuantity;

	@Column(name = "ITEM")
	private String item;

	@Column(name = "STYLE")
	private String style;

	@Column(name = "COLOR")
	private String color;

	@Column(name = "SIZE")
	private String size;

	@CreationTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "INSERT_DATE")
	private Date insertDate;

	@Column(name = "INSERT_USER")
	private String insertUser;

	@UpdateTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "MODIFY_DATE")
	private Date modifyDate;

	@Column(name = "MODIFY_USER")
	private String modifyUser;

	@Column(name = "COMPLETE_FLAG")
	private String completeFlag;
	
	@Column(name = "DEL_FLAG")
	private String delFlag;
	
	@PrePersist
	public void prePersist() {
		this.delFlag = this.delFlag == null ? "N" : this.delFlag;
		this.completeFlag = this.completeFlag == null ? "N" : this.completeFlag;
	}
}
