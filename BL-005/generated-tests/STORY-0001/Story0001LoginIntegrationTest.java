import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
class Story0001LoginIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("cylinder_test")
                    .withUsername("cylinder_test")
                    .withPassword("cylinder_test");

    @Test
    @DisplayName("STORY-0001 IT-01: PostgreSQL Testcontainer starts")
    void postgresContainerStarts() {
        assertTrue(POSTGRES.isRunning());
        assertNotNull(POSTGRES.getJdbcUrl());
    }

    /*
     * APPLICATION SOURCE BINDING REQUIRED BEFORE EXECUTION:
     * - bind Spring Boot test configuration / DynamicPropertySource to POSTGRES;
     * - run the normal Flyway migration chain;
     * - exercise Spring Security POST /perform_login with userName/password;
     * - assert public.tbl_daily_login_report through repository/JdbcTemplate;
     * - first successful login -> one row, login_time non-null;
     * - second same-day successful login -> still one row;
     * - invalid authentication -> no row;
     * - successful authentication -> /ownership-dashboard redirect.
     *
     * The next orchestrator must resolve exact frozen package paths and credential
     * fixture setup from application source. No production/live credentials belong here.
     */
}
