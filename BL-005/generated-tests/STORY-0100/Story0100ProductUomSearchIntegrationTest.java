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
import com.sreyas.datamatics.application.jpa.dao.ProductUomJpaDao;
import com.sreyas.datamatics.application.jpa.entity.ProductUomDo;
import com.sreyas.datamatics.application.test.config.TestApplication;

/** PostgreSQL read-only Product UOM search integration mapping for STORY-0100. */
@Import(ApplicationDataConfiguration.class)
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0100ProductUomSearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16").withUsername("test").withPassword("test");
    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }
    @Autowired ProductUomJpaDao dao;
    @Test void containsIgnoreCaseReturnsOnlyMatchingUoms() {
        ProductUomDo kg = new ProductUomDo(); kg.setProductUom("KG_STORY0100"); kg.setDescription("Kilogram");
        ProductUomDo litre = new ProductUomDo(); litre.setProductUom("LITRE_STORY0100"); litre.setDescription("Litre");
        dao.saveAndFlush(kg); dao.saveAndFlush(litre);
        assertEquals(1, dao.findByProductUomContainingIgnoreCase("kg_story0100").size());
        assertEquals(0, dao.findByProductUomContainingIgnoreCase("ZZZ_STORY0100").size());
    }
}
