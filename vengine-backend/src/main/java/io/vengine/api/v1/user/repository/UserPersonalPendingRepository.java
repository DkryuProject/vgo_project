package io.vengine.api.v1.user.repository;

import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.entity.UserPersonalPending;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPersonalPendingRepository extends JpaRepository<UserPersonalPending, Long> {
    Page<UserPersonalPending> findByCompanyAndStatus(Company company, String status, Pageable pageable);

    UserPersonalPending findByUserAndStatus(User user, String status);
}
