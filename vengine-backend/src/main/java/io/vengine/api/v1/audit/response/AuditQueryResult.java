package io.vengine.api.v1.audit.response;

import io.vengine.api.v1.audit.entity.CustomRevisionEntity;
import org.hibernate.envers.RevisionType;

public class AuditQueryResult<T> {

    private final T entity;
    private final CustomRevisionEntity revision;
    private final RevisionType type;

    public AuditQueryResult(T entity, CustomRevisionEntity revision, RevisionType type) {
        this.entity = entity;
        this.revision = revision;
        this.type = type;
    }

    public T getEntity() {
        return entity;
    }

    public CustomRevisionEntity getRevision() {
        return revision;
    }

    public RevisionType getType() {
        return type;
    }
}
