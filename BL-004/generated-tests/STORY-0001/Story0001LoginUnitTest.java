package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.application.jpa.dao.DailyLoginReportJpaDao;
import com.sreyas.datamatics.application.jpa.entity.DailyLoginReportDo;
import com.sreyas.datamatics.security.handler.DailyLoginSuccessHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;

/**
 * Source-bound JUnit 5 unit tests generated from approved BL-002 STORY-0001.
 * Frozen application source: CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89.
 *
 * Bound production classes:
 * - com.sreyas.datamatics.cylindermanagement.web.controller.test.LoginController
 * - com.sreyas.datamatics.security.handler.DailyLoginSuccessHandler
 * - com.sreyas.datamatics.application.jpa.dao.DailyLoginReportJpaDao
 * - com.sreyas.datamatics.application.jpa.entity.DailyLoginReportDo
 *
 * This control-repository copy is source-bound but has not been executed in the
 * ChatGPT runtime because Maven/JUnit dependency resolution is unavailable there.
 */
@ExtendWith(MockitoExtension.class)
class Story0001LoginUnitTest {

    private static final String LOGIN_VIEW = "final-version-1/login";
    private static final String ERROR_MESSAGE = "Invalid username or password.";
    private static final String LOGOUT_MESSAGE = "You have been successfully logged out.";
    private static final String SUCCESS_TARGET = "/ownership-dashboard";

    @Mock
    private DailyLoginReportJpaDao dailyLoginReportJpaDao;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TestableDailyLoginSuccessHandler successHandler;

    @Test
    @DisplayName("STORY-0001 UT-01: default login request renders configured login view without messages")
    void defaultLoginRequestRendersConfiguredLoginViewWithoutMessages() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage(null, null);

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertFalse(result.getModel().containsKey("errorMessage"));
        assertFalse(result.getModel().containsKey("logoutMessage"));
    }

    @Test
    @DisplayName("STORY-0001 UT-02: error query adds exact invalid-credential message")
    void errorQueryAddsExactInvalidCredentialMessage() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage("present", null);

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertEquals(ERROR_MESSAGE, result.getModel().get("errorMessage"));
        assertFalse(result.getModel().containsKey("logoutMessage"));
    }

    @Test
    @DisplayName("STORY-0001 UT-03: logout query adds exact logout message")
    void logoutQueryAddsExactLogoutMessage() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage(null, "present");

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertEquals(LOGOUT_MESSAGE, result.getModel().get("logoutMessage"));
        assertFalse(result.getModel().containsKey("errorMessage"));
    }

    @Test
    @DisplayName("STORY-0001 UT-04: error and logout indications execute both source-proved branches")
    void errorAndLogoutIndicationsExecuteBothSourceProvedBranches() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage("present", "present");

        assertEquals(ERROR_MESSAGE, result.getModel().get("errorMessage"));
        assertEquals(LOGOUT_MESSAGE, result.getModel().get("logoutMessage"));
    }

    @Test
    @DisplayName("STORY-0001 UT-05: first successful login of day saves one report and targets dashboard")
    void firstSuccessfulLoginOfDaySavesOneReportAndTargetsDashboard() throws Exception {
        when(dailyLoginReportJpaDao.existsByLoginDate(any(LocalDate.class))).thenReturn(false);

        successHandler.onAuthenticationSuccess(request, response, authentication);

        ArgumentCaptor<LocalDate> dateCaptor = ArgumentCaptor.forClass(LocalDate.class);
        verify(dailyLoginReportJpaDao, times(1)).existsByLoginDate(dateCaptor.capture());
        assertEquals(LocalDate.now(), dateCaptor.getValue());

        ArgumentCaptor<DailyLoginReportDo> reportCaptor = ArgumentCaptor.forClass(DailyLoginReportDo.class);
        verify(dailyLoginReportJpaDao, times(1)).save(reportCaptor.capture());
        assertNotNull(reportCaptor.getValue().getLoginTime());
        assertEquals(SUCCESS_TARGET, successHandler.exposedDefaultTargetUrl());
    }

    @Test
    @DisplayName("STORY-0001 UT-06: later successful login same day does not save duplicate")
    void laterSuccessfulLoginSameDayDoesNotSaveDuplicate() throws Exception {
        when(dailyLoginReportJpaDao.existsByLoginDate(any(LocalDate.class))).thenReturn(true);

        successHandler.onAuthenticationSuccess(request, response, authentication);

        verify(dailyLoginReportJpaDao, times(1)).existsByLoginDate(any(LocalDate.class));
        verify(dailyLoginReportJpaDao, never()).save(any(DailyLoginReportDo.class));
        assertEquals(SUCCESS_TARGET, successHandler.exposedDefaultTargetUrl());
    }

    static class TestableDailyLoginSuccessHandler extends DailyLoginSuccessHandler {
        String exposedDefaultTargetUrl() {
            return getDefaultTargetUrl();
        }
    }
}
