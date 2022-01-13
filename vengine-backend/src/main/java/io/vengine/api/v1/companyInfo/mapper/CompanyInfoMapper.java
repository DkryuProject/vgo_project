package io.vengine.api.v1.companyInfo.mapper;

import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.dto.*;
import io.vengine.api.v1.companyInfo.entity.*;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CommonMapper.class, CompanyMapper.class}
)
public interface CompanyInfoMapper {
    CompanyInfoMapper INSTANCE = Mappers.getMapper(CompanyInfoMapper.class);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toRelationDto(CompanyRelation companyRelation);

    List<CompanyInfoDto.Response> toRelationDto(List<CompanyRelation> companyRelation);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toSeasonDto(CompanySeason companySeason);

    List<CompanyInfoDto.Response> toSeasonDto(List<CompanySeason> companySeason);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toUsageDto(CompanyUsage companyUsage);

    List<CompanyInfoDto.Response> toUsageDto(List<CompanyUsage> companyUsage);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toFactoryDto(CompanyFactoryStore companyFactoryStore);

    List<CompanyInfoDto.Response> toFactoryDto(List<CompanyFactoryStore> companyFactoryStore);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toForwardDto(CompanyForwarder companyForwarder);

    List<CompanyInfoDto.Response> toForwardDto(List<CompanyForwarder> companyForwarder);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toProgramDto(CompanyGarmentProgram program);

    List<CompanyInfoDto.Response> toProgramDto(List<CompanyGarmentProgram> program);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toMarketDto(CompanyGarmentMarket market);

    List<CompanyInfoDto.Response> toMarketDto(List<CompanyGarmentMarket> market);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toSizeDto(CompanyGarmentSize size);

    List<CompanyInfoDto.Response> toSizeDto(List<CompanyGarmentSize> size);

    @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS")
    @Mapping(target = "createdInfo", source = "user")
    CompanyInfoDto.Response toOrderDto(CompanyOrderType order);

    List<CompanyInfoDto.Response> toOrderDto(List<CompanyOrderType> order);

    @Mappings({
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdInfo", source = "user"),
            @Mapping(target = "type", ignore = true)
    })
    CompanyInfoDto.Response toCostDto(CompanyCost cost);

    List<CompanyInfoDto.Response> toCostDto(List<CompanyCost> cost);

    @Mappings({
            @Mapping(target = "company", source = "company"),
    })
    CompanyDocDto toDocumentDto(CompanyDocumentCode companyDocumentCode);

    List<CompanyDocDto> toDocumentDto(List<CompanyDocumentCode> allDocumentCode);

    //Company Terms
    @Mappings({
            @Mapping(target = "documentType", source = "companyTermsRequest.documentType"),
            @Mapping(target = "materialType", source = "companyTermsRequest.materialType"),
            @Mapping(target = "terms", source = "companyTermsRequest.terms"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toTerms(CompanyTermsRequest companyTermsRequest, User user, @MappingTarget CompanyTerms companyTerms);

    @Mappings({
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdInfo", source = "user")
    })
    CompanyTermsResponse toTermsDto(CompanyTerms companyTerms);

    List<CompanyTermsResponse> toTermsDto(List<CompanyTerms> companyTerms);

    //Company Biz Request
    @Mappings({
            @Mapping(target = "companyBizRelation", source = "companyBizRelation"),
            @Mapping(target = "requestCompany", source = "user.compId"),
            @Mapping(target = "responseCompany", source = "companyBizRelation.bizCompany"),
            @Mapping(target = "approveStatus", source = "approveStatus"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "delFlag", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    CompanyBizRequest toBizRequest(CompanyBizRelation companyBizRelation, int approveStatus, User user);

    @Mappings({
            @Mapping(target = "updated", source = "updatedAt", dateFormat = "YYYY-MM-dd HH:mm:SS"),
            @Mapping(target = "createdInfo", source = "user")
    })
    CompanyBizRequestDto toBizRequestDto(CompanyBizRequest companyBizRequest);

    List<CompanyBizRequestDto> toBizRequestDto(List<CompanyBizRequest> companyBizRequests);
}
