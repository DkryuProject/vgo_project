package io.vengine.api.v1.commonInfo.repository;

import io.vengine.api.v1.commonInfo.entity.CodeGenerated;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeGeneratedRepository extends JpaRepository<CodeGenerated, Long> {
    List<CodeGenerated> findByUsed(int used);
}
