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

    @ApiOperation(value = "?????? ?????? ??????", notes = "?????? ????????? ????????????")
    @GetMapping(value = "/companys")
    public ListResult<CompanyDto> findAllCompany(){
        return responseService.getListResult(CompanyMapper.INSTANCE.toCompanyDTO(companyService.findAllCompany()));
    }

    @ApiOperation(value = "?????? ??????", notes = "????????? ????????????")
    @GetMapping(value = "/company")
    public SingleResult<CompanyDto> findCompanyById(@ApiParam(value = "?????? ID", required = true) @RequestParam Long id) {
        return responseService.getSingleResult(CompanyMapper.INSTANCE.toCompanyDTO(companyService.findCompany(id)));
    }

    @Transactional
    @ApiOperation(value = "?????? ??????", notes = "\n" +
            "1. businessNumber: business number\n2. name: ?????????\n3. termsAgree: ????????????(?????? 1:, ?????????: 0)\n" +
            "4. commonBizType: ???????????? ??????(??????)\n5. countryId: ??????\n6. city: ??????\n"  +
            "7. etc: ????????????\n8. zipCode: ????????????\n9.businessFileUrl: ???????????? ??????\n")
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

        //?????? ?????? ???????????? ??????
        //1????????? ????????? ????????? ??????
        userService.saveUserMailSend(
                UserMailSend.builder()
                        .email(adminMail).sendType(2)
                        .typeIdx(companyID).status(0)
                        .build()
        );
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "?????? ??????", notes = "\n" +
            "-. company info\n" +
            "1. LCode: company 3 code\n3. nickName: company short name\n" +
            "4. businessNumber: business license number\n5. businessFileUrl: file url\n6. midNo: mid No.\n" +
            "7. lorNo: lor No.\n8. midMemo:  mid memo\n9. lorMemo: lor memo\n" +
            "-. company address\n" +
            "1. id: company address ID ??????????????? null\n2. countryId: country ID ??????\n3. city: city ??????\n" +
            "4. state: state\n5. etc: address ??????\n6. zipCode: postal code ??????\n" +
            "7. workPlace: ?????? ????????? ??????\n8. representitive: ???????????? ?????? ??????(??????: 1, ??????: 0)\n" +
            "8. status: status(Active, Deactive) ??????\n")
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

    @ApiOperation(value = "???????????? ?????? ??????", notes = "???????????? ????????? ????????????")
    @PostMapping(value = "/company/file")
    public SingleResult<String> companyFileUpload(@ApiParam(value = "?????? ??????", required = true) @RequestParam MultipartFile file)
    {
        return responseService.getSingleResult(companyService.companyFileUpload(file));
    }

    @ApiOperation(value = "???????????? ?????? ??????", notes = "????????? ????????????")
    @GetMapping(value = "/company/name/page")
    public PageResult<CompanyDto> findCompanyByName(
            @ApiParam(value = "?????????") @RequestParam(required = false) String searchKeyword,
            @ApiParam(value = "???????????????", required = true) @RequestParam int page,
            @ApiParam(value = "???????????? ????????? ???", required = true) @RequestParam int size
    )
    {
        return responseService.getPageResult(companyService.findCompanyByLikeName(searchKeyword, PageRequest.of((page == 0) ? 0 : (page - 1), size)));
    }

    @ApiOperation(value = "?????? ??????(by searchKeyword)", notes = "???????????? ????????? ????????????")
    @GetMapping(value = "/company/search/{type}")
    public PageResult<CompanyDto> searchCompany(
            @ApiParam(value = "??????(normal, relation)", required = true) @PathVariable String type,
            @ApiParam(value = "?????????") @RequestParam(required = false) String searchKeyword,
            @ApiParam(value = "???????????????", required = true) @RequestParam int page,
            @ApiParam(value = "???????????? ????????? ???", required = true) @RequestParam int size,
            @AuthenticationPrincipal User user
    )
    {
        return responseService.getPageResult(companyService.searchCompany(type, searchKeyword, user, PageRequest.of((page == 0) ? 0 : (page - 1), size)));
    }

    @ApiOperation(value = "????????? ?????? ??????")
    @GetMapping(value = "/company/address/list/{companyID}")
    public ListResult<CompanyDto.Address> companyAddressList(
            @ApiParam(value = "?????? ID", required = true) @PathVariable Long companyID
    ){
        return responseService.getListResult(CompanyMapper.INSTANCE.toAddressDto(
                companyService.companyAddressList(companyService.findCompany(companyID))));
    }

    @ApiOperation(value = "?????? ?????? (by relation type)", notes = "1. relationType: relation type ??????\n")
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

    @ApiOperation(value = "????????? ?????? (by buyer)", notes = "1. buyerID: buyer company ID ??????\n")
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
