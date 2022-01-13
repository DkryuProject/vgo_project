package io.vengine.inventory.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "BARCODE")
@Getter
@Setter
public class Barcode implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "BARCODE_ID")
	private String barcodeId;

	@Column(name = "COMPANY")
	private String company;
	
	@Column(name = "PACKING_MEASUREMENT")
	private String packingMeasurement;

	@Column(name = "PACKING_QUANTITY", precision = 22, scale = 2)
	private BigDecimal packingQuantity;
	
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

	@ManyToOne(targetEntity = GoodsReceipt.class)
	@JoinColumn(name = "goodsReceiptID")
	private GoodsReceipt goodsReceipt;

	@ManyToOne(targetEntity = Location.class)
	@JoinColumn(name = "locationId")
	private Location location;
}
