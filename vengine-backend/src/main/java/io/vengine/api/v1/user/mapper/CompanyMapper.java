package io.vengine.api.v1.user.mapper;

import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.dto.CompanyBizDto;
import io.vengine.api.v1.companyInfo.entity.CompanyRelation;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.dto.CompanyRegisterReq;
import io.vengine.api.v1.user.dto.UserDto;
import io.vengine.api.v1.user.entity.*;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CommonMapper.class})
public interface CompanyMapper {
    CompanyMapper INSTANCE = Mappers.getMapper(CompanyMapper.class);

    @Mappings({
            @Mapping(target = "companyID", source = "id"),
            @Mapping(target = "companyName", source = "name")
    })
    CompanyDto.SelectCompany toSimpleCompanyDTO(Company company);

    @Mappings({
            @Mapping(target = "companyID", source = "id"),
            @Mapping(target = "companyName", source = "name"),
            @Mapping(target = "nickName", source = "nickName"),
            @Mapping(target = "LCode", source = "LCode"),
            @Mapping(target = "tax", source = "tax"),
            @Mapping(target = "ceoName", source = "ceoName"),
            @Mapping(target = "businessNumber", source = "businessNumber"),
            @Mapping(target = "businessFileUrl", source = "businessFileUrl"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "termsAgree", source = "termsAgree"),
            @Mapping(target = "midNo", source = "midNo"),
            @Mapping(target = "lorNo", source = "lorNo"),
            @Mapping(target = "midMemo", source = "midMemo"),
            @Mapping(target = "lorMemo", source = "lorMemo"),
            @Mapping(target = "bizType", source = "commonBizType"),
            @Mapping(target = "addresses", source = "companyAddresses")
    })
    CompanyDto toCompanyDTO(Company company);

    List<CompanyDto> toCompanyDTO(List<Company> companies);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "country", source = "countryId"),
            @Mapping(target = "city", source = "cityId"),
            @Mapping(target = "state", source = "state"),
            @Mapping(target = "etc", source = "etc"),
            @Mapping(target = "zipCode", source = "zipCode"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "bizType", source = "commonBizType"),
            @Mapping(target = "workPlace", source = "workPlace"),
            @Mapping(target = "representitive", source = "representitive")
    })
    CompanyDto.Address toAddressDto(CompanyAddress companyAddress);

    List<CompanyDto.Address> toAddressDto(List<CompanyAddress> companyAddresses);

    @Mappings({
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "businessNumber", source = "businessNumber"),
            @Mapping(target = "businessFileUrl", source = "businessFileUrl"),
            @Mapping(target = "termsAgree", source = "termsAgree"),
            @Mapping(target = "commonBizType", source = "commonBizType"),
            @Mapping(target = "id", ignore = true)
    })
    Company toCompany(CompanyDto.CompanySignUp companyRequest);

    @Mappings({
            @Mapping(target = "name", source = "request.companyName"),
            @Mapping(target = "businessNumber", source = "request.businessNumber"),
            @Mapping(target = "businessFileUrl", source = "request.businessFileUrl"),
            @Mapping(target = "commonBizType", source = "typeVendor.id"),
            @Mapping(target = "id", ignore = true)
    })
    Company toCompany(CompanyBizDto.NewPartnerRequest request, CommonBasicInfo typeVendor);

    @Mappings({
            @Mapping(target = "countryId", source = "companyRequest.countryId"),
            @Mapping(target = "cityId", source = "companyRequest.cityId"),
            @Mapping(target = "state", source = "companyRequest.state"),
            @Mapping(target = "etc", source = "companyRequest.etc"),
            @Mapping(target = "zipCode", source = "companyRequest.zipCode"),
            @Mapping(target = "id", ignore = true)
    })
    CompanyAddress toAddress(CompanyDto.CompanySignUp companyRequest);

    @Mappings({
            @Mapping(target = "countryId", source = "request.countryId"),
            @Mapping(target = "cityId", source = "request.cityId"),
            @Mapping(target = "state", source = "request.state"),
            @Mapping(target = "etc", source = "request.etc"),
            @Mapping(target = "zipCode", source = "request.zipCode"),
            @Mapping(target = "id", ignore = true)
    })
    CompanyAddress toAddress(CompanyBizDto.NewPartnerRequest request);

    @Mappings({
            @Mapping(target = "LCode", source = "LCode"),
            @Mapping(target = "nickName", source = "nickName"),
            @Mapping(target = "businessNumber", source = "businessNumber"),
            @Mapping(target = "businessFileUrl", source = "businessFileUrl"),
            @Mapping(target = "midNo", source = "midNo"),
            @Mapping(target = "lorNo", source = "lorNo"),
            @Mapping(target = "midMemo", source = "midMemo"),
            @Mapping(target = "lorMemo", source = "lorMemo"),
            @Mapping(target = "termsAgree", source = "termsAgree"),
            @Mapping(target = "termsAgreeFinal", source = "termsAgreeFinal"),
            @Mapping(target = "id", ignore = true)
    })
    void toCompany(CompanyDto.CompanyRequest request, @MappingTarget Company company);

    @Mappings({
            @Mapping(target = "workPlace", source = "workPlace"),
            @Mapping(target = "representitive", source = "representitive"),
            @Mapping(target = "countryId", source = "countryId"),
            @Mapping(target = "cityId", source = "cityId"),
            @Mapping(target = "state", source = "state"),
            @Mapping(target = "etc", source = "etc"),
            @Mapping(target = "zipCode", source = "zipCode"),
            @Mapping(target = "id", ignore = true)
    })
    void toAddress(CompanyDto.AddressRequest addressRequest, @MappingTarget CompanyAddress companyAddress);

    @Mapping(target = "id", source = "id")
    Company toCompany(Long id);

    @Mapping(target = "id", source = "id")
    CompanyAddress toCompanyAddress(Long id);

    @Mappings({
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "businessNumber", source = "businessNumber"),
            @Mapping(target = "businessFileUrl", source = "businessFileUrl"),
            @Mapping(target = "termsAgree", source = "termsAgree"),
            @Mapping(target = "commonBizType", source = "commonBizType"),
            @Mapping(target = "id", ignore = true)
    })
    TempCompany toTempCompany(CompanyDto.CompanySignUp companySignUp);

    @Mappings({
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "commonBizType", source = "commonBizType"),
            @Mapping(target = "businessNumber", source = "businessNumber"),
            @Mapping(target = "businessFileUrl", source = "businessFileUrl"),
            @Mapping(target = "termsAgree", source = "termsAgree"),
            @Mapping(target = "termsAgreeFinal", source = "termsAgreeFinal"),
            @Mapping(target = "id", ignore = true)
    })
    TempCompany toTempCompany(CompanyRegisterReq registerReq);

    @Mappings({
            @Mapping(target = "countryId", source = "countryId"),
            @Mapping(target = "cityId", source = "cityId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "state", source = "state"),
            @Mapping(target = "etc", source = "etc"),
            @Mapping(target = "zipCode", source = "zipCode"),
            @Mapping(target = "id", ignore = true)
    })
    TempCompanyAddress toCompanyAddress(CompanyDto.CompanySignUp companySignUp);

    @Mappings({
            @Mapping(target = "countryId", source = "registerReq.countryId"),
            @Mapping(target = "cityId", source = "registerReq.cityId", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE),
            @Mapping(target = "etc", source = "registerReq.etc"),
            @Mapping(target = "zipCode", source = "registerReq.zipCode"),
            @Mapping(target = "id", ignore = true)
    })
    TempCompanyAddress toCompanyAddress(CompanyRegisterReq registerReq);

    @Mappings({
            @Mapping(target = "status",source = "status"),
            @Mapping(target = "id", ignore = true)
    })
    Company toCompany(TempCompany tempCompany, int status);

    @Mappings({
            @Mapping(target = "id", ignore = true)
    })
    CompanyAddress toCompanyAddress(TempCompanyAddress tempCompanyAddress);
}
