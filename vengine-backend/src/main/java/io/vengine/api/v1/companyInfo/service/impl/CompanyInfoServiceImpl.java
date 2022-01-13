package io.vengine.api.v1.companyInfo.service.impl;

import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.CompanyInfoType;
import io.vengine.api.common.enums.DelFlag;
import io.vengine.api.common.enums.RelationType;
import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.common.filters.CompanyInfoSpecification;
import io.vengine.api.common.filters.CompanySpecification;
import io.vengine.api.common.utils.JsonUtil;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.dto.CompanyBizDto;
import io.vengine.api.v1.companyInfo.dto.CompanyDocRequestDto;
import io.vengine.api.v1.companyInfo.dto.CompanyInfoDto;
import io.vengine.api.v1.companyInfo.dto.CompanyTermsResponse;
import io.vengine.api.v1.companyInfo.entity.*;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoEntityMapper;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoMapper;
import io.vengine.api.v1.companyInfo.repository.*;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.mcl.entity.MclMaterialAdhocPurchaseOrderPublish;
import io.vengine.api.v1.mcl.entity.MclMaterialPurchaseOrder;
import io.vengine.api.v1.mcl.repository.MclMaterialAdhocPurchaseOrderPublishRepository;
import io.vengine.api.v1.mcl.repository.MclMaterialPurchaseOrderRepository;
import io.vengine.api.v1.user.entity.Company;
import io.vengine.api.v1.user.entity.CompanyAddress;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.entity.UserMailSend;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import io.vengine.api.v1.user.mapper.UserMapper;
import io.vengine.api.v1.user.repository.CompanyRepository;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.DepartmentService;
import io.vengine.api.v1.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CompanyInfoServiceImpl implements CompanyInfoService {
    @Autowired
    CompanyRelationRepository companyRelationRepository;

    @Autowired
    CompanySeasonRepository companySeasonRepository;

    @Autowired
    CompanyTermsRepository companyTermsRepository;

    @Autowired
    CompanyUsageRepository companyUsageRepository;

    @Autowired
    CompanyFactoryStoreRepository companyFactoryStoreRepository;

    @Autowired
    CompanyForwarderRepository companyForwarderRepository;

    @Autowired
    CompanyGarmentProgramRepository companyGarmentProgramRepository;

    @Autowired
    CompanyGarmentSizeRepository companyGarmentSizeRepository;

    @Autowired
    CompanyGarmentMarketRepository companyGarmentMarketRepository;

    @Autowired
    CompanyOrderTypeRepository companyOrderTypeRepository;

    @Autowired
    CompanyCostRepository companyCostRepository;

    @Autowired
    CompanyBuyerRepository companyBuyerRepository;

    @Autowired
    CompanyDomainRelationRepository companyDomainRelationRepository;

    @Autowired
    CompanyBizRelationRepository companyBizRelationRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    CompanyDocumentCodeRepository companyDocumentCodeRepository;

    @Autowired
    CompanyService companyService;

    @Autowired
    UserService userService;

    @Autowired
    CommonService commonService;

    @Autowired
    DepartmentService departmentService;

    @Autowired
    MclMaterialPurchaseOrderRepository mclMaterialPurchaseOrderRepository;

    @Autowired
    MclMaterialAdhocPurchaseOrderPublishRepository mclMaterialAdhocPurchaseOrderPublishRepository;

    @Autowired
    CompanyBizRequestRepository companyBizRequestRepository;

    @Override
    public CompanyInfoDto.PageDto findCompanyInfo(String type, User user, Pageable pageable) {
        Page pageResult;

        if(CompanyInfoType.relation.getKey().equals(type)){
            pageResult = companyRelationRepository.findAll(new CompanySpecification<CompanyRelation>(user.getCompId()), pageable);
        }else if(CompanyInfoType.season.getKey().equals(type)){
            pageResult = companySeasonRepository.findAll(new CompanySpecification<CompanySeason>(user.getCompId()), pageable);
        }else if(CompanyInfoType.usage.getKey().equals(type)){
            pageResult = companyUsageRepository.findAll(new CompanySpecification<CompanyUsage>(user.getCompId()), pageable);
        }else if(CompanyInfoType.factory.getKey().equals(type)){
            pageResult = companyFactoryStoreRepository.findAll(new CompanySpecification<CompanyFactoryStore>(user.getCompId()), pageable);
        }else if(CompanyInfoType.forwarder.getKey().equals(type)){
            pageResult = companyForwarderRepository.findAll(new CompanySpecification<CompanyForwarder>(user.getCompId()), pageable);
        }else if(CompanyInfoType.program.getKey().equals(type)){
            pageResult = companyGarmentProgramRepository.findAll(new CompanySpecification<CompanyGarmentProgram>(user.getCompId()), pageable);
        }else if(CompanyInfoType.market.getKey().equals(type)){
            pageResult = companyGarmentMarketRepository.findAll(new CompanySpecification<CompanyGarmentMarket>(user.getCompId()), pageable);
        }else if(CompanyInfoType.size.getKey().equals(type)){
            pageResult = companyGarmentSizeRepository.findAll(new CompanySpecification<CompanyGarmentSize>(user.getCompId()), pageable);
        }else if(CompanyInfoType.order.getKey().equals(type)){
            pageResult = companyOrderTypeRepository.findAll(new CompanySpecification<CompanyOrderType>(user.getCompId()), pageable);
        }else if(CompanyInfoType.buyer.getKey().equals(type)){
            pageResult = companyBuyerRepository.findAll(new CompanySpecification<CompanyBuyer>(user.getCompId()), pageable);
        }else if(CompanyInfoType.indirect.getKey().equals(type) || CompanyInfoType.direct.getKey().equals(type)){
            Map<String, Object> filter = new HashMap<>();
            filter.put("type", type);
            pageResult = companyCostRepository.findAll(CompanyInfoSpecification.searchCost(filter).and(new CompanySpecification<CompanyCost>(user.getCompId())), pageable);
        }else{
            throw new BusinessException(ErrorCode.COMPANY_INFO_TYPE_INVALID);
        }
        CompanyInfoDto.PageDto pageDto= new CommonDto.PageDto();
        pageDto.setContent(mapperChange(pageResult.getContent(), type));
        pageDto.setTotalElements(pageResult.getTotalElements());
        pageDto.setTotalPages(pageResult.getTotalPages());
        pageDto.setSize(pageResult.getSize());
        pageDto.setNumber(pageResult.getNumber());
        return pageDto;
    }

    @Override
    public List findCompanyInfo(String type, User user) {
        List list;

        if(CompanyInfoType.relation.getKey().equals(type)){
            list = companyRelationRepository.findAll(new CompanySpecification<CompanyRelation>(user.getCompId()));
        }else if(CompanyInfoType.season.getKey().equals(type)){
            list = companySeasonRepository.findAll(new CompanySpecification<CompanySeason>(user.getCompId()));
        }else if(CompanyInfoType.usage.getKey().equals(type)){
            list = companyUsageRepository.findAll(new CompanySpecification<CompanyUsage>(user.getCompId()));
        }else if(CompanyInfoType.factory.getKey().equals(type)){
            list = companyFactoryStoreRepository.findAll(new CompanySpecification<CompanyFactoryStore>(user.getCompId()));
        }else if(CompanyInfoType.forwarder.getKey().equals(type)){
            list = companyForwarderRepository.findAll(new CompanySpecification<CompanyForwarder>(user.getCompId()));
        }else if(CompanyInfoType.program.getKey().equals(type)){
            list = companyGarmentProgramRepository.findAll(new CompanySpecification<CompanyGarmentProgram>(user.getCompId()));
        }else if(CompanyInfoType.market.getKey().equals(type)){
            list = companyGarmentMarketRepository.findAll(new CompanySpecification<CompanyGarmentMarket>(user.getCompId()));
        }else if(CompanyInfoType.size.getKey().equals(type)){
           list = companyGarmentSizeRepository.findAll(new CompanySpecification<CompanyGarmentSize>(user.getCompId()));
        }else if(CompanyInfoType.order.getKey().equals(type)){
            list = companyOrderTypeRepository.findAll(new CompanySpecification<CompanyOrderType>(user.getCompId()));
        }else if(CompanyInfoType.buyer.getKey().equals(type)){
            list = companyBuyerRepository.findAll(new CompanySpecification<CompanyBuyer>(user.getCompId()));
        }else if(CompanyInfoType.indirect.getKey().equals(type) || CompanyInfoType.direct.getKey().equals(type)){
            Map<String, Object> filter = new HashMap<>();
            filter.put("type", type);
            list = companyCostRepository.findAll(CompanyInfoSpecification.searchCost(filter).and(new CompanySpecification<CompanyCost>(user.getCompId())));
        }else{
            throw new BusinessException(ErrorCode.COMPANY_INFO_TYPE_INVALID);
        }
        return mapperChange(list, type);
    }

    private List mapperChange(List list, String type) {
        if(CompanyInfoType.relation.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toRelationDto(list);
        }else if(CompanyInfoType.season.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toSeasonDto(list);
        }else if(CompanyInfoType.usage.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toUsageDto(list);
        }else if(CompanyInfoType.factory.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toFactoryDto(list);
        }else if(CompanyInfoType.forwarder.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toForwardDto(list);
        }else if(CompanyInfoType.program.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toProgramDto(list);
        }else if(CompanyInfoType.market.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toMarketDto(list);
        }else if(CompanyInfoType.size.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toSizeDto(list);
        }else if(CompanyInfoType.order.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toOrderDto(list);
        }else if(CompanyInfoType.indirect.getKey().equals(type) || CompanyInfoType.direct.getKey().equals(type)){
            return CompanyInfoMapper.INSTANCE.toCostDto(list);
        }
        return null;
    }

    @Override
    public List saveSeasons(List<CompanyInfoDto.Request> items, User user) {
        List list = new ArrayList<>();
        CompanySeason companySeason;
        for (CompanyInfoDto.Request item: items){
            companySeason = new CompanySeason();
            if(item.getName() == null){
                throw new BusinessException(ErrorCode.COMPANY_INFO_NAME_EMPTY);
            }
            if(item.getId() != null){
                companySeason = findSeasonById(item.getId());
                if(companySeason.getCbdCovers().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_MODIFY);
                }
            }
            CompanyInfoEntityMapper.INSTANCE.toSeason(item, user, companySeason);
            list.add(companySeason);
        }
        return companySeasonRepository.saveAll(list);
    }

    @Override
    public List savePrograms(List<CompanyInfoDto.Request> items, User user) {
        List list = new ArrayList<>();
        CompanyGarmentProgram companyGarmentProgram;
        for (CompanyInfoDto.Request item: items){
            companyGarmentProgram = new CompanyGarmentProgram();
            if(item.getName() == null){
                throw new BusinessException("Name is Not Empty", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(item.getId() != null){
                companyGarmentProgram = findProgramById(item.getId());
                if(companyGarmentProgram.getMclPreBookingList().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_MODIFY);
                }
            }
            CompanyInfoEntityMapper.INSTANCE.toProgram(item, user, companyGarmentProgram);
            list.add(companyGarmentProgram);
        }
        return companyGarmentProgramRepository.saveAll(list);
    }

    @Override
    public List saveOrders(List<CompanyInfoDto.Request> items, User user) {
        List list = new ArrayList<>();
        CompanyOrderType companyOrderType;
        for (CompanyInfoDto.Request item: items){
            companyOrderType = new CompanyOrderType();
            if(item.getName() == null){
                throw new BusinessException("Name is Not Empty", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(item.getId() != null){
                companyOrderType = findOrderById(item.getId());
                if(companyOrderType.getCbdCovers().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_MODIFY);
                }
            }
            CompanyInfoEntityMapper.INSTANCE.toOrder(item, user, companyOrderType);
            list.add(companyOrderType);
        }
        return companyOrderTypeRepository.saveAll(list);
    }

    @Override
    public List saveMarkets(List<CompanyInfoDto.Request> items, User user) {
        List list = new ArrayList<>();
        CompanyGarmentMarket companyGarmentMarket;
        for (CompanyInfoDto.Request item: items){
            companyGarmentMarket = new CompanyGarmentMarket();
            if(item.getName() == null){
                throw new BusinessException("Name is Not Empty", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(item.getId() != null){
                companyGarmentMarket = findMarketById(item.getId());
                if(companyGarmentMarket.getMclGarmentMarkets().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_MODIFY);
                }
            }
            CompanyInfoEntityMapper.INSTANCE.toMarket(item, user, companyGarmentMarket);
            list.add(companyGarmentMarket);
        }
        return companyGarmentMarketRepository.saveAll(list);
    }

    @Override
    public List saveUsages(List<CompanyInfoDto.Request> items, User user) {
        List list = new ArrayList<>();
        CompanyUsage companyUsage;
        for (CompanyInfoDto.Request item: items){
            companyUsage = new CompanyUsage();
            if(item.getName() == null){
                throw new BusinessException("Name is Not Empty", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(item.getId() != null){
                companyUsage = findCompanyUsageById(item.getId());
            }
            CompanyInfoEntityMapper.INSTANCE.toUsage(item, user, companyUsage);
            list.add(companyUsage);
        }
        return companyUsageRepository.saveAll(list);
    }

    @Override
    public List saveCosts(List<CompanyInfoDto.Request> items, String type, User user) {
        List list = new ArrayList<>();
        CompanyCost companyCost;
        for (CompanyInfoDto.Request item: items){
            companyCost = new CompanyCost();
            if(item.getName() == null){
                throw new BusinessException("Name is Not Empty", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(item.getId() != null){
                companyCost = findCompanyCostById(item.getId());
                if(companyCost.getCbdMaterialCostings().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_MODIFY);
                }
            }
            CompanyInfoEntityMapper.INSTANCE.toCost(item, type, user, companyCost);
            list.add(companyCost);
        }
        return companyCostRepository.saveAll(list);
    }

    @Override
    public List saveSizes(List<CompanyInfoDto.Request> items, User user) {
        List list = new ArrayList<>();
        CompanyGarmentSize companyGarmentSize;
        for (CompanyInfoDto.Request item: items){
            companyGarmentSize = new CompanyGarmentSize();
            if(item.getName() == null){
                throw new BusinessException("Name is Not Empty", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(item.getId() != null){
                companyGarmentSize = findCompanySizeById(item.getId());
               // if(companyGarmentSize.getMclGarmentSizes().size()>0){
               //     throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_MODIFY);
               // }
            }
            CompanyInfoEntityMapper.INSTANCE.toSize(item, user, companyGarmentSize);
            list.add(companyGarmentSize);
        }
        return companyCostRepository.saveAll(list);
    }

    @Override
    public List saveCompanyRelation(List<CompanyInfoDto.RelationRequest> items, User user) {
        List list = new ArrayList<>();
        CompanyRelation companyRelation;
        for (CompanyInfoDto.RelationRequest item: items){
            companyRelation = new CompanyRelation();

            if(item.getId() != null){
                companyRelation = findCompanyRelationById((item.getId()));
            }
            CompanyInfoEntityMapper.INSTANCE.toRelation(item, user, companyRelation);
            list.add(companyRelationRepository.save(companyRelation));
        }
        return list;
    }

    @Override
    public List saveCompanyBuyer(List<CompanyInfoDto.BuyerRequest> items, User user) {
        List list = new ArrayList<>();
        CompanyBuyer companyBuyer;
        for (CompanyInfoDto.BuyerRequest item: items){
            companyBuyer = new CompanyBuyer();

            if(item.getId() != null){
                companyBuyer = findCompanyBuyerById((item.getId()));
            }
            CompanyInfoEntityMapper.INSTANCE.toBuyer(item, user, companyBuyer);
            list.add(companyBuyerRepository.save(companyBuyer));
        }
        return list;
    }

    @Override
    public CompanyInfoDto.Take deleteCompanyInfo(String type, List<Long> ids, User user) {
        for(Long id : ids){
            if(CompanyInfoType.relation.getKey().equals(type)){
                CompanyRelation updateData = companyRelationRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_RELATION_NOT_FOUND));
                updateData.setDelFlag(DelFlag.D.getKey());
                updateData.setUser(user);
                companyRelationRepository.save(updateData);
            }else if(CompanyInfoType.season.getKey().equals(type)){
                CompanySeason updateData = companySeasonRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_SEASON_NOT_FOUND));

                if(updateData.getCbdCovers().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_DELETE);
                }
                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companySeasonRepository.save(updateData);
                companySeasonRepository.delete(updateData);
            }else if(CompanyInfoType.usage.getKey().equals(type)){
                CompanyUsage updateData = companyUsageRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_USAGE_NOT_FOUND));

                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companyUsageRepository.save(updateData);
                companyUsageRepository.delete(updateData);
            }else if(CompanyInfoType.factory.getKey().equals(type)){
                CompanyFactoryStore updateData = companyFactoryStoreRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_FACTORY_NOT_FOUND));

                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companyFactoryStoreRepository.save(updateData);
                companyFactoryStoreRepository.delete(updateData);
            }else if(CompanyInfoType.forwarder.getKey().equals(type)){
                CompanyForwarder updateData = companyForwarderRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_FORWARD_NOT_FOUND));

                if(updateData.getCompanyBuyerDeductions().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_DELETE);
                }

                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companyForwarderRepository.save(updateData);
                companyForwarderRepository.delete(updateData);
            }else if(CompanyInfoType.program.getKey().equals(type)){
                CompanyGarmentProgram updateData = companyGarmentProgramRepository.findById(id)
                        .orElseThrow(()-> new BusinessException( ErrorCode.COMPANY_PROGRAM_NOT_FOUND));

                if(updateData.getMclPreBookingList().size()>0){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_DELETE);
                }

                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companyGarmentProgramRepository.save(updateData);
                companyGarmentProgramRepository.delete(updateData);
            }else if(CompanyInfoType.market.getKey().equals(type)){
                CompanyGarmentMarket updateData = companyGarmentMarketRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_MARKET_NOT_FOUND));

                if(updateData.getMclGarmentMarkets().size()>0
                        || updateData.getCompanyBuyers().size()>0
                ){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_DELETE);
                }

                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companyGarmentMarketRepository.save(updateData);
                companyGarmentMarketRepository.delete(updateData);
            }else if(CompanyInfoType.order.getKey().equals(type)){
                CompanyOrderType updateData = companyOrderTypeRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_ORDER_TYPE_NOT_FOUND));

                if(updateData.getCbdCovers().size()>0
                        || updateData.getMclMaterialAdhocPurchaseOrderItemPublishes().size()>0
                        || updateData.getMclMaterialPurchaseOrderItemPublishes().size()>0
                        || updateData.getMclMaterialPurchaseOrderItems().size()>0
                ){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_DELETE);
                }

                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companyGarmentMarketRepository.save(updateData);
                companyOrderTypeRepository.delete(updateData);
            }else if(CompanyInfoType.indirect.getKey().equals(type) || CompanyInfoType.direct.getKey().equals(type)){
                CompanyCost updateData = companyCostRepository.findById(id)
                        .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_COST_NOT_FOUND));

                if(updateData.getCbdMaterialCostings().size()>0
                ){
                    throw new BusinessException(ErrorCode.COMPANY_INFO_NOT_DELETE);
                }

                //updateData.setDelFlag(DelFlag.D.getKey());
                //updateData.setUser(user);
                //companyGarmentMarketRepository.save(updateData);
                companyCostRepository.delete(updateData);
            }
        }

        return CompanyInfoDto.toTake(Long.valueOf("0"), "delete", user);
    }

    @Override
    public CompanySeason findSeasonById(Long seasonId) {
        return companySeasonRepository.findById(seasonId)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_SEASON_NOT_FOUND));
    }

    @Override
    public CompanyCost findCompanyCostById(Long companyCostId) {
        return companyCostRepository.findById(companyCostId)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_COST_NOT_FOUND));
    }

    @Override
    public CompanyUsage findCompanyUsageById(Long usagePlaceId) {
        return companyUsageRepository.findById(usagePlaceId)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_USAGE_NOT_FOUND));
    }

    @Override
    public CompanyGarmentSize findCompanySizeById(Long id) {
        return companyGarmentSizeRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_SIZE_NOT_FOUND));
    }

    @Override
    public CompanyRelation findCompanyRelationById(Long id) {
        return companyRelationRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_RELATION_NOT_FOUND));
    }

    @Override
    public CompanyBuyer findCompanyBuyerById(Long id) {
        return companyBuyerRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_BUYER_NOT_FOUND));
    }

    @Override
    public List<String> findGarmentSizeGroups(Company company) {
        return companyGarmentSizeRepository.findGarmentSizeGroups(company);
    }

    @Override
    public CompanyGarmentProgram findProgramById(Long companyProgramID) {
        return companyGarmentProgramRepository.findById(companyProgramID)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_PROGRAM_NOT_FOUND));
    }

    @Override
    public CompanyOrderType findOrderById(Long id) {
        return companyOrderTypeRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_ORDER_TYPE_NOT_FOUND));
    }

    @Override
    public CompanyGarmentMarket findMarketById(Long id) {
        return companyGarmentMarketRepository.findById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_MARKET_NOT_FOUND));
    }

    @Override
    public List<CompanyInfoDto.Response> findGarmentSizeBySizeGroup(String groupName) {
        return companyGarmentSizeRepository.findGarmentSizeBySizeGroup(groupName);
    }

    @Override
    public Optional<CompanyDomainRelation> domainCheck(String domain) {
        return companyDomainRelationRepository.findByRelationDomain(domain);
    }

    @Override
    public CommonDto.PageDto<CompanyBizRelation> findCompanyBizRelation(String searchKeyword, Company company, Pageable pageable) {
        Page pageResult = companyBizRelationRepository.searchAll(searchKeyword, company, pageable);
        CompanyInfoDto.PageDto pageDto= new CommonDto.PageDto();
        pageDto.setContent(pageResult.getContent());
        pageDto.setTotalElements(pageResult.getTotalElements());
        pageDto.setTotalPages(pageResult.getTotalPages());
        pageDto.setSize(pageResult.getSize());
        pageDto.setNumber(pageResult.getNumber());
        return pageDto;
    }

    @Override
    @Transactional
    public void saveCompanyBizRelation(List<CompanyBizDto.BizRelationRequest> relationRequests, User user) {
        for (CompanyBizDto.BizRelationRequest relationRequest: relationRequests){
            CompanyBizRelation companyBizRelation = new CompanyBizRelation();
            CompanyInfoEntityMapper.INSTANCE.toBizRelation(relationRequest, user, companyBizRelation);
            if(!companyRepository.findById(companyBizRelation.getBizCompany().getId()).isPresent()){
                throw new BusinessException(ErrorCode.COMPANYID_NOT_FOUND);
            }
            if(companyBizRelation.getBizCompany().equals(companyBizRelation.getCompanyRegister())){
                throw new BusinessException(ErrorCode.COMPANY_RELATION_SAME_COMPANY);
            }
            if(companyBizRelationRepository
                    .findByRelationTypeAndBizCompanyAndCompanyRegister(companyBizRelation.getRelationType(),companyBizRelation.getBizCompany(), companyBizRelation.getCompanyRegister())
                    .isPresent())
            {
                throw new BusinessException(ErrorCode.COMPANY_RELATION_DUPLICATION);
            }
            companyBizRelation.setStatus("W");
            CompanyBizRelation result = companyBizRelationRepository.save(companyBizRelation);

            //회사 관계 요청 정보 저장
            CompanyBizRequest companyBizRequest = companyBizRequestRepository.save(CompanyInfoMapper.INSTANCE.toBizRequest(result, 2, user));

            //파트너 등록시 메일 발송
            for(User insertUser: userService.findUsers(companyBizRequest.getResponseCompany())){
                userService.saveUserMailSend(
                        UserMailSend.builder()
                                .email(insertUser.getEmail())
                                .sendType(9)
                                .typeIdx(companyBizRequest.getId())
                                .status(0)
                                .build()
                );
            }
        }
    }

    @Override
    public void saveCompanyBizRelation(String relationType, Company company, User user) {
        CompanyBizRelation companyBizRelation = new CompanyBizRelation();
        companyBizRelation.setRelationType(RelationType.of(relationType));
        companyBizRelation.setBizCompany(company);
        companyBizRelation.setCompanyRegister(user.getCompId());
        companyBizRelation.setStatus("A");
        companyBizRelation.setUser(user);
        companyBizRelationRepository.save(companyBizRelation);
    }

    @Override
    @Transactional
    public void saveNewPartner(CompanyBizDto.NewPartnerRequest request, User user) {
        //company default  type  vendor로 세팅
        CommonBasicInfo typeVendor = commonService.findBasicInfoById(Long.parseLong("2"));

        //신규 회사 저장
        Company company = companyService.saveCompany(CompanyMapper.INSTANCE.toCompany(request, typeVendor));

        //user 동일한 이메일이 있는 체크
        if(userService.findEmail(request.getEmail()).isPresent()){
            throw new BusinessException(ErrorCode.EMAIL_DUPLICATION);
        }

        //user 저장
        User inviteUser = UserMapper.INSTANCE.toUser(request, typeVendor);
        inviteUser.setManager(1);
        inviteUser.setStatus(UserStatus.W); //사용자 상태(A=active, D=detach, W=waiting)
        inviteUser.setCompId(company);
        inviteUser.setLevelId(userService.findUserLevel("Manager")
                .orElseThrow(()-> new BusinessException(ErrorCode.MANAGER_USER_LEVEL_NOT_FOUND)));
        inviteUser.setDeptId(departmentService.getId(Long.valueOf(1))
                .orElseThrow(()-> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND)));

        userService.saveUser(inviteUser);

        //company address 저장
        CompanyAddress address = CompanyMapper.INSTANCE.toAddress(request);
        address.setWorkPlace(company.getName());
        address.setCompany(company);
        address.setRepresentitive(1);
        address.setStatus("A");
        address.setCommonBizType(company.getCommonBizType());
        address.setCompanyInfo(user.getCompId());
        address.setDepartment(inviteUser.getDeptId());
        address.setUser(user);
        companyService.saveCompanyAddress(address);

        CompanyBizRelation companyBizRelation = CompanyInfoEntityMapper.INSTANCE.toBizRelation(request, company, user);
        companyBizRelation.setStatus("A");
        companyBizRelationRepository.save(companyBizRelation);
/*
        try{
            mailService.signUpRequest(inviteUser);
        }catch (Exception e){
            e.printStackTrace();
        }
 */
    }

    @Override
    public List<CompanyBizRelation> findCompanyByRelationType(String relationType, Company company) {
        //return companyBizRelationRepository.findByRelationTypeAndStatusAndCompanyRegister(RelationType.of(relationType), "A", company);
        return companyBizRelationRepository.findByRelationTypeAndStatusNotAndCompanyRegister(RelationType.of(relationType), "D", company);
    }

    @Override
    public List<CompanyBizRelation> findRelationCompany(Company company) {
        return companyBizRelationRepository.findByStatusNotAndCompanyRegister("D", company);
    }

    @Override
    public List<CompanyRelation> findBrandByBuyer(Long buyerID, Company company) {
        Company buyer = companyRepository.findById(buyerID)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANYID_NOT_FOUND));

        return companyRelationRepository.findByBuyerCompanyAndCompany(buyer, company);
    }

    @Override
    @Transactional
    public String findDocumentNumberIdx(Company company, String docName) {
        String docNumber= null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
        Calendar c1 = Calendar.getInstance();
        String today = sdf.format(c1.getTime());

        CommonBasicInfo docInfo = commonService.findCommonBasicInfoByTypeAndCmName1("document_type",  docName)
                .orElseThrow(()-> new BusinessException("Document Type is not found", ErrorCode.INTERNAL_SERVER_ERROR));

        Optional<CompanyDocumentCode> documentCodeOptional = companyDocumentCodeRepository.findByCompanyAndCommonDocInfo(company, docInfo);

        CompanyDocumentCode documentCode = new CompanyDocumentCode();
        if(!documentCodeOptional.isPresent()){
            documentCode = companyDocumentCodeRepository.save(new CompanyDocumentCode(company, docInfo, "RM", 0));
        }else {
            documentCode = documentCodeOptional.get();
        }

        int idx =1;

        if(checkPoNumber(today).size()>0){
            idx = documentCode.getIdx()+1;
        }

        docNumber = today+String.format("%04d", idx);

        documentCode.setIdx(idx);
        companyDocumentCodeRepository.save(documentCode);

        return docNumber;
    }

    private List<String> checkPoNumber(String value) {
        List<String> list = new ArrayList<>();
        list.addAll(
                mclMaterialPurchaseOrderRepository.findByMaterialPurchaseOrderNumberContaining(value)
                .stream()
                .map(MclMaterialPurchaseOrder::getMaterialPurchaseOrderNumber)
                .collect(Collectors.toList())
        );
        list.addAll(
                mclMaterialAdhocPurchaseOrderPublishRepository.findByMaterialPurchaseOrderNumberContaining(value)
                        .stream()
                        .map(MclMaterialAdhocPurchaseOrderPublish::getMaterialPurchaseOrderNumber)
                        .collect(Collectors.toList())
        );
        return list;
    }

    @Override
    public List<CompanyDocumentCode> findAllDocumentCode(Company company) {
        return companyDocumentCodeRepository.findByCompany(company);
    }

    @Override
    public void saveDocumentCode(CompanyDocRequestDto request, User user) {
        CommonBasicInfo commonDocInfo = commonService.findBasicInfoById(request.getCommonDocInfoId());

        if(!companyDocumentCodeRepository.findByCompanyAndCommonDocInfo(user.getCompId(), commonDocInfo).isPresent()){
            CompanyDocumentCode documentCode = new CompanyDocumentCode();
            documentCode.setCompany(user.getCompId());
            documentCode.setCommonDocInfo(commonDocInfo);
            documentCode.setDocCode(request.getDocCode());
            documentCode.setIdx(0);
            companyDocumentCodeRepository.save(documentCode);
        }
    }

    @Override
    public Optional<CompanyOrderType> findOrderByName(String name, Company company) {
        return companyOrderTypeRepository.findByNameAndCompany(name, company);
    }

    @Override
    @Transactional
    public void modifyCompanyBizRelationStatus(List<CompanyBizDto.BizRelationStatusRequest> bizRelationStatusRequests, User user) {
        for (CompanyBizDto.BizRelationStatusRequest bizRelationStatusRequest : bizRelationStatusRequests){
            CompanyBizRelation companyBizRelation = companyBizRelationRepository.findById(bizRelationStatusRequest.getBizRelationId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_RELATION_NOT_FOUND));

            companyBizRelation.setStatus(bizRelationStatusRequest.getStatus());
            companyBizRelation.setRelationType(RelationType.of(bizRelationStatusRequest.getRelationType()));
            companyBizRelationRepository.save(companyBizRelation);
        }
    }

    @Override
    public void saveCompanyTerms(CompanyTerms companyTerms) {
        companyTermsRepository.save(companyTerms);
    }

    @Override
    public CompanyTerms findByCompanyTerms(Long companyTermsID) {
        return companyTermsRepository.findById(companyTermsID)
                .orElseThrow(()-> new BusinessException(ErrorCode.COMPANY_TERMS_NOT_FOUND));
    }

    @Override
    public CompanyInfoDto.PageDto<CompanyTermsResponse> findAllCompanyTerms(Company company, Pageable pageable) {
        Page<CompanyTerms> companyTermsResponsePage = companyTermsRepository.findByCompany(company, pageable);
        CompanyInfoDto.PageDto pageDto= new CommonDto.PageDto();
        pageDto.setContent(CompanyInfoMapper.INSTANCE.toTermsDto(companyTermsResponsePage.getContent()));
        pageDto.setTotalElements(companyTermsResponsePage.getTotalElements());
        pageDto.setTotalPages(companyTermsResponsePage.getTotalPages());
        pageDto.setSize(companyTermsResponsePage.getSize());
        pageDto.setNumber(companyTermsResponsePage.getNumber());
        return pageDto;
    }

    @Override
    public List<CompanyTerms> findCompanyTermsByDocumentTypeAndMaterialType(
            CommonBasicInfo documentType, CommonBasicInfo materialType, Company company
    ) {
        return companyTermsRepository.findByDocumentTypeAndMaterialTypeAndCompany(documentType, materialType, company);
    }

    @Override
    public void deleteCompanyTerms(CompanyTerms companyTerms) {
        companyTerms.setDelFlag(DelFlag.D.getKey());
        companyTermsRepository.save(companyTerms);
    }

    @Override
    public String getTerms(List<String> materialTypes, Company company, String type) {
        List<CompanyTerms> companyTerms = companyTermsRepository.findByCompany(company)
                .stream()
               .filter(i-> i.getDocumentType().getCmName1().contains(type))
                .collect(Collectors.toList());

        if(companyTerms.size() == 0 || materialTypes.size() == 0){
            return null;
        }

        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map;
        for (String materialType: materialTypes){
            map = new HashMap<>();
            map.put("type", materialType);
            map.put("terms",
                    companyTerms.stream()
                            .filter(i -> i.getMaterialType().getCmName1().toUpperCase().equals(materialType.toUpperCase()))
                            .map(i-> i.getTerms())
                            .findFirst()
                            .orElse("")
                    );
            list.add(map);
        }
        return JsonUtil.getJsonArrayFromList(list).toJSONString();
    }

    @Override
    public CommonDto.PageDto<CompanyBizRequest> findCompanyBizRequest(Company company, Pageable pageable) {
        Page<CompanyBizRequest> pageResult = companyBizRequestRepository.findByResponseCompany(company, pageable);
        CompanyInfoDto.PageDto pageDto= new CommonDto.PageDto();
        pageDto.setContent(CompanyInfoMapper.INSTANCE.toBizRequestDto(pageResult.getContent()));
        pageDto.setTotalElements(pageResult.getTotalElements());
        pageDto.setTotalPages(pageResult.getTotalPages());
        pageDto.setSize(pageResult.getSize());
        pageDto.setNumber(pageResult.getNumber());
        return pageDto;
    }

    @Override
    public Optional<CompanyBizRequest> findBizRequestById(Long id) {
        return companyBizRequestRepository.findById(id);
    }

    @Override
    public void modifyCompanyBizRequest(CompanyBizRequest companyBizRequest, String status, User user) {
        CompanyBizRelation companyBizRelation = companyBizRequest.getCompanyBizRelation();
        int sendType;
        if("approved".equals(status)){
            companyBizRequest.setApproveStatus(0);
            companyBizRelation.setStatus("A");
            sendType = 10;
        }else if("returned".equals(status)){
            companyBizRequest.setApproveStatus(1);
            companyBizRelation.setStatus("D");
            sendType = 11;
        }else{
            throw new BusinessException("Status is invalid", ErrorCode.INTERNAL_SERVER_ERROR);
        }
        companyBizRequestRepository.save(companyBizRequest);
        companyBizRelationRepository.save(companyBizRelation);

        //파트너 승인 반려시 메일
        for(User requestUser: userService.findUsers(companyBizRequest.getRequestCompany())){
            userService.saveUserMailSend(
                    UserMailSend.builder()
                            .email(requestUser.getEmail())
                            .sendType(sendType)
                            .typeIdx(companyBizRequest.getId())
                            .status(0)
                            .build()
            );
        }
    }

    @Override
    public Optional<CompanyBizRelation> findCompanyBizRelationById(Long id) {
        return companyBizRelationRepository.findById(id);
    }

    @Override
    public void modifyCompanyBizRelationStatusRequest(CompanyBizRelation companyBizRelation, String status, User user) {
        if("active".equals(status)){
            companyBizRelation.setStatus("W");
        }else if("deactive".equals(status)){
            companyBizRelation.setStatus("D");
        }else{
            throw new BusinessException("Status is invalid", ErrorCode.INTERNAL_SERVER_ERROR);
        }
        companyBizRelationRepository.save(companyBizRelation);

        CompanyBizRequest companyBizRequest = companyBizRequestRepository.save(CompanyInfoMapper.INSTANCE.toBizRequest(companyBizRelation, 2, user));

        if("active".equals(status)){
            //파트너 등록 요청 메일 발송
            for(User responseUser: userService.findUsers(companyBizRequest.getResponseCompany())){
                userService.saveUserMailSend(
                        UserMailSend.builder()
                                .email(responseUser.getEmail())
                                .sendType(9)
                                .typeIdx(companyBizRequest.getId())
                                .status(0)
                                .build()
                );
            }
        }
    }
}
