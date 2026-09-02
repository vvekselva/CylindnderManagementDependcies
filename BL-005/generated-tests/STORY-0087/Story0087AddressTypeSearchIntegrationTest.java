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
import com.sreyas.datamatics.application.jpa.dao.AddressTypeJpaDao;
import com.sreyas.datamatics.application.jpa.entity.AddressTypeDo;
import com.sreyas.datamatics.application.test.config.TestApplication;

/** PostgreSQL read-only search integration mapping for approved STORY-0087. */
@Import(ApplicationDataConfiguration.class)
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0087AddressTypeSearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
        .withUsername("test").withPassword("test");

    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired AddressTypeJpaDao dao;

    @Test void containsIgnoreCaseReturnsOnlyMatchingAddressTypes() {
        AddressTypeDo home = new AddressTypeDo(); home.setAddressType("HOME_STORY0087"); home.setDescription("Home");
        AddressTypeDo office = new AddressTypeDo(); office.setAddressType("OFFICE_STORY0087"); office.setDescription("Office");
        dao.saveAndFlush(home); dao.saveAndFlush(office);
        assertEquals(1, dao.findByAddressTypeContainingIgnoreCase("home_story0087").size());
        assertEquals(0, dao.findByAddressTypeContainingIgnoreCase("ZZZ_STORY0087").size());
    }
}
