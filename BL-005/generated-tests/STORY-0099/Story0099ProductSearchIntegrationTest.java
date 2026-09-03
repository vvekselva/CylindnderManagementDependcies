package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.sreyas.datamatics.application.jpa.configuration.ApplicationDataConfiguration;
import com.sreyas.datamatics.application.jpa.dao.ProductJpaDao;
import com.sreyas.datamatics.application.jpa.entity.ProductDo;
import com.sreyas.datamatics.application.test.config.TestApplication;

/** PostgreSQL read-only product search integration mapping for STORY-0099. */
@Import(ApplicationDataConfiguration.class)
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0099ProductSearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16").withUsername("test").withPassword("test");
    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }
    @Autowired ProductJpaDao dao;
    @Test void containsIgnoreCaseReturnsOnlyMatchingProducts() {
        ProductDo oxygen = new ProductDo(); oxygen.setProductName("Oxygen_STORY0099"); oxygen.setDescription("Oxygen"); oxygen.setIgstRate(new BigDecimal("5.00"));
        ProductDo argon = new ProductDo(); argon.setProductName("Argon_STORY0099"); argon.setDescription("Argon"); argon.setIgstRate(new BigDecimal("5.00"));
        dao.saveAndFlush(oxygen); dao.saveAndFlush(argon);
        assertEquals(1, dao.findByProductNameContainingIgnoreCase("oxygen_story0099").size());
        assertEquals(0, dao.findByProductNameContainingIgnoreCase("ZZZ_STORY0099").size());
    }
}
