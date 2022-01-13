package io.vengine.api.v1.audit.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.RevisionEntity;
import org.hibernate.envers.RevisionNumber;
import org.hibernate.envers.RevisionTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.text.DateFormat;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@RevisionEntity
@Table(name = "REVINFO")
public class CustomRevisionEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @RevisionNumber
    @EqualsAndHashCode.Include
    @Column(name = "REV")
    private long id;

    @RevisionTimestamp
    @EqualsAndHashCode.Include
    @Column(name = "REVSTMP")
    private long timestamp;

    @Transient
    public Date getRevisionDate() {
        return new Date(timestamp);
    }

    @Override
    public String toString() {
        return "CustomRevisionEntity(id = " + id
                + ", revisionDate = " + DateFormat.getDateTimeInstance().format( getRevisionDate() ) + ")";
    }
}