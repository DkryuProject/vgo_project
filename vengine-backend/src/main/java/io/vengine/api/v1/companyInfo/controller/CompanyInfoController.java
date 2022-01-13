package io.vengine.api.v1.companyInfo.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.enums.CompanyInfoType;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.companyInfo.dto.*;
import io.vengine.api.v1.companyInfo.entity.CompanyBizRelation;
import io.vengine.api.v1.companyInfo.entity.CompanyBizRequest;
import io.vengine.api.v1.companyInfo.entity.CompanyTerms;
import io.vengine.api.v1.companyInfo.mapper.CompanyInfoMapper;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Api(tags = {"04. COMPANY INFO"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class CompanyInfoController {
    private final ResponseService responseService;

    @Autowired
    CompanyInfoService companyInfoService;

    @Autowired
    CompanyService companyService;

    @Autowired
    CommonService commonService;

    @ApiOperation(value = "Company Info 타입별 조회(Pageing)", notes = "type 유형\n" +
            "1 . relation: 관계사 및 회사코드\n2. season: 시즌 정보\n3. terms: 약관\n4. usage: 사용처\n5. factory: 공장 창고\n" +
            "6. forwarder: 포워드\n7. market: 마켓\n8. program: 프로그램\n9. size: 사이즈\n10. order: 오더타입\n11. buyer: 바이어 정보\n")
    @GetMapping(value = "/company-info/page")
    public PageResult findCompanyInfoPage(
            @ApiParam(value = "회사 공통 정보 타입", required = true) @RequestParam String type,
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    ) throws Exception {
        return responseService.getPageResult(companyInfoService.findCompanyInfo(type, user, PageRequest.of((page == 0) ? 0 : (page - 1), size)));
    }

    @ApiOperation(value = "Company Info 타입별 조회(list)", notes = "type 유형\n" +
            "1 . relation: 관계사 및 회사코드\n2. season: 시즌 정보\n3. terms: 약관\n4. usage: 사용처\n5. factory: 공장 창고\n" +
            "6. forwarder: 포워드\n7. market: 마켓\n8. program: 프로그램\n9. size: 사이즈\n10. order: 오더타입\n11. buyer: 바이어 정보\n")
    @GetMapping(value = "/company-info/list")
    public ListResult findCompanyInfoList(
            @ApiParam(value = "회사 공통 정보 타입", required = true) @RequestParam String type,
            @AuthenticationPrincipal User user
    ) throws Exception {
        return responseService.getListResult(companyInfoService.findCompanyInfo(type, user));
    }

    @ApiOperation(value = "회사 공통 정보 저장", notes = "타입에 따른 회사 공통 정보 저장\n")
    @PostMapping(value = "/company-info/{type}")
    public ListResult saveCompanyInfo(
            @ApiParam(value = "회사 공통 정보 타입", required = true) @PathVariable String type,
            @RequestBody @Valid List<CompanyInfoDto.Request> items,
            @AuthenticationPrincipal User user
    ){
        List list;
        if(CompanyInfoType.season.getKey().equals(type)){
            list = companyInfoService.saveSeasons(items, user);
        }else if(CompanyInfoType.program.getKey().equals(type)){
            list = companyInfoService.savePrograms(items, user);
        }else if(CompanyInfoType.order.getKey().equals(type)){
            list = companyInfoService.saveOrders(items, user);
        }else if(CompanyInfoType.market.getKey().equals(type)){
            list = companyInfoService.saveMarkets(items, user);
        }else if(CompanyInfoType.usage.getKey().equals(type)){
            list = companyInfoService.saveUsages(items, user);
        }else if(CompanyInfoType.indirect.getKey().equals(type) || CompanyInfoType.direct.getKey().equals(type)){
            list = companyInfoService.saveCosts(items, type, user);
        }else if(CompanyInfoType.size.getKey().equals(type)){
            list = companyInfoService.saveSizes(items, user);
        }else{
            throw new BusinessException("Company Info Type Invalid.", ErrorCode.INTERNAL_SERVER_ERROR);
        }
        return responseService.getListResult(list);
    }

    @ApiOperation(value = "관계사 및 회사코드 저장", notes = "관계사 및 회사코드 저장\n")
    @PostMapping(value = "/company-relation")
    public ListResult saveCompanyRelation(
            @RequestBody @Valid List<CompanyInfoDto.RelationRequest> items,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(companyInfoService.saveCompanyRelation(items, user));
    }

    @ApiOperation(value = "바이어관리 정보 저장", notes = "바이어관리 정보 저장\n")
    @PostMapping(value = "/company-buyer")
    public ListResult saveCompanyBuyer(
            @RequestBody @Valid List<CompanyInfoDto.BuyerRequest> items,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(companyInfoService.saveCompanyBuyer(items, user));
    }

    @ApiOperation(value = "회사 공통 정보 삭제", notes = "타입에 따른 회사 공통 정보 삭제\n")
    @DeleteMapping(value = "/company-info/{type}")
    public SingleResult<CompanyInfoDto.Take> deleteCompanyInfo(
            @ApiParam(value = "회사 공통 정보 타입", required = true) @PathVariable String type,  @RequestBody List<Long> ids, @AuthenticationPrincipal User user
    ){
        return responseService.getSingleResult(companyInfoService.deleteCompanyInfo(type, ids, user));
    }

    //@ApiOperation(value = "회사별 Garment size group 조회", notes = "나의 회사 Garment size group 을 조회한다\n")
    //@GetMapping(value = "/company/garment/sizes")
    public ListResult<String> findGarmentSizeGroups(
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(companyInfoService.findGarmentSizeGroups(user.getCompId()));
    }

    //@ApiOperation(value = "Garment Size Group으로 사이즈 조회", notes = "groupName: Garment Size Group Name (필수)\n")
    //@GetMapping(value = "/company/garment/size/{groupName}")
    public ListResult<CompanyInfoDto.Response> findGarmentSizeBySizeGroup(
            @ApiParam(value = "Garment Size Name", required = true) @PathVariable String groupName
    ){
        return responseService.getListResult(companyInfoService.findGarmentSizeBySizeGroup(groupName));
    }

    @ApiOperation(value = "Company Biz Relation Page 조회", notes = "searchKeyword: 검색어\n")
    @GetMapping(value = "/company/biz/relation/page")
    public PageResult findCompanyBizRelation(
            @ApiParam(value = "검색어") @RequestParam(required = false) String searchKeyword,
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    ){
        return responseService.getPageResult(
                companyInfoService.findCompanyBizRelation(searchKeyword, user.getCompId(), PageRequest.of((page == 0) ? 0 : (page - 1), size))
                );
    }

    @ApiOperation(value = "Company Biz Request Page 조회")
    @GetMapping(value = "/company/biz/request")
    public PageResult findCompanyBizRequest(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    ){
        return responseService.getPageResult(
                companyInfoService.findCompanyBizRequest(user.getCompId(), PageRequest.of((page == 0) ? 0 : (page - 1), size))
        );
    }

    @ApiOperation(value = "Biz Relation 저장", notes = "\n" +
            "1. relationType: relation type 필수\n2. bizCompanyID: 회사 ID 필수\n")
    @PostMapping(value = "/company/biz")
    public CommonResult saveCompanyBizRelation(
            @RequestBody @Valid List<CompanyBizDto.BizRelationRequest> relationRequests,
            @AuthenticationPrincipal User user
    ){
        companyInfoService.saveCompanyBizRelation(relationRequests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Biz Relation 승인 및 반려", notes = "\n" +
            "1. id: biz request ID 필수\n2. status: 승인 여부(승인: 0, 반려: 1) 필수")
    @PutMapping(value = "/company/biz/{status}")
    @Transactional
    public CommonResult modifyCompanyBizRequest(
            @ApiParam(value = "승인: approved, 반려: returned", required = true) @PathVariable String status,
            @RequestBody @Valid List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for(Long id: ids){
            CompanyBizRequest companyBizRequest = companyInfoService.findBizRequestById(id)
                    .orElseThrow(()-> new BusinessException("Company Biz Request id is null", ErrorCode.INTERNAL_SERVER_ERROR));

            if(companyBizRequest.getApproveStatus() != 2){
                throw new BusinessException("It is not pending approval.", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            companyInfoService.modifyCompanyBizRequest(companyBizRequest, status, user);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Biz Relation 승인 요청 및 해지 요청", notes = "\n" +
            "1. id: biz relation ID 필수\n2. status: 승인 여부(승인: 0, 반려: 1) 필수")
    @PutMapping(value = "/company/biz/request/{status}")
    @Transactional
    public CommonResult modifyCompanyBizRelationStatusRequest(
            @ApiParam(value = "승인 요청: active, 해지 요청: deactive", required = true) @PathVariable String status,
            @RequestBody @Valid List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for(Long id: ids){
            CompanyBizRelation companyBizRelation = companyInfoService.findCompanyBizRelationById(id)
                    .orElseThrow(()-> new BusinessException("Company Biz Relation id is null", ErrorCode.INTERNAL_SERVER_ERROR));

            if(companyBizRelation.getStatus().equals("A") && status.equals("active")){
                throw new BusinessException("It is active.", ErrorCode.INTERNAL_SERVER_ERROR);
            }
            if(companyBizRelation.getStatus().equals("D") && status.equals("deactive")){
                throw new BusinessException("It is deactive.", ErrorCode.INTERNAL_SERVER_ERROR);
            }

            companyInfoService.modifyCompanyBizRelationStatusRequest(companyBizRelation, status, user);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Biz Relation 수정", notes = "\n" +
            "1. relationType: relation type 필수\n2. bizCompanyID: 회사 ID 필수\n")
    @PutMapping(value = "/company/biz")
    public CommonResult modifyCompanyBizRelationStatus(
            @RequestBody @Valid List<CompanyBizDto.BizRelationStatusRequest> bizRelationStatusRequests,
            @AuthenticationPrincipal User user
    ){
        companyInfoService.modifyCompanyBizRelationStatus(bizRelationStatusRequests, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "New Partner 저장", notes = "\n" +
            "1. relationType: relation type 필수\n2. businessNumber: business number\n3. businessFileUrl: business 첨부파일\n" +
            "4. companyName: 회사명 필수\n5. countryId: 국가 ID 필수\n6. city: city 필수\n" +
            "7. state: state\n8. etc: address 필수\n9. zipCode: postal code 필수\n10. email: email 필수\n")
    @PostMapping(value = "/company/new/partner")
    public CommonResult saveNewPartner(
            @RequestBody @Valid CompanyBizDto.NewPartnerRequest request,
            @AuthenticationPrincipal User user
    ){
        companyInfoService.saveNewPartner(request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Company Document 조회")
    @GetMapping(value = "/company/document")
    public ListResult<CompanyDocDto> findAllDocumentCode(
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(
                CompanyInfoMapper.INSTANCE.toDocumentDto(companyInfoService.findAllDocumentCode(user.getCompId())));
    }

    @ApiOperation(value = "Company Document 저장")
    @PostMapping(value = "/company/document")
    public CommonResult saveDocumentCode(
            @RequestBody @Valid CompanyDocRequestDto request,
            @AuthenticationPrincipal User user
    ){
        companyInfoService.saveDocumentCode(request, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Company Terms 저장  및 수정", notes = "\n" +
            "1. id: company terms ID (수정시 필수)\n2. documentType: 서류 양식 필수\n" +
            "3. materialType: material type 필수\n4. terms: 약관 내용\n")
    @PostMapping(value = "/company/terms")
    @Transactional
    public CommonResult saveCompanyTerms(
            @RequestBody @Valid List<CompanyTermsRequest> companyTermsRequests,
            @AuthenticationPrincipal User user
    ){
        for (CompanyTermsRequest companyTermsRequest: companyTermsRequests){
            CompanyTerms companyTerms = new CompanyTerms();
            if(companyTermsRequest.getId() != null){
                companyTerms = companyInfoService.findByCompanyTerms(companyTermsRequest.getId());
            }else{
                if(companyInfoService.findCompanyTermsByDocumentTypeAndMaterialType(
                        CommonMapper.INSTANCE.toCommonBasic(companyTermsRequest.getDocumentType()),
                        CommonMapper.INSTANCE.toCommonBasic(companyTermsRequest.getMaterialType()),
                        user.getCompId()
                ).size() >0){
                    throw new BusinessException("Same Document type and Material Type have terms", ErrorCode.INTERNAL_SERVER_ERROR);
                }
            }
            CompanyInfoMapper.INSTANCE.toTerms(companyTermsRequest, user, companyTerms);
            companyInfoService.saveCompanyTerms(companyTerms);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Company Terms 조회")
    @GetMapping(value = "/company/terms")
    public PageResult<CompanyTermsResponse> findAllCompanyTerms(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    ){
        return responseService.getPageResult(
                companyInfoService.findAllCompanyTerms(user.getCompId(), PageRequest.of((page == 0) ? 0 : (page - 1), size))
        );
    }

    @ApiOperation(value = "Company Terms ID 로 조회")
    @GetMapping(value = "/company/terms/{id}")
    public SingleResult<CompanyTermsResponse> findCompanyTerms(
            @ApiParam(value = "Company Terms ID", required = true) @PathVariable @NotNull(message = "Company Terms ID is null") Long id
    ){
        return responseService.getSingleResult(CompanyInfoMapper.INSTANCE.toTermsDto(companyInfoService.findByCompanyTerms(id)));
    }

    @ApiOperation(value = "Company Terms document type and material type 조회")
    @GetMapping(value = "/company/terms/{documentTypeID}/{materialTypeID}")
    public ListResult<CompanyTermsResponse> findCompanyTermsByDocumentTypeAndMaterialType(
            @ApiParam(value = "Document Type ID", required = true) @PathVariable @NotNull(message = "Document Type ID is null") Long documentTypeID,
            @ApiParam(value = "Material Type ID", required = true) @PathVariable @NotNull(message = "Material Type ID is null") Long materialTypeID,
            @AuthenticationPrincipal User user
    ){
        CommonBasicInfo documentType = commonService.findBasicInfoById(documentTypeID);
        CommonBasicInfo materialType = commonService.findBasicInfoById(materialTypeID);

        return responseService.getListResult(
                CompanyInfoMapper.INSTANCE.toTermsDto(
                        companyInfoService.findCompanyTermsByDocumentTypeAndMaterialType(documentType, materialType, user.getCompId())
                )
        );
    }

    @ApiOperation(value = "Company Terms ID 로 삭제", notes = "1. ids: Company Terms ID 필수\n")
    @DeleteMapping(value = "/company/terms")
    @Transactional
    public CommonResult deleteCompanyTerms(
            @RequestBody List<Long> ids
    ){
        for (Long id: ids){
            CompanyTerms companyTerms = companyInfoService.findByCompanyTerms(id);
            companyInfoService.deleteCompanyTerms(companyTerms);
        }
        return responseService.getSuccessResult();
    }
}
