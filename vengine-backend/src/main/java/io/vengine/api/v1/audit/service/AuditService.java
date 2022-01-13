package io.vengine.api.v1.audit.service;

import io.vengine.api.v1.user.entity.User;

import java.util.List;

public interface AuditService {

    List<User> findRevisionsWithWhere();

    List<User> listUserRevisions(long id);
}
