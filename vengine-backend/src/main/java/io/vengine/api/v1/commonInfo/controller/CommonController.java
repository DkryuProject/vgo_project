package io.vengine.api.v1.commonInfo.controller;

import io.swagger.annotations.*;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.RelationType;
import io.vengine.api.common.enums.UserStatus;
import io.vengine.api.common.service.EnumModel;
import io.vengine.api.common.service.EnumValue;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.InvalidValueException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.cbd.enums.CBDCostingValueKind;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.entity.CommonBasicInfo;
//import io.vengine.api.v1.commonInfo.entity.CommonMaterialAfterManufacturing;
import io.vengine.api.v1.commonInfo.entity.CommonMaterialType;
import io.vengine.api.v1.commonInfo.mapper.CommonMapper;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.commonInfo.enums.CostingType;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.*;
import java.util.stream.Collectors;

@Api(tags = {"99. COMMON"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1/common")
public class CommonController {
    private final ResponseService responseService;

    @Autowired
    CommonService commonService;

    @ApiOperation(value = "?????? ?????? ??????  ?????? ?????? ??????", notes = "?????? ?????? ?????? ?????? ????????? ????????????")
    @GetMapping(value = "/basic/types")
    public ListResult findCommonInfoTypes(){
        return responseService.getListResult(commonService.findCommonInfoTypes());
    }

    @ApiOperation(value = "?????? ?????? ??????", notes = "?????? ????????? ????????????.")
    @GetMapping(value = "/basic/countries")
    public ListResult<CommonInfoDto.BasicInfo> findAllCountry()
    {
        return responseService.getListResult(CommonMapper.INSTANCE.toBasicInfoDtos(commonService.findAllCountry()));
    }

    @ApiOperation(value = "?????? ??????", notes = "????????? ????????????.\n" +
            "1. country: ???????????? 3?????? \n")
    @GetMapping(value = "/basic/cities/{country}")
    public ListResult<CommonInfoDto.IdName> findCityByCountry(
            @ApiParam(value = "?????? ??????", required = true) @PathVariable String country
    )
    {
        return responseService.getListResult(commonService.findCityByCountry(country));
    }

    @ApiOperation(value = "Port ?????? ( ????????? )", notes = "????????? Port ??? ????????????.")
    @GetMapping(value = "/basic/port/{countryID}")
    public ListResult<CommonInfoDto.BasicInfo> findPortByCountryCode(
            @ApiParam(value = "?????? ID", required = true) @PathVariable Long countryID,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord
    )
    {
        return responseService.getListResult(CommonMapper.INSTANCE.toBasicInfoDtos(commonService.findPortByCountryID(countryID, searchKeyWord)));
    }

    @ApiOperation(value = "Port ??????", notes = "Port ??? ????????????.")
    @GetMapping(value = "/port/search")
    public ListResult<CommonInfoDto.BasicInfo> searchPort(
            @ApiParam(value = "Search KeyWord", required = true) @RequestParam String searchKeyWord
    )
    {
        if(searchKeyWord == ""){
            throw new InvalidValueException("Please enter the keyword.");
        }

        return responseService.getListResult(CommonMapper.INSTANCE.toBasicInfoDtos(commonService.searchPort(searchKeyWord)));
    }

    @ApiOperation(value = "?????? ??????", notes = "????????? ????????????.\n" +
            "1. ?????? ??????: ?????? ????????? \n")
    @GetMapping(value = "/basic/uom/{group}")
    public ListResult<CommonInfoDto.IdName> findUomByGroup(
            @ApiParam(value = "?????? ?????????", required = true) @PathVariable String group
    )
    {
        return responseService.getListResult(commonService.findUomByGroup(group));
    }

    @ApiOperation(value = "?????? ?????? ?????? ????????? ??????", notes = "?????? ?????? ?????? ???????????? ????????? ??????\n?????????(??????, ??????, ??????, ????????????, ??????, ????????????, ?????????, ????????? ??????, ????????? ???????????????, ????????? ??????, ????????? ??????, ????????????)")
    @GetMapping(value = "/basic/list/{type}")
    public ListResult<CommonInfoDto.BasicInfo> findCommonBasicInfoList(
            @ApiParam(value = "?????? ?????? ??????", required = true) @PathVariable String type
    )
    {
        if("country".equals(type)){
            throw new BusinessException("????????? ????????? ??? ????????????.", ErrorCode.INTERNAL_SERVER_ERROR);
        }
        return responseService.getListResult(CommonMapper.INSTANCE.toBasicInfoDtos(commonService.findCommonBasicInfoByType(type)));
    }

    @ApiOperation(value = "?????? ?????? ?????? ????????? ??????", notes = "?????? ?????? ?????? ???????????? ????????? ??????\n?????????(??????, ??????, ??????, ????????????, ??????, ????????????, ?????????, ????????? ??????, ????????? ???????????????, ????????? ??????, ????????? ??????, ????????????)")
    @GetMapping(value = "/basic/page/{type}")
    public PageResult<CommonInfoDto.BasicInfo> findCommonBasicInfoPage(
            @ApiParam(value = "?????? ?????? ??????", required = true) @PathVariable String type,
            @ApiParam(value = "???????????????", required = true) @RequestParam int page,
            @ApiParam(value = "???????????? ????????? ???", required = true) @RequestParam int size,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord
    )
    {
        Page<CommonBasicInfo> commonBasicInfoPage  = commonService.findCommonBasicInfoByType(searchKeyWord, type,  page, size);
        CommonInfoDto.PageDto<CommonInfoDto.BasicInfo> pageDto = CommonInfoDto.toPageDto(commonBasicInfoPage, CommonMapper.INSTANCE.toBasicInfoDtos(commonBasicInfoPage.getContent()));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "???????????? ID??? ??????", notes = "???????????? ID??? ????????? ????????????")
    @GetMapping(value = "/basic/{id}")
    public SingleResult<CommonInfoDto.BasicInfo> findCommonBasicInfoById(
            @ApiParam(value = "ID", required = true) @PathVariable Long id
    ){
        return responseService.getSingleResult(CommonMapper.INSTANCE.toBasicInfoDto(commonService.findCommonBasicInfoById(id)));
    }

    @ApiOperation(value = "?????? ?????? ??????", notes = "?????? ????????? ????????????\n" +
            "1. Gender(type: gender) - name1 : name\n" +
            "2. Yarn Type(type: yarn) - name1: name\n" +
            "3. Garment Type(type: garment_category) - name1: name\n" +
            "4. Country(type: country) - name1: name, name2: 2Code, name3: 3Code" +
            "5. Ship Mode(type: shipping_method) - name1: name, name2: Type\n" +
            "6. Container Type(type: container) - name1: name, name2: CBM\n" +
            "7. BL Type(type: bl) - name1: name, name2: full name, name3: description\n" +
            "8. Incoterms(type: incoterms) - name1: name, name2: full name, name3: effective year, name4: description\n" +
            "9. Port name(type: port) - name1: port name, name2: port 3code, name5: country id, name6: ship_mode id\n" +
            "10. Ocean Carrier(type: scac) - name1: name, name2: scac, name3: carrier abbreviate code\n" +
            "11. Currency(type: currency) - name1: full name, name2: name\n" +
            "12. Unit Of Measurement(type: uom) - name1: name, name2: full name\n" +
            "13. Air Carrier(type: airline) - name1: 2code, name2: 3code, name3: numberic code, name4: name, name5: country id\n" +
            "14. Production Type(type: production) - name1: name\n" +
            "15. Customs Code(type: importation) - name1: document code, name2: import/export, name3: description\n" +
            "16. Pay Terms(type: payment_terms) - name1: payment terms name\n" +
            "17. Actual Color(type: color) - name1: color name\n" +
            "18. Payment Period(type: payment_period)- name1: payment period name\n" +
            "19 Payment Base(type: payment_base) - name1: payment base name\n" +
            "20. Order Type(type: order) - name1: order type name\n" +
            "21. Garment Size(type: garment_size) - name1: size group, name2: size name\n")
    @PostMapping(value = "/basic/{type}")
    public ListResult<CommonInfoDto.BasicInfo> saveCommonBasicInfo(
            @ApiParam(value = "Type", required = true)
            @PathVariable @NotBlank(message = "????????? ???????????????.") @Size(min=0, max=30) String type,
            @Valid @RequestBody List<CommonInfoDto.BasicInfoRequest> commonInfoRequests,
            @AuthenticationPrincipal User user){
        CommonBasicInfo commonBasicInfo;
        List<CommonBasicInfo> list = new ArrayList();
        for (CommonInfoDto.BasicInfoRequest commonInfoRequest : commonInfoRequests){
            commonBasicInfo = new CommonBasicInfo();
            if(commonInfoRequest.getId() != null){
                commonBasicInfo = commonService.findCommonBasicInfoById(commonInfoRequest.getId());
            }
            CommonMapper.INSTANCE.toCommonBasicInfo(commonInfoRequest, type, commonBasicInfo);
            list.add(commonBasicInfo);
        }
        return responseService.getListResult(CommonMapper.INSTANCE.toBasicInfoDtos(commonService.saveCommonBasicInfo(list, user)));
    }

    @ApiOperation(value = "?????? ??????", notes = "??????(enum)??? ????????????")
    @GetMapping(value = "/enums")
    public SingleResult<Map<String, List<EnumValue>>> searchCostingType(){
        Map<String, List<EnumValue>> enumValues = new LinkedHashMap<>();

        enumValues.put("costType", toEnumValues(CostingType.class));
        enumValues.put("costValueKindType", toEnumValues(CBDCostingValueKind.class));
        enumValues.put("relationType", toEnumValues(RelationType.class));
        enumValues.put("userStatus", toEnumValues(UserStatus.class));

        return responseService.getSingleResult(enumValues);
    }

    @ApiOperation(value = "???????????? ?????? ??????", notes = "?????? ??????????????? ????????????")
    @GetMapping(value = "/material/types/page")
    public PageResult<CommonInfoDto.MaterialTypeResponse> findAllCommonMaterialTypePage(
            @ApiParam(value = "???????????????", required = true) @RequestParam int page,
            @ApiParam(value = "???????????? ????????? ???", required = true) @RequestParam int size
    ){
        Page<CommonMaterialType> CommonMaterialTypePage  = commonService.findAllCommonMaterialType(page, size);
        CommonInfoDto.PageDto<CommonInfoDto.MaterialTypeResponse> pageDto = CommonInfoDto.toPageDto(CommonMaterialTypePage, CommonMapper.INSTANCE.toCommonMaterialTypeDtos(CommonMaterialTypePage.getContent()));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "???????????? ?????? ??????", notes = "?????? ??????????????? ????????????")
    @GetMapping(value = "/material/types/list")
    public ListResult<CommonInfoDto.MaterialTypeResponse> findAllCommonMaterialTypeList(){
        return responseService.getListResult(CommonMapper.INSTANCE.toCommonMaterialTypeDtos(commonService.findAllCommonMaterialType()));
    }

    @ApiOperation(value = "???????????? ID??? ??????", notes = "ID??? ??????????????? ????????????")
    @GetMapping(value = "/material/type/{id}")
    public SingleResult<CommonInfoDto.MaterialTypeResponse> findCommonMaterialTypeById(
            @ApiParam(value = "???????????? ID", required = true) @PathVariable Long id
    ){
        return responseService.getSingleResult(CommonMapper.INSTANCE.toCommonMaterialTypeDto(commonService.findCommonMaterialTypeById(id)));
    }

    @ApiOperation(value = "???????????? ?????? ??? ??????", notes = "??????????????? ????????????")
    @PostMapping(value = "/material/type")
    public ListResult<CommonInfoDto.MaterialTypeResponse> saveCommonMaterialType(
            @Valid @RequestBody List<CommonInfoDto.MaterialTypeRequest> materialTypeRequests
    ){
        List<CommonMaterialType> list = new ArrayList<>();
        CommonMaterialType commonMaterialType;
        for (CommonInfoDto.MaterialTypeRequest request: materialTypeRequests){
            commonMaterialType = new CommonMaterialType();
            if(request.getId() != null){
                commonMaterialType = commonService.findCommonMaterialTypeById(request.getId());
            }
            CommonMapper.INSTANCE.toMaterialType(request, commonMaterialType);
            list.add(commonMaterialType);
        }
        return responseService.getListResult(CommonMapper.INSTANCE.toCommonMaterialTypeDtos(commonService.saveCommonMaterialType(list)));
    }

    @ApiOperation(value = "???????????? ????????? ??????", notes = "???????????? ???????????? ????????????")
    @GetMapping(value = "/material-type/{categoryA}")
    public ListResult<String> findCommonMaterialTypeByCategoryA(
            @ApiParam(value = "???????????? ????????? ???", required = true) @PathVariable String categoryA
    ){
        return responseService.getListResult(commonService.findAllCommonMaterialType(categoryA));
    }

    @ApiOperation(value = "???????????? ????????? ??????", notes = "???????????? ???????????? ????????????")
    @GetMapping(value = "/material-type/{categoryA}/{categoryB}")
    public ListResult<String> findCommonMaterialType(
            @ApiParam(value = "???????????? ????????? ???", required = true) @PathVariable String categoryA,
            @ApiParam(value = "???????????? ????????? ???", required = true) @PathVariable String categoryB
    ){
        return responseService.getListResult(commonService.findAllCommonMaterialType(categoryA, categoryB));
    }

    @ApiOperation(value = "?????? ?????? ??????")
    @GetMapping(value = "/years")
    public ListResult<Integer> yearList(){
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        List<Integer> list = new ArrayList<>();

        for (int startYear = currentYear-2; startYear <= currentYear + 5; startYear++){
            list.add(startYear);
        }
        return responseService.getListResult(list);
    }

    @ApiOperation(value = "Garment size group ??????", notes = "Garment size group ??? ????????????\n")
    @GetMapping(value = "/garment/sizes")
    public ListResult<String> findGarmentSizeGroups(){
        return responseService.getListResult(commonService.findGarmentSizeGroups());
    }

    @ApiOperation(value = "Garment Size Group?????? ????????? ??????", notes = "groupName: Garment Size Group Name (??????)\n")
    @GetMapping(value = "/garment/size/{groupName}")
    public ListResult<CommonInfoDto.SelectBasicInfo> findGarmentSizeBySizeGroup(
            @ApiParam(value = "Garment Size Name", required = true) @PathVariable String groupName
    ){
        return responseService.getListResult(CommonMapper.INSTANCE.toSelectBasicInfoDtos(commonService.findGarmentSizeBySizeGroup(groupName)));
    }

    private List<EnumValue> toEnumValues(Class<? extends EnumModel> e){
        return Arrays
                .stream(e.getEnumConstants())
                .map(EnumValue::new)
                .collect(Collectors.toList());
    }
}
