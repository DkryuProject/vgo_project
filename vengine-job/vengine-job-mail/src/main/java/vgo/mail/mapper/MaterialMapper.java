package vgo.mail.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import vgo.mail.dto.MaterialDto;

import java.util.List;

@Repository
@Mapper
public interface MaterialMapper {
    List<MaterialDto> searchMaterialList();

    String[] searchCompanyUsers(Long companyID);
}
