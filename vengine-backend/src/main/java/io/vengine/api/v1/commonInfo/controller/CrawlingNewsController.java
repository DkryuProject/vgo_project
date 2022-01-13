package io.vengine.api.v1.commonInfo.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.common.dto.CommonDto;
import io.vengine.api.common.utils.JsonUtil;
import io.vengine.api.response.model.ListResult;
import io.vengine.api.response.model.PageResult;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.commonInfo.entity.CrawlingNews;
import io.vengine.api.v1.commonInfo.entity.CrawlingWord;
import io.vengine.api.v1.commonInfo.repository.CrawlingNewsRepository;
import io.vengine.api.v1.commonInfo.repository.CrawlingWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Api(tags = {"29. CRAWLING NEWS"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1/news")
public class CrawlingNewsController {
    private final ResponseService responseService;

    @Autowired
    CrawlingNewsRepository crawlingNewsRepository;

    private  final CrawlingWordRepository crawlingWordRepository;

    @ApiOperation(value = "뉴스 조회")
    @GetMapping(value = "/{country}")
    public PageResult<CrawlingNews> findAllNews(
            @ApiParam(value = "국가", required = true) @PathVariable @Pattern(regexp = "(ko|vi|id|en)")String country,
            @ApiParam(value = "현재페이지", required = true) @RequestParam int page,
            @ApiParam(value = "페이지당 데이터 수", required = true) @RequestParam int size,
            @ApiParam(value = "시작일자") @RequestParam(required = false) String start,
            @ApiParam(value = "종료일자") @RequestParam(required = false) String end,
            @ApiParam(value = "키워드", required = true) @RequestParam String searchKeyWord
    ){
        Page pageResult = crawlingNewsRepository.searchNews(country, start, end, searchKeyWord, PageRequest.of((page == 0) ? 0 : (page - 1), size));
        CommonDto.PageDto pageDto= new CommonDto.PageDto();
        pageDto.setContent(pageResult.getContent());
        pageDto.setTotalElements(pageResult.getTotalElements());
        pageDto.setTotalPages(pageResult.getTotalPages());
        pageDto.setSize(pageResult.getSize());
        pageDto.setNumber(pageResult.getNumber()+1);
        return responseService.getPageResult(pageDto);
    }

    @ApiOperation(value = "뉴스 Word 조회")
    @GetMapping(value = "/word/{country}")
    public SingleResult<Map<String, Integer>> findNewsWord(
            @ApiParam(value = "국가", required = true) @PathVariable @Pattern(regexp = "(ko|vi|id|en)")String country,
            @ApiParam(value = "시작일자", required = true) @RequestParam String start,
            @ApiParam(value = "종료일자", required = true) @RequestParam String end
    ){
        LocalDate startDate = LocalDate.parse(start, DateTimeFormatter.ISO_DATE);
        LocalDate endDate = LocalDate.parse(end, DateTimeFormatter.ISO_DATE);

        List<Map<String, Integer>> crawlingWords =
                crawlingWordRepository.findByCountryAndCreatedDateBetween(
                    country, startDate.atStartOfDay(), LocalDateTime.of(endDate, LocalTime.MAX)
                )
                .stream()
                .map(CrawlingWord::getMap)
                .collect(Collectors.toList());

        Map<String, Integer> resultMap = new HashMap<>();

        for (Map<String, Integer> map : crawlingWords){
            for(String key: map.keySet()){
                if(!resultMap.containsKey(key)){
                    resultMap.put(key,0);
                }
            }
        }

        for(String key: resultMap.keySet()){
            for (Map<String, Integer> map : crawlingWords){
                if(map.containsKey(key)){
                    resultMap.put(key, resultMap.get(key)+map.get(key));
                }
            }
        }

        return responseService.getSingleResult(resultMap);
    }
}
