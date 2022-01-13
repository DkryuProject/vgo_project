package io.vengine.api.v1.user.repository;

import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByCompId(Company CompId);

    Page<User> findByCompId(Company company, Pageable pageable);

    Optional<User> findFirstByCompIdOrderByCreatedAtDesc(Company company);
}
