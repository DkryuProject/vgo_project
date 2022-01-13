package io.vengine.api.v1.companyInfo.mapper;

import io.vengine.api.v1.companyInfo.dto.CompanyBizDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.companyInfo.entity.*;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = CompanyMapper.class
)
public interface CompanyInfoEntityMapper {
    CompanyInfoEntityMapper INSTANCE = Mappers.getMapper(CompanyInfoEntityMapper.class);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "cbdCovers", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toSeason(CompanyInfoDto.Request request, User user, @MappingTarget CompanySeason companySeason);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "mclPreBookingList", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toProgram(CompanyInfoDto.Request request, User user, @MappingTarget CompanyGarmentProgram companyGarmentProgram);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "cbdCovers", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    void toOrder(CompanyInfoDto.Request request, User user, @MappingTarget CompanyOrderType companyOrderType);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toMarket(CompanyInfoDto.Request request, User user, @MappingTarget CompanyGarmentMarket companyGarmentMarket);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toUsage(CompanyInfoDto.Request request, User user, @MappingTarget CompanyUsage companyUsage);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "type", source = "type"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toCost(CompanyInfoDto.Request request, String type, User user, @MappingTarget CompanyCost companyCost);

    @Mappings({
            @Mapping(target = "name", source = "request.name"),
            @Mapping(target = "garmentCategory", source = "request.garmentCategory"),
            @Mapping(target = "sizeGroup", source = "request.sizeGroup"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toSize(CompanyInfoDto.Request request, User user, @MappingTarget CompanyGarmentSize companyGarmentSize);

    @Mappings({
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toRelation(CompanyInfoDto.RelationRequest request, User user, @MappingTarget  CompanyRelation companyRelation);

    @Mappings({
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toBuyer(CompanyInfoDto.BuyerRequest item, User user, @MappingTarget CompanyBuyer companyBuyer);

    @Mappings({
            @Mapping(target = "relationType", source = "request.relationType"),
            @Mapping(target = "bizCompany", source = "request.bizCompanyID"),
            @Mapping(target = "companyRegister", source = "user.compId"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "id", ignore = true)
    })
    void toBizRelation(CompanyBizDto.BizRelationRequest request, User user, @MappingTarget CompanyBizRelation companyBizRelation);

    @Mappings({
            @Mapping(target = "relationType", source = "request.relationType"),
            @Mapping(target = "bizCompany", source = "company"),
            @Mapping(target = "companyRegister", source = "user.compId"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "status", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "id", ignore = true)
    })
    CompanyBizRelation toBizRelation(CompanyBizDto.NewPartnerRequest request, Company company, User user);

    @Mapping(target = "id", source = "id")
    CompanyOrderType toOrder(Long id);

    @Mapping(target = "id", source = "id")
    CompanySeason toSeason(Long id);

    @Mapping(target = "id", source = "id")
    CompanyCost toCost(Long id);

    @Mapping(target = "id", source = "id")
    CompanyGarmentProgram toProgram(Long id);

    @Mapping(target = "id", source = "id")
    CompanyUsage toUsage(Long id);

    @Mapping(target = "id", source = "id")
    CompanyGarmentSize toSize(Long id);

    @Mapping(target = "id", source = "id")
    CompanyGarmentMarket toMarket(Long id);

    @Mapping(target = "id", source = "id")
    CompanyBizRelation toBizRelation(Long id);

    @Mapping(target = "id", source = "id")
    CompanyTerms toTerms(Long id);
}
