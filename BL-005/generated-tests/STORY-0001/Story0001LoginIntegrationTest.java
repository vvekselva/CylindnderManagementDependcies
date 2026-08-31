package com.sreyas.datamatics.application.jpa.dao.integration.tests;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.sreyas.datamatics.application.jpa.configuration.ApplicationDataConfiguration;
import com.sreyas.datamatics.application.jpa.dao.DailyLoginReportJpaDao;
import com.sreyas.datamatics.application.jpa.entity.DailyLoginReportDo;
import com.sreyas.datamatics.application.test.config.TestApplication;

/**
 * Source-bound JUnit 5 + PostgreSQL Testcontainers integration tests for the
 * persistence portion of approved BL-002 STORY-0001.
 * Frozen source: CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89.
 *
 * The annotations/container/property pattern intentionally follows the frozen
 * DailyLoginReportJpaDaoIntegrationTest already present in cylinder.application.jpa.
 */
@Import(ApplicationDataConfiguration.class)
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0001LoginIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
            .withEnv("TZ", "Asia/Kolkata")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url",
                () -> POSTGRES.getJdbcUrl() + "?options=-c%20TimeZone%3DAsia%2FKolkata");
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Configuration
    static class FlywayConfig {
        @Bean(initMethod = "migrate")
        Flyway flyway() {
            return Flyway.configure()
                    .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
                    .locations("classpath:db/migration")
                    .load();
        }
    }

    @Autowired
    private DailyLoginReportJpaDao dailyLoginReportJpaDao;

    @BeforeEach
    void clearDailyLoginRows() {
        dailyLoginReportJpaDao.deleteAll();
        dailyLoginReportJpaDao.flush();
    }

    @Test
    @DisplayName("STORY-0001 IT-01: normal Flyway/JPA path persists generated daily-login identity")
    void normalFlywayJpaPathPersistsGeneratedDailyLoginIdentity() {
        DailyLoginReportDo report = new DailyLoginReportDo();
        report.setLoginTime(LocalDateTime.now());

        DailyLoginReportDo saved = dailyLoginReportJpaDao.saveAndFlush(report);

        assertThat(saved.getDailyLoginReportId()).isNotNull();
        assertThat(saved.getLoginTime()).isNotNull();
        assertThat(dailyLoginReportJpaDao.findById(saved.getDailyLoginReportId())).isPresent();
    }

    @Test
    @DisplayName("STORY-0001 IT-02: date guard is false before today's login and true after persistence")
    void dateGuardReflectsPersistedLoginForToday() {
        LocalDate today = LocalDate.now();
        assertThat(dailyLoginReportJpaDao.existsByLoginDate(today)).isFalse();

        DailyLoginReportDo report = new DailyLoginReportDo();
        report.setLoginTime(LocalDateTime.now());
        dailyLoginReportJpaDao.saveAndFlush(report);

        assertThat(dailyLoginReportJpaDao.existsByLoginDate(today)).isTrue();
    }

    @Test
    @DisplayName("STORY-0001 IT-03: yesterday's login does not satisfy today's date guard")
    void yesterdayLoginDoesNotSatisfyTodayDateGuard() {
        DailyLoginReportDo report = new DailyLoginReportDo();
        report.setLoginTime(LocalDateTime.now().minusDays(1));
        dailyLoginReportJpaDao.saveAndFlush(report);

        assertThat(dailyLoginReportJpaDao.existsByLoginDate(LocalDate.now())).isFalse();
    }
}
