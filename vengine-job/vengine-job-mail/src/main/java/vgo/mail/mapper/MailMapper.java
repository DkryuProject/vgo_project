package vgo.mail.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import vgo.mail.dto.*;

import java.util.List;

@Repository
@Mapper
public interface MailMapper {
    List<MailDto> searchSendMailList();

    void updateMail(MailDto mailDto);

    CompanyDto searchCompany(Long id);

    UserDto searchUser(Long userID);

    MaterialDto searchMaterialInfo(Long materialInfoID);

    OrderDto searchOrderInfo(Long orderID);

    OrderDto searchAdhocOrderInfo(Long orderID);

    CompanyBizRelationDto searchCompanyBizRelation(Long companyBizRelationID);

    CompanyBizRequestDto searchCompanyBizRequest(Long companyBizRequestID);

    JoinRequestDto searchJoinInfo(Long id);
}
