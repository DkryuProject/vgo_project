package io.vengine.api.config.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 커스텀 예외처리를 적용하기 위하여 SpringSecurity에서 제공하는 AuthenticationEntryPoint를 상속받아 재정의.
 * 예외 발생 시 /exception/entrypoint로 포워딩 시킴.
 */
@Slf4j
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.sendRedirect("/exception/entrypoint");
    }
}
