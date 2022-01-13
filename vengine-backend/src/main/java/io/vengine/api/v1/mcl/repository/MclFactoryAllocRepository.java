package io.vengine.api.v1.mcl.repository;

import io.vengine.api.v1.mcl.entity.MclFactoryAlloc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MclFactoryAllocRepository extends JpaRepository<MclFactoryAlloc, Long>, JpaSpecificationExecutor<MclFactoryAlloc> {
}
