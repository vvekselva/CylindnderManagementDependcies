package com.sreyas.datamatics.cylinder.management.bl005.story0013;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.sreyas.datamatics.application.dto.ChallanBookRegistryDto;
import com.sreyas.datamatics.application.dto.enums.BookLocation;
import com.sreyas.datamatics.application.dto.enums.BookType;
import com.sreyas.datamatics.application.jpa.dao.ChallanBookRegistryJpaDao;
import com.sreyas.datamatics.application.request.dto.ChallanBookIngestionRequestDto;
import com.sreyas.datamatics.cylinder.management.services.ChallanBookIngestionService;

/**
 * Generated PostgreSQL/Testcontainers integration test for approved STORY-0013.
 * Frozen source: CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89.
 * Normal Flyway/JPA initialization is required; no H2/manual-SQL substitution is allowed.
 */
@Testcontainers
@SpringBootTest(classes = Story0013ChallanBookIntegrationTest.TestApplication.class)
class Story0013ChallanBookIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void postgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "none");
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired
    private ChallanBookIngestionService service;

    @Autowired
    private ChallanBookRegistryJpaDao dao;

    @Test
    void validBookPersistsWithGeneratedIdentityAndTimestamps() throws Exception {
        var response = service.processRequest(request("IT-BOOK-001", 1, 10));

        assertNotNull(response.getIngestedChallanBook().getBookId());
        var persisted = dao.findByBookCode("IT-BOOK-001").orElseThrow();
        assertNotNull(persisted.getCreatedAt());
        assertNotNull(persisted.getUpdatedAt());
        assertEquals(1, persisted.getStartSheetNumber());
        assertEquals(10, persisted.getEndSheetNumber());
    }

    @Test
    void duplicateBookCodeIsRejectedByPostgresqlUniquenessConstraint() throws Exception {
        service.processRequest(request("IT-DUP-001", 1, 5));

        assertThrows(DataIntegrityViolationException.class,
                () -> service.processRequest(request("IT-DUP-001", 6, 10)));
    }

    @Test
    void invalidRangeCurrentlyCanPersistBecauseServiceThrowIsCommented() throws Exception {
        service.processRequest(request("IT-RANGE-GAP", 50, 1));

        var persisted = dao.findByBookCode("IT-RANGE-GAP").orElseThrow();
        assertEquals(50, persisted.getStartSheetNumber());
        assertEquals(1, persisted.getEndSheetNumber());
    }

    @Test
    void registrationPathDoesNotGeneratePerSheetLedgerRows() throws Exception {
        service.processRequest(request("IT-NO-LEDGER", 1, 3));

        var persisted = dao.findByBookCode("IT-NO-LEDGER").orElseThrow();
        assertEquals(0, persisted.getPages().size());
    }

    private static ChallanBookIngestionRequestDto request(String code, int start, int end) {
        ChallanBookRegistryDto dto = new ChallanBookRegistryDto();
        dto.setBookCode(code);
        dto.setBookType(BookType.DELIVERY_CHALLAN);
        dto.setSeriesPrefix("IT");
        dto.setStartSheetNumber(start);
        dto.setEndSheetNumber(end);
        dto.setCurrentLocation(BookLocation.IN_OFFICE);
        ChallanBookIngestionRequestDto request = new ChallanBookIngestionRequestDto();
        request.setChallanBook(dto);
        return request;
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration
    @EntityScan("com.sreyas.datamatics.application.jpa.entity")
    @EnableJpaRepositories("com.sreyas.datamatics.application.jpa.dao")
    @ComponentScan(basePackages = {
            "com.sreyas.datamatics.cylinder.management.services",
            "com.sreyas.datamatics.cylinder.management.mapper"
    })
    static class TestApplication {
    }
}
