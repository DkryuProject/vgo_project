package io.vengine.api.v1.audit.controller;

import io.vengine.api.v1.audit.service.AuditService;
import io.vengine.api.v1.user.entity.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@ApiIgnore
@RestController
@RequestMapping("/audit")
public class AuditController {
    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/userList")
    public List<User> findRevisionsWithWhere() {
        return auditService.findRevisionsWithWhere();
    }
}
