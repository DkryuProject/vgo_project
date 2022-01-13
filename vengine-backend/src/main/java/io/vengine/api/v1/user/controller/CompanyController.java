package io.vengine.api.v1.user.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.companyInfo.service.CompanyInfoService;
import io.vengine.api.v1.user.dto.CompanyDto;
import io.vengine.api.v1.user.dto.CompanyRegisterReq;
import io.vengine.api.v1.user.entity.*;
import io.vengine.api.v1.user.mapper.CompanyMapper;
import io.vengine.api.v1.user.mapper.UserMapper;
import io.vengine.api.v1.user.repository.TempCompanyRepository;
import io.vengine.api.v1.user.repository.TempUserRepository;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Api(tags = {"03. COMPANY"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
@Log4j2
public class CompanyController {
    @Value("${admin.mail}")
    private String adminMail;

    private final ResponseService responseService;

    private final CompanyService companyService;

    private final CompanyInfoService companyInfoService;

    private final UserService userService;

    private final TempCompanyRepository tempCompanyRepository;

    private final TempUserRepository tempUserRepository;

    @ApiOperation(value = "회사 전체 조회", notes = "전체 회사를 조회한다")
    @GetMapping(value = "/companys")
    public ListResult<CompanyDto> findAllCompany(){
        return responseService.getListResult(CompanyMapper.INSTANCE.toCompanyDTO(companyService.findAllCompany()));
    }

    @ApiOperation(value = "회사 조회", notes = "회사를 조회한다")
    @GetMapping(value = "/company")
    public SingleResult<CompanyDto> findCompanyById(@ApiParam(value = "회사 ID", required = true) @RequestParam Long id) {
        return responseService.getSingleResult(CompanyMapper.INSTANCE.toCompanyDTO(companyService.findCompany(id)));
    }

    @Transactional
    @ApiOperation(value = "회사 등록", notes = "\n" +
            "1. businessNumber: business number\n2. name: 회사명\n3. termsAgree: 약관동의(동의 1:, 미동의: 0)\n" +
            "4. commonBizType: 비즈니스 타입(필수)\n5. countryId: 국가\n6. city: 도시\n"  +
            "7. etc: 상세주소\n8. zipCode: 우편번호\n9.businessFileUrl: 비지니스 파일\n")
    @PostMapping(value = "/company")
    public CommonResult registerCompany(
            @Valid @RequestBody CompanyRegisterReq registerReq,
            @AuthenticationPrincipal User user
    ) {
        Optional<TempCompany> tempCompanyOptional = companyService.findTempCompanyByName(registerReq.getName());

        if(tempCompanyOptional.isPresent()){
            if(tempCompanyOptional.get().getStatus() == 2){
                throw new BusinessException(ErrorCode.COMPANY_PENDING);
            }else{
                throw new BusinessException(ErrorCode.COMPANY_CONFIRM);
            }
        }

        if(companyService.findCompanyByName(registerReq.getName()).isPresent()){
            throw new BusinessException(ErrorCode.COMPANY_NAME_DUPLICATION);
        }

        TempCompany tempCompany = CompanyMapper.INSTANCE.toTempCompany(registerReq);

        Optional<TempUser> tempUserOptional = tempUserRepository.findByEmail(user.getEmail());

        if(tempUserOptional.isPresent()){
            if("P".equals(tempUserOptional.get().getStatus())){
                throw new BusinessException(String.format(ErrorCode.USER_PENDING.getMessage(), user.getEmail()), ErrorCode.USER_PENDING);
            }else{
                throw new BusinessException(String.format(ErrorCode.USER_CONFIRM.getMessage(), user.getEmail()), ErrorCode.USER_CONFIRM);
            }
        }
        List<TempUser> tempUsers = new ArrayList<>();
        tempUsers.add(UserMapper.INSTANCE.toTempUser(user, tempCompany, user.getStatus().getKey()));

        TempCompanyAddress tempCompanyAddress = CompanyMapper.INSTANCE.toCompanyAddress(registerReq);
        tempCompanyAddress.setTempCompany(tempCompany);
        tempCompanyAddress.setCommonBizType(CommonMapper.INSTANCE.toCommonBasic(registerReq.getCommonBizType()));
        tempCompanyAddress.setWorkPlace("Main Office");
        tempCompanyAddress.setStatus(2);

        //temp company save
        tempCompany.setStatus(2);
        tempCompany.setTempCompanyAddress(tempCompanyAddress);
        tempCompany.setTempUsers(tempUsers);

        Long companyID = tempCompanyRepository.save(tempCompany).getId();

        //메일 전송 테이블에 저장
        //1분마다 배치가 돌면서 발송
        userService.saveUserMailSend(
                UserMailSend.builder()
                        .email(adminMail).sendType(2)
                        .typeIdx(companyID).status(0)
                        .build()
        );
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "회사 수정", notes = "\n" +
            "-. company info\n" +
            "1. LCode: company 3 code\n3. nickName: company short name\n" +
            "4. businessNumber: business license number\n5. businessFileUrl: file url\n6. midNo: mid No.\n" +
            "7. lorNo: lor No.\n8. midMemo:  mid memo\n9. lorMemo: lor memo\n" +
            "-. company address\n" +
            "1. id: company address ID 신규저장은 null\n2. countryId: country ID 필수\n3. city: city 필수\n" +
            "4. state: state\n5. etc: address 필수\n6. zipCode: postal code 필수\n" +
            "7. workPlace: 주소 타이틀 필수\n8. representitive: 대표주소 여부 필수(대표: 1, 아님: 0)\n" +
            "8. status: status(Active, Deactive) 필수\n")
    @PutMapping(value = "/company")
    public SingleResult<CompanyDto> modify(
            @Valid @RequestBody CompanyDto.CompanyRequest companyRequest,
            @AuthenticationPrincipal User user
    ) {
        //Gson gson = new Gson();
        //log.info("companyRequest+++++ {}",gson.toJson(companyRequest));
        return responseService.getSingleResult(
                CompanyMapper.INSTANCE.toCompanyDTO(companyService.modifyCompany(companyRequest, user)));
    }

    @ApiOperation(value = "비즈니스 파일 첨부", notes = "비즈니스 파일을 첨부한다")
    @PostMapping(value = "/company/file")
    public SingleResult<String> companyFileUpload(@ApiParam(value = "첨부 파일", required = true) @RequestParam MultipartFile file)
    {
        return responseService.getSingleResult(companyService.companyFileUpload(file));
    }

    @ApiOperation(value = "이름으로 회사 조회", notes = "회사를 조회한다")
    @GetMapping(value = "/company/name/page")
    public PageResult<CompanyDto> findCompanyByName(
            @ApiParam(value = "검색어") @RequestParam(required = false) String searchKeyword,
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size
    )
    {
        return responseService.getPageResult(companyService.findCompanyByLikeName(searchKeyword, PageRequest.of((page == 0) ? 0 : (page - 1), size)));
    }

    @ApiOperation(value = "회사 조회(by searchKeyword)", notes = "검색어로 회사를 조회한다")
    @GetMapping(value = "/company/search/{type}")
    public PageResult<CompanyDto> searchCompany(
            @ApiParam(value = "타입(normal, relation)", required = true) @PathVariable String type,
            @ApiParam(value = "검색어") @RequestParam(required = false) String searchKeyword,
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    )
    {
        return responseService.getPageResult(companyService.searchCompany(type, searchKeyword, user, PageRequest.of((page == 0) ? 0 : (page - 1), size)));
    }

    @ApiOperation(value = "회사별 주소 조회")
    @GetMapping(value = "/company/address/list/{companyID}")
    public ListResult<CompanyDto.Address> companyAddressList(
            @ApiParam(value = "회사 ID", required = true) @PathVariable Long companyID
    ){
        return responseService.getListResult(CompanyMapper.INSTANCE.toAddressDto(
                companyService.companyAddressList(companyService.findCompany(companyID))));
    }

    @ApiOperation(value = "회사 조회 (by relation type)", notes = "1. relationType: relation type 필수\n")
    @GetMapping(value = "/company/{relationType}")
    public ListResult<CompanyDto.SelectCompany> findCompanyByRelationType(
            @ApiParam(value = "relation type", required = true) @PathVariable String relationType,
            @AuthenticationPrincipal User user
    ){
        List<CompanyDto.SelectCompany> result = new ArrayList<>();
        if("ALL".equals(relationType)){
            result =  companyInfoService.findRelationCompany(user.getCompId())
                    .stream()
                    .map(s-> new CompanyDto.SelectCompany(s.getBizCompany().getId(), s.getBizCompany().getName()))
                    .collect(Collectors.toList());
            //result.add(new CompanyDto.SelectCompany(user.getCompId().getId(), user.getCompId().getName()));
        }else{
            result =  companyInfoService.findCompanyByRelationType(relationType, user.getCompId())
                    .stream()
                    //.filter(item -> item.getBizCompany().getId().longValue() != user.getCompId().getId().longValue())
                    .map(s-> new CompanyDto.SelectCompany(s.getBizCompany().getId(), s.getBizCompany().getName()))
                    .collect(Collectors.toList());
        }
        result.add(new CompanyDto.SelectCompany(user.getCompId().getId(), user.getCompId().getName()));
        return responseService.getListResult(result.stream().filter(distinctByKey(p->p.getCompanyID())).collect(Collectors.toList()));
    }

    @ApiOperation(value = "브랜드 조회 (by buyer)", notes = "1. buyerID: buyer company ID 필수\n")
    @GetMapping(value = "/brand/{buyerID}")
    public ListResult<CompanyDto.SelectCompany> findBrandByBuyer(
            @ApiParam(value = "buyer ID", required = true) @PathVariable Long buyerID,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(
                companyInfoService.findBrandByBuyer(buyerID, user.getCompId())
                        .stream()
                        .map(s-> new CompanyDto.SelectCompany(s.getSubsidiaryCompany().getId(), s.getSubsidiaryCompany().getName())
                        )
                        .distinct()
                        .collect(Collectors.toList())
                );
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor)
    {
        Map<Object, Boolean> map = new ConcurrentHashMap<>();
        return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }
}
