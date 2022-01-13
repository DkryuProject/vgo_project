package io.vengine.api.v1.material.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.dto.ExcelResponse;
import io.vengine.api.common.utils.CustomExcel;
import io.vengine.api.common.utils.S3Uploader;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.service.CommonService;
import io.vengine.api.v1.etc.service.ExcelService;
import io.vengine.api.v1.material.dto.MaterialInfoRequest;
import io.vengine.api.v1.material.dto.MaterialResponse;
import io.vengine.api.v1.material.dto.MaterialYarnRequest;
import io.vengine.api.v1.material.entity.MaterialInfo;
import io.vengine.api.v1.material.mapper.MaterialMapper;
import io.vengine.api.v1.material.service.MaterialService;
import io.vengine.api.v1.user.entity.User;
import io.vengine.api.v1.user.service.CompanyService;
import io.vengine.api.v1.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.validation.Valid;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Api(tags = {"07. MATERIAL INFO"}, consumes = "application/json")
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class MaterialInfoController {
    private final ResponseService responseService;

    @Autowired
    MaterialService materialService;

    @Autowired
    UserService userService;

    @Autowired
    CompanyService companyService;

    @Autowired
    CommonService commonService;

    @Autowired
    ExcelService excelService;

    @Autowired
    S3Uploader s3Uploader;

    @ApiOperation(value = "자재 Info 전체 조회", notes = "전체 자재 Info를 조회한다")
    @GetMapping(value = "/material/info/page")
    public PageResult<MaterialResponse> findAllMaterialInfo(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord,
            @ApiParam(value = "Type") @RequestParam(value="", required=false) String type,
            @AuthenticationPrincipal User user
    ){
        Page<MaterialInfo> materialInfoPage  = materialService.findAllMaterialInfo(searchKeyWord, type, page, size, user);
        CommonDto.PageDto<MaterialResponse> pageDto = CommonDto.toPageDto(materialInfoPage,
                MaterialMapper.INSTANCE.toMaterialInfoResponse(
                        materialInfoPage.getContent()
                                .stream()
                                .map(m-> {
                                    m.setMaterialOffers(
                                            m.getMaterialOffers()
                                                    .stream()
                                                    .filter(item-> {
                                                        boolean result = false;
                                                        if(user.getCompId().getId().longValue() != m.getSupplierCompany().getId().longValue()){
                                                            if(item.getRecipient() == null || item.getRecipient().getId().longValue() == user.getCompId().getId().longValue()){
                                                                result = true;
                                                            }else{
                                                                result = false;
                                                            }
                                                        }else{
                                                            result = true;
                                                        }
                                                        return result;
                                                    })
                                                    .collect(Collectors.toList())
                                    );
                                    return m;
                                })
                                .collect(Collectors.toList())
                )
        );
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "자재 Info 리스트 조회", notes = "search filter\n" +
            "1. categoryB: 자재 중분류\n2. categoryC: 자재 소분류\n3. supplier: supplier\n4. name: Item name\n")
    @PostMapping(value = "/material/info/filter")
    public ListResult<MaterialResponse> findAllMaterialInfoList(
            @RequestBody Map<String, Object> searchFilter,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(
                MaterialMapper.INSTANCE.toMaterialInfoResponse(
                        materialService.findAllMaterialInfo(searchFilter, user)
                                .stream()
                                .map(m-> {
                                    m.setMaterialOffers(
                                            m.getMaterialOffers()
                                                    .stream()
                                                    .filter(item-> {
                                                        boolean result = false;
                                                        if(user.getCompId().getId().longValue() != m.getSupplierCompany().getId().longValue()){
                                                            if(item.getRecipient() == null || item.getRecipient().getId().longValue() == user.getCompId().getId().longValue()){
                                                                result = true;
                                                            }else{
                                                                result = false;
                                                            }
                                                        }else{
                                                            result = true;
                                                        }

                                                        return result;
                                                    })
                                                    .collect(Collectors.toList())
                                    );
                                    return m;
                                })
                                .sorted(Comparator.comparing(MaterialInfo::getId).reversed())
                                .collect(Collectors.toList())
                )
        );
    }

    @ApiOperation(value = "자재 Info 조회(ID)", notes = "ID로 자재 Info를 조회한다")
    @GetMapping(value = "/material/info/{id}")
    public SingleResult<MaterialResponse.MaterialInfo> findMaterialInfoById(
            @ApiParam(value = "ID", required = true) @PathVariable Long id
    )
    {
        return responseService.getSingleResult(MaterialMapper.INSTANCE.toMaterialInfoDto(
                materialService.findMaterialInfoById(id).orElseThrow(()->
                        new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND))));
    }

    @ApiOperation(value = "자재 Info 등록", notes = "자재 Info를 등록한다")
    @PostMapping(value = "/material/info")
    public SingleResult<Long> saveMaterialInfo(
            @Valid @RequestBody MaterialInfoRequest materialInfoRequest,
            @AuthenticationPrincipal User user
    )
    {
        try {
            materialInfoValidationCheck(materialInfoRequest);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
        }

        if("fabric".equals(materialInfoRequest.getType())){
            //Fabric Material Info Check
            if(materialService.findMaterialInfo(materialInfoRequest.getName(), materialInfoRequest.getSupplierId(), materialInfoRequest.getCategoryId(),
                    materialInfoRequest.getYarnSizeWrap(), materialInfoRequest.getYarnSizeWeft()
                    ,materialInfoRequest.getConstructionEpi(), materialInfoRequest.getConstructionPpi()
            ).isPresent()){
                throw new BusinessException(ErrorCode.MATERIAL_INFO_IS_SAME.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
            }
        }else{
            //Trim, Accessories Material Info Check
            if(materialService.findMaterialInfo(materialInfoRequest.getName(), materialInfoRequest.getSupplierId()
                    , materialInfoRequest.getCategoryId(), materialInfoRequest.getSubsidiaryDetail()
            ).isPresent()){
                throw new BusinessException(ErrorCode.MATERIAL_INFO_IS_SAME.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
            }
        }
        return responseService.getSingleResult(
                materialService.saveMaterialInfo(materialInfoRequest, user).getId()
        );
    }

    @ApiOperation(value = "자재 Info 수정", notes = "자재 Info를 수정한다")
    @PutMapping(value = "/material/info/{id}")
    public CommonResult modifyMaterialInfo(
            @ApiParam(value = "Material Info ID", required = true) @PathVariable Long id,
            @Valid @RequestBody MaterialInfoRequest materialInfoRequest,
            @AuthenticationPrincipal User user
    )
    {
        MaterialInfo materialInfo = materialService.findMaterialInfoById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.MATERIAL_INFO_NOT_FOUND));

        /*
        if(materialInfo.getCbdMaterialInfos().size()>0
                || materialInfo.getMclMaterialInfos().size()>0
                || materialInfo.getMaterialOffers().size()>0
                || materialInfo.getParentMaterialInfo() != null
        ){
            throw new BusinessException(ErrorCode.MATERIAL_INFO_CAN_NOT_MODIFY);
        }
        */

        try {
            materialInfoValidationCheck(materialInfoRequest);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage(), ErrorCode.INTERNAL_SERVER_ERROR);
        }

        materialService.modifyMaterialInfo(materialInfo, materialInfoRequest, user);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "자재 이미지 등록", notes = "자재 이미지를 등록한다")
    @PostMapping(value = "/material/info/{id}")
    public SingleResult<MaterialResponse.MaterialInfo> saveMaterialImage(
            @ApiParam(value = "Material Info ID", required = true) @PathVariable Long id ,
            MultipartFile file
    )
    {
        return responseService.getSingleResult(MaterialMapper.INSTANCE.toMaterialInfoDto(materialService.saveMaterialImage(id, file)));
    }

    @ApiOperation(value = "자재 Info 삭제", notes = "자재 Info를 삭제상태를 업데이트한다")
    @DeleteMapping(value = "/material/info")
    @Transactional
    public CommonResult deleteMaterialInfo(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for (Long id : ids){
            materialService.deleteFlagUpdateMaterialInfo(id, user);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "Material Excel Download", notes = "type: material type(fabric, trim, accessories)\n")
    @GetMapping(value = "/material/excel/download/{type}")
    public ModelAndView materialExcelDownload(
            @ApiParam(value = "다운로드 타입", required = true) @PathVariable String type,
            @AuthenticationPrincipal User user,
            HttpServletRequest request
    ){
        Map<String, Object> excelData = excelService.materialExcelDownload(request, type, user.getCompId());
        return new ModelAndView(new CustomExcel(), excelData);
    }

    @ApiOperation(value = "Material info Excel Upload")
    @PostMapping(value = "/material/excel/upload/{type}")
    public SingleResult<ExcelResponse> materialExcelUpload(
            @ApiParam(value = "자재 타입", required = true) @PathVariable String type,
            @ApiParam(value = "첨부파일", required = true) @RequestParam MultipartFile file,
            @AuthenticationPrincipal User user
    ) throws Exception {
        if(file.isEmpty()){
            throw new BusinessException(ErrorCode.NO_UPLOAD_FILE);
        }
        return responseService.getSingleResult(excelService.materialExcelUpload(file, type, user.getCompId()));
    }

    @ApiOperation(value = "Material info Excel Data 저장")
    @PostMapping(value = "/material/excel/save/{type}")
    public CommonResult saveMaterialExcel(
            @ApiParam(value = "자재 타입", required = true) @PathVariable String type,
            @ApiParam(value = "S3 Upload File Name", required = true) @RequestParam String fileName,
            @AuthenticationPrincipal User user
    ) {
        String excelDataJson = "";
        try {
            excelDataJson = s3Uploader.getData(fileName);
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(ErrorCode.EXCEL_UPLOAD_ERROR);
        }
        if(excelDataJson == ""){
            throw new BusinessException(ErrorCode.EXCEL_DATA_IS_NULL);
        }
        if("fabric".equals(type)){
            materialService.saveFabricMaterialExcel(excelDataJson, user);
        }else if("trim".equals(type)){
            materialService.saveTrimMaterialExcel(excelDataJson, user);
        }else if("accessories".equals(type)){
            materialService.saveAccessoriesMaterialExcel(excelDataJson, user);
        }else{
            throw new BusinessException(ErrorCode.INVALID_TYPE_VALUE);
        }

        s3Uploader.deleteExcelData(fileName);
        return responseService.getSuccessResult();
    }

    private void materialInfoValidationCheck(MaterialInfoRequest materialInfoRequest) throws Exception {
        if("fabric".equals(materialInfoRequest.getType())){
            if(materialInfoRequest.getMaterialYarnRequestList().size() ==0){
                throw new Exception(ErrorCode.MATERIAL_YARN_NOT_FOUND.getMessage());
            }else{
                double sum = 0;
                for (MaterialYarnRequest materialYarnRequest: materialInfoRequest.getMaterialYarnRequestList()){
                    sum += materialYarnRequest.getRate().doubleValue();
                }
                if(sum > 100){
                    throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
                }
            }
            if(materialInfoRequest.getYarnSizeWrap() == null || materialInfoRequest.getYarnSizeWrap() == ""){
                throw new Exception("Yarn size warp is null");
            }
            if(materialInfoRequest.getYarnSizeWeft() == null || materialInfoRequest.getYarnSizeWeft() == ""){
                throw new Exception("Yarn size welt is null");
            }
        }else{
            if(materialInfoRequest.getSubsidiaryDetail() == null || materialInfoRequest.getSubsidiaryDetail() == ""){
                throw new Exception("Item Detail: "+ErrorCode.DATA_NOT_FOUND.getMessage());
            }
        }
    }
}
