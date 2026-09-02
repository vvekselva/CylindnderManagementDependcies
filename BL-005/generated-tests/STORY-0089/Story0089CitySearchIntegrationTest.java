package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
import com.sreyas.datamatics.application.jpa.dao.CityJpaDao;
import com.sreyas.datamatics.application.jpa.entity.CityDo;
import com.sreyas.datamatics.application.test.config.TestApplication;

/** PostgreSQL read-only search integration mapping for approved STORY-0089. */
@Import(ApplicationDataConfiguration.class)
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0089CitySearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
        .withUsername("test").withPassword("test");

    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired CityJpaDao dao;

    @Test void containsIgnoreCaseReturnsOnlyMatchingCities() {
        CityDo city = new CityDo(); city.setCityName("Coimbatore_STORY0089"); city.setDescription("Coimbatore");
        CityDo other = new CityDo(); other.setCityName("Madurai_STORY0089"); other.setDescription("Madurai");
        dao.saveAndFlush(city); dao.saveAndFlush(other);
        assertEquals(1, dao.findByCityNameContainingIgnoreCase("coimbatore_story0089").size());
        assertEquals(0, dao.findByCityNameContainingIgnoreCase("ZZZ_STORY0089").size());
    }
}
