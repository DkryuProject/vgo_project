package io.vengine.api.v1.user.repository;

import io.vengine.api.v1.user.entity.UserMailSend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMailSendRepository extends JpaRepository<UserMailSend, Long> {
    List<UserMailSend> findByTypeIdxAndSendTypeAndStatus(Long typeIdx, int sendType, int i);

    List<UserMailSend> findByTypeIdxAndSendType(Long typeIdx, int sendType);
}
