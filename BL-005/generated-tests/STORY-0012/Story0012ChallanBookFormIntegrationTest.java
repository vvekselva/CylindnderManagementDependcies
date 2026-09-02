package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.List;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.ModelAndView;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.sreyas.datamatics.application.jpa.configuration.ApplicationDataConfiguration;
import com.sreyas.datamatics.application.jpa.dao.SummaryMetricLookupJpaDao;
import com.sreyas.datamatics.application.jpa.entity.SummaryMetricLookupDo;
import com.sreyas.datamatics.application.test.config.TestApplication;
import com.sreyas.datamatics.cylinder.management.mapper.SummaryMetricLookupMapper;
import com.sreyas.datamatics.cylinder.management.services.SummaryMetricLookupFetchService;

/**
 * PostgreSQL/Testcontainers/Flyway/JPA integration mapping for approved STORY-0012.
 * Generated from governed source package SHA-256
 * 60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2.
 */
@Import({ApplicationDataConfiguration.class, SummaryMetricLookupFetchService.class, SummaryMetricLookupMapper.class})
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0012ChallanBookFormIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
            .withEnv("TZ", "Asia/Kolkata")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", () -> POSTGRES.getJdbcUrl() + "?options=-c%20TimeZone%3DAsia%2FKolkata");
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

    @Autowired SummaryMetricLookupJpaDao dao;
    @Autowired SummaryMetricLookupFetchService metricService;

    @BeforeEach
    void ensureKnownMetric() {
        if (dao.findByLookUpKey("TOTAL_CHALLAN_BOOKS").isEmpty()) {
            SummaryMetricLookupDo row = new SummaryMetricLookupDo();
            row.setLookUpKey("TOTAL_CHALLAN_BOOKS");
            row.setUiLabelForTheLookupField("Total Challan Books");
            row.setActualMeaning("Integration-test source-bound summary metric");
            row.setValue(BigDecimal.ONE);
            row.setDecimalValue(Boolean.FALSE);
            dao.saveAndFlush(row);
        }
    }

    @Test
    void actualJpaMetricReadFeedsTheApprovedRegistrationGet() {
        ChallanBookWebController controller = new ChallanBookWebController();
        ReflectionTestUtils.setField(controller, "summaryMetricLookupFetchService", metricService);

        ModelAndView result = controller.showAddBookForm();

        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        List<?> totals = (List<?>) result.getModel().get("challanBookTotalMetrics");
        assertNotNull(totals);
        assertTrue(totals.size() >= 1);
    }
}
