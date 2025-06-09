package com.aws.ws;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class SessionIdLoggingFilter implements Filter {

    private static final String SESSION_ID = "x-session-id";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        try {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String sessionId = httpRequest.getHeader(SESSION_ID);

            if (sessionId == null || sessionId.isEmpty()) {
                sessionId = UUID.randomUUID().toString(); // fallback
            }

            MDC.put(SESSION_ID, sessionId);
            chain.doFilter(request, response);
        } finally {
            MDC.remove(SESSION_ID); // limpieza post request
        }
    }
}

