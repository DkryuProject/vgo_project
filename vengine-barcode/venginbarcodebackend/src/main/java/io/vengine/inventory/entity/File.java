package io.vengine.inventory.entity;

import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="File")
@Getter
@Setter
public class File implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "PACKING_NUMBER")
	private String packingNumber;
	
	@Column(name = "TYPE")
	private String type;
	
	@Column(name = "FILE")
	private Blob file;
	
	@Column(name = "FILE_SIZE")
	private long fileSize;
	
	@Column(name = "FILE_NAME")
	private String fileName;
	
	@CreationTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "INSERT_DATE")
	private Date insertDate;

	@Column(name = "INSERT_USER")
	private String insertUser;
}
