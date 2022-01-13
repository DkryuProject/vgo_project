package io.vengine.api.v1.dashboard.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.vengine.api.response.model.SingleResult;
import io.vengine.api.response.service.ResponseService;
import io.vengine.api.v1.dashboard.dto.MonthlyCountDto;
import io.vengine.api.v1.dashboard.service.DashBordService;
import io.vengine.api.v1.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = {"28. DASH BOARD"})
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/v1")
public class DashBoardController {
    private final ResponseService responseService;

    @Autowired
    DashBordService dashBordService;

    @ApiOperation(value = "월별 갯수")
    @GetMapping(value = "/monthly/{year}/{month}")
    public SingleResult<MonthlyCountDto> findCbdOptionCountByMonth(
            @ApiParam(value = "년도", required = true) @PathVariable int year,
            @ApiParam(value = "월", required = true) @PathVariable int month,
            @AuthenticationPrincipal User user
    )
    {
        return responseService.getSingleResult(dashBordService.findDashBoardCountByMonth(user.getCompId(), year, month));
    }
}
