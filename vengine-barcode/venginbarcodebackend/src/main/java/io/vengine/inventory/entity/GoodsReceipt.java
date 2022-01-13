package io.vengine.inventory.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
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
@Table(name = "GOODS_RECEIPT")
@Getter
@Setter
public class GoodsReceipt implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "GOODS_RECEIPT_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long goodsReceiptID;

	@CreationTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "GOODS_RECEIPT_DATE")
	private Date goodsReceiptDate;

	@Column(name = "COMPANY")
	private String company;

	@Column(name = "STYLE")
	private String style;
	
	@Column(name = "SUPPLIER")
	private String supplier;

	@Column(name = "PACKING_MEASUREMENT")
	private String packingMeasurement;

	@Column(name = "TOTAL_PACKING_QUANTITY", precision = 22, scale = 2)
	private BigDecimal totalPackingQuantity;

	@Column(name = "UNIT_MEASUREMENT")
	private String unitMeasurement;

	@Column(name = "TOTAL_UNIT_QUANTITY", precision = 22, scale = 2)
	private BigDecimal totalUnitTotalQuantity;

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

	@ManyToOne
	@JoinColumn(name = "deliveryNumber")
	private Delivery delivery;
}
