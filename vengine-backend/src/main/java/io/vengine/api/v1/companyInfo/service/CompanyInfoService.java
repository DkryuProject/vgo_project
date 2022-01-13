package io.vengine.api.v1.companyInfo.service;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.companyInfo.dto.CompanyBizDto;
import io.vengine.api.v1.companyInfo.dto.CompanyDocRequestDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.companyInfo.dto.CompanyTermsResponse;
import io.vengine.api.v1.companyInfo.entity.*;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CompanyInfoService {
    CompanyInfoDto.PageDto findCompanyInfo(String type, User user, Pageable pageable) throws Exception;

    List findCompanyInfo(String type, User user) throws Exception;

    List saveSeasons(List<CompanyInfoDto.Request> items, User user);

    List savePrograms(List<CompanyInfoDto.Request> items, User user);

    List saveOrders(List<CompanyInfoDto.Request> items, User user);

    List saveMarkets(List<CompanyInfoDto.Request> items, User user);

    List saveUsages(List<CompanyInfoDto.Request> items, User user);

    List saveCosts(List<CompanyInfoDto.Request> items, String type, User user);

    List saveSizes(List<CompanyInfoDto.Request> items, User user);

    List saveCompanyRelation(List<CompanyInfoDto.RelationRequest> items, User user);

    List saveCompanyBuyer(List<CompanyInfoDto.BuyerRequest> items, User user);

    CompanyInfoDto.Take deleteCompanyInfo(String type, List<Long> request, User user);

    CompanySeason findSeasonById(Long id);

    CompanyGarmentProgram findProgramById(Long id);

    CompanyOrderType findOrderById(Long id);

    CompanyGarmentMarket findMarketById(Long id);

    CompanyCost findCompanyCostById(Long id);

    CompanyUsage findCompanyUsageById(Long id);

    CompanyGarmentSize findCompanySizeById(Long id);

    CompanyRelation findCompanyRelationById(Long id);

    CompanyBuyer findCompanyBuyerById(Long id);

    List<String> findGarmentSizeGroups(Company company);

    List<CompanyInfoDto.Response> findGarmentSizeBySizeGroup(String groupName);

    Optional<CompanyDomainRelation> domainCheck(String domain);

    CommonDto.PageDto<CompanyBizRelation> findCompanyBizRelation(String searchKeyword, Company compId, Pageable pageable);

    void saveCompanyBizRelation(List<CompanyBizDto.BizRelationRequest> relationRequests, User user);

    void saveCompanyBizRelation(String relationType, Company company, User user);

    void saveNewPartner(CompanyBizDto.NewPartnerRequest request, User user);

    List<CompanyBizRelation> findCompanyByRelationType(String relationType, Company company);

    List<CompanyRelation> findBrandByBuyer(Long buyerID, Company company);

    String findDocumentNumberIdx(Company company, String docName);

    List<CompanyDocumentCode> findAllDocumentCode(Company compId);

    void saveDocumentCode(CompanyDocRequestDto request, User user);

    Optional<CompanyOrderType> findOrderByName(String name, Company compId);

    void modifyCompanyBizRelationStatus(List<CompanyBizDto.BizRelationStatusRequest> bizRelationStatusRequests, User user);

    void saveCompanyTerms(CompanyTerms companyTerms);

    CompanyTerms findByCompanyTerms(Long companyTermsID);

    CompanyInfoDto.PageDto<CompanyTermsResponse> findAllCompanyTerms(Company company, Pageable pageable);

    List<CompanyTerms> findCompanyTermsByDocumentTypeAndMaterialType(CommonBasicInfo documentType, CommonBasicInfo materialType, Company company);

    void deleteCompanyTerms(CompanyTerms companyTerms);

    String getTerms(List<String> collect, Company compId, String type);

    List<CompanyBizRelation> findRelationCompany(Company company);

    CommonDto.PageDto<CompanyBizRequest> findCompanyBizRequest(Company company, Pageable pageable);

    Optional<CompanyBizRequest> findBizRequestById(Long id);

    void modifyCompanyBizRequest(CompanyBizRequest companyBizRequest, String status, User user);

    Optional<CompanyBizRelation> findCompanyBizRelationById(Long id);

    void modifyCompanyBizRelationStatusRequest(CompanyBizRelation companyBizRelation, String status, User user);
}
