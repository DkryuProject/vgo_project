package io.vengine.api.v1.commonInfo.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.error.BusinessException;
import io.vengine.api.error.errorCode.ErrorCode;
import io.vengine.api.response.model.CommonResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.dto.CommonInfoDto;
import io.vengine.api.v1.commonInfo.dto.NoticeRequest;
import io.vengine.api.v1.commonInfo.dto.NoticeResponse;
import io.vengine.api.v1.commonInfo.entity.CommonNotice;
import io.vengine.api.v1.commonInfo.mapper.NoticeMapper;
import io.vengine.api.v1.commonInfo.repository.CommonNoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Api(tags = {"27. NOTICE"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1/notice")
public class NoticeController {
    private final ResponseService responseService;

    @Autowired
    CommonNoticeRepository noticeRepository;

    @ApiOperation(value = "공지 사항 전체 조회")
    @GetMapping(value = "")
    public PageResult<NoticeResponse> findAllNotice(
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size
    ){
        Page<CommonNotice> noticePage = noticeRepository.findAll(PageRequest.of((page == 0) ? 0 : (page - 1), size));
        CommonInfoDto.PageDto<NoticeResponse> noticePageDto = CommonInfoDto.toPageDto(noticePage,
                NoticeMapper.INSTANCE.toNoticeDto(noticePage.getContent()));
        return responseService.getPageResult(noticePageDto);
    }

    @ApiOperation(value = "공지 사항 저장")
    @PostMapping(value = "")
    public CommonResult saveNotice(
            @Valid @RequestBody NoticeRequest noticeRequest
    ){
        noticeRepository.save(NoticeMapper.INSTANCE.toNotice(noticeRequest));
        return responseService.getSuccessResult();
    }

    @ApiOperation(value = "공지 사항 수정")
    @PutMapping(value = "/{noticeID}")
    public CommonResult saveNotice(
            @ApiParam(value = "공지사항 ID", required = true) @PathVariable Long noticeID,
            @Valid @RequestBody NoticeRequest noticeRequest
    ){
        CommonNotice notice = noticeRepository.findById(noticeID)
                .orElseThrow(()-> new BusinessException(ErrorCode.NOTICE_NOT_FOUNR));
        NoticeMapper.INSTANCE.toNotice(noticeRequest, notice);
        noticeRepository.save(notice);
        return responseService.getSuccessResult();
    }
}

