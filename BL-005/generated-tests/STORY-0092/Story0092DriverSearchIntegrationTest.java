package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.sreyas.datamatics.application.jpa.configuration.ApplicationDataConfiguration;
import com.sreyas.datamatics.application.jpa.dao.DriverJpaDao;
import com.sreyas.datamatics.application.jpa.entity.DriverDo;
import com.sreyas.datamatics.application.test.config.TestApplication;

/** PostgreSQL read-only driver-search integration mapping for approved STORY-0092. */
@Import(ApplicationDataConfiguration.class)
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0092DriverSearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
        .withUsername("test").withPassword("test");

    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired DriverJpaDao dao;

    @Test void containsIgnoreCaseReturnsOnlyMatchingDriversWithPaging() {
        DriverDo ravi = new DriverDo(); ravi.setDriverName("Ravi_STORY0092"); ravi.setLicenceNumber("DL0092A");
        DriverDo kumar = new DriverDo(); kumar.setDriverName("Kumar_STORY0092"); kumar.setLicenceNumber("DL0092B");
        dao.saveAndFlush(ravi); dao.saveAndFlush(kumar);
        assertEquals(1, dao.findByDriverNameContainingIgnoreCase("ravi_story0092", PageRequest.of(0, 10)).getTotalElements());
        assertEquals(0, dao.findByDriverNameContainingIgnoreCase("ZZZ_STORY0092", PageRequest.of(0, 10)).getTotalElements());
    }
}
