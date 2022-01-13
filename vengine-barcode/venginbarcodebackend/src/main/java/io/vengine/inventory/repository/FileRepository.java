package io.vengine.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.vengine.inventory.entity.File;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

}
