package io.vengine.api.v1.cbd.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.enums.Status;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.cbd.dto.CbdDto;
import io.vengine.api.v1.cbd.entity.CBDCover;
import io.vengine.api.v1.cbd.mapper.CBDMapper;
import io.vengine.api.v1.cbd.service.CBDService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.List;
import java.util.Map;

@Api(tags = {"12. CBD COVER"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class CbdCoverController {
    private final ResponseService responseService;

    @Autowired
    CBDService cbdService;

    @ApiOperation(value = "CBD Cover 전체 조회", notes = "전체 CBD Cover를 조회한다\n" +
            "parameter\n1. page: 현재 페이지 번호(default: 1) \n2.size: 페이지당 보여지는 갯수(default: 20) \n3. searchKeyWord: 검색 단어")
    @GetMapping(value = "/cbd/covers")
    public PageResult<CbdDto.Cover> findAllCover(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "Search KeyWord") @RequestParam(value="", required=false) String searchKeyWord,
            @AuthenticationPrincipal User user
    ){
        Page<CBDCover> cbdCoverPage  = cbdService.findAllCover(searchKeyWord, page,size, user);
        CommonDto.PageDto<CbdDto.Cover> pageDto = CommonDto.toPageDto(cbdCoverPage, CBDMapper.INSTANCE.toCoverDTO(cbdCoverPage.getContent()));
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "CBD Cover Filter 조회", notes = "검색 조건(Search Filter)\n" +
            "1. brand: Brand ID\n2.designNumber: design number\n3. seasonName: Season ID\n" +
            "4. seasonYear: Season 년도(숫자)\n 5. orderType: Order Type ID")
    @PostMapping(value = "/cbd/covers")
    public ListResult<CbdDto.Cover> findAllCover(
            @RequestBody Map<String, Object> searchFilter,
            @AuthenticationPrincipal User user
    ){
        return responseService.getListResult(CBDMapper.INSTANCE.toCoverDTO(cbdService.findAllCover(searchFilter, user)));
    }

    @ApiOperation(value = "CBD Cover ID로 조회", notes = "ID로 CBD Cover 를 조회한다\nparameter\n1. id: cbd cover ID 필수")
    @GetMapping(value = "/cbd/cover/{id}")
    public SingleResult<CbdDto.Cover> findCoverById(
            @ApiParam(value = "CBD Cover ID", required = true) @PathVariable Long id
    ){
        return responseService.getSingleResult(CBDMapper.INSTANCE.toCoverDTO(cbdService.findCoverById(id)
                .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND))
        ));
    }

    @ApiOperation(value = "CBD Cover 등록 및 수정", notes = "CBD Cover를 등록 및 수정을 한다\n1.coverId : 저장시에는 null, 수정시에는 수정하는 cbd cover id 필수")
    @PostMapping(value = "/cbd/cover")
    @Transactional
    public SingleResult saveCbdCover(
            @Valid @RequestBody CbdDto.CoverRequest coverRequest,
            @AuthenticationPrincipal User user
    )
    {
        CBDCover cbdCover = new CBDCover();
        String saveType = "save";
        if(coverRequest.getCoverId() != null){
            cbdCover = cbdService.findCoverById(coverRequest.getCoverId())
                    .orElseThrow(()-> new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND));
            saveType = "modify";

            if(cbdCover.getCbdOptions().size() > 0){
                throw new BusinessException(ErrorCode.CBD_COVER_CAN_NOT_MODIFY);
            }

            cbdCover.setStatus(coverRequest.getStatus().equals(Status.OPEN.getKey()) ? Status.OPEN : Status.CLOSE);
        }else{
            //CBD Cover 동일한 이름일 경우 Exception
            //if(cbdService.findCoverByCbdName(coverRequest.getCbdName()).isPresent()){
            //    throw new BusinessException(ErrorCode.CBD_COVER_NAME_DUPLICATION);
            //}
            cbdCover.setStatus(Status.OPEN);
        }
        CBDMapper.INSTANCE.toCover(coverRequest, user, cbdCover);

        return responseService.getSingleResult(CBDMapper.INSTANCE.toCoverDTO(cbdService.saveCbdCover(cbdCover, user, saveType)));
    }

    @ApiOperation(value = "CBD Cover 이미지 등록", notes = "CBD Cover 이미지를 등록한다\nparameter\n1. id: cbd cover id 필수\n")
    @PostMapping(value = "/cbd/cover/{id}")
    public SingleResult<CbdDto.Cover> saveCbdCoverImage(
            @ApiParam(value = "Cbd Cover ID", required = true) @PathVariable Long id , MultipartFile file,
            @AuthenticationPrincipal User user
    )
    {
        if(!cbdService.findCoverById(id).isPresent()){
            throw new BusinessException(ErrorCode.CBD_COVER_NOT_FOUND);
        }
        return responseService.getSingleResult(CBDMapper.INSTANCE.toCoverDTO(cbdService.saveCbdCoverImage(id, file, user)));
    }

    @ApiOperation(value = "CBD Cover 상태 변경", notes = "CBD Cover 상태를 변경한다\n" +
            "parameter\n" +
            "1. id: cbd cover id 필수\n")
    @PutMapping(value = "/cbd/cover/{id}/{status}")
    public CommonResult modifyCbdCoverStatus(
            @ApiParam(value = "Cbd Cover ID", required = true) @PathVariable Long id,
            @ApiParam(value = "Cbd Cover 상태", required = true, defaultValue = "OPEN")
            @NotEmpty(message = "상태값은 필수 입니다.")
            @Pattern(regexp = "(^[A-Z]*$)", message = "대문자가 아닙니다.")
            @PathVariable String status,
            @AuthenticationPrincipal User user
    )
    {
        cbdService.modifyCbdCoverStatus(id, status);
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "CBD Cover 삭제", notes = "CBD Cover 를 삭제한다")
    @DeleteMapping(value = "/cbd/cover")
    public CommonResult deleteFlagUpdateCbdCover(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal User user
    ){
        for (Long id : ids){
            cbdService.deleteFlagUpdateCbdCover(id);
        }
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "CBD Cover 조회( Design Number )", notes = "Design Number 로 CBD Cover 를 조회한다\n" +
            "1. designNumber: design number 필수\n")
    @GetMapping(value = "/cbd/cover")
    public ListResult<CbdDto.Cover> findCoverByDesignNumber(
            @ApiParam(value = "Design Number", required = true) @RequestParam String designNumber
    ){
        return responseService.getListResult(CBDMapper.INSTANCE.toCoverDTO(cbdService.findCoverByDesignNumber(designNumber)));
    }
}
