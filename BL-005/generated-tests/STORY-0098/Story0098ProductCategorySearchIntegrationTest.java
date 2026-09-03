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
import com.sreyas.datamatics.application.jpa.dao.ProductCategoryJpaDao;
import com.sreyas.datamatics.application.jpa.entity.ProductCategoryDo;
import com.sreyas.datamatics.application.test.config.TestApplication;

/** PostgreSQL read-only product-category search integration mapping for STORY-0098. */
@Import(ApplicationDataConfiguration.class)
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0098ProductCategorySearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16").withUsername("test").withPassword("test");
    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }
    @Autowired ProductCategoryJpaDao dao;
    @Test void containsIgnoreCaseReturnsOnlyMatchingCategories() {
        ProductCategoryDo a = new ProductCategoryDo(); a.setProductCategory("Industrial_STORY0098"); a.setDescription("Industrial");
        ProductCategoryDo b = new ProductCategoryDo(); b.setProductCategory("Medical_STORY0098"); b.setDescription("Medical");
        dao.saveAndFlush(a); dao.saveAndFlush(b);
        assertEquals(1, dao.findByProductCategoryContainingIgnoreCase("industrial_story0098").size());
        assertEquals(0, dao.findByProductCategoryContainingIgnoreCase("ZZZ_STORY0098").size());
    }
}
