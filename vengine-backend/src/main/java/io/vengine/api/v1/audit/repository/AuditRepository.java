package io.vengine.api.v1.audit.repository;

import io.vengine.api.v1.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditRepository extends JpaRepository<User, Long> {
}
