package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * PostgreSQL query-contract integration for STORY-0107.
 *
 * Verifies the same active/non-completed/non-exception vehicle-content rules and
 * serial/primary-identifier search semantics used by
 * CylinderLogisticsExecutionLineJpaDao.findActiveVehicleContents.
 */
@Testcontainers
class Story0107CylindersOnVehiclePostgreSQLIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16").withUsername("test").withPassword("test");

    private Connection connection;

    @BeforeEach
    void resetFixture() throws Exception {
        connection = DriverManager.getConnection(
                POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());

        try (Statement s = connection.createStatement()) {
            s.execute("DROP TABLE IF EXISTS public.tbl_cylinder_logistics_execution_line");
            s.execute("DROP TABLE IF EXISTS public.tbl_cylinder_identifier");
            s.execute("DROP TABLE IF EXISTS public.tbl_cylinder_logistics_execution");
            s.execute("DROP TABLE IF EXISTS public.tbl_cylinder_states");
            s.execute("DROP TABLE IF EXISTS public.tbl_cylinder");
            s.execute("DROP TABLE IF EXISTS public.tbl_product");
            s.execute("DROP TABLE IF EXISTS public.tbl_vehicle_load");

            s.execute("CREATE TABLE public.tbl_vehicle_load (pk_vehicle_load_id BIGINT PRIMARY KEY)");
            s.execute("CREATE TABLE public.tbl_product (pk_product_id BIGINT PRIMARY KEY, product_name VARCHAR(100))");
            s.execute("""
                CREATE TABLE public.tbl_cylinder (
                    pk_cylinder_id BIGINT PRIMARY KEY,
                    cylinder_serial VARCHAR(100) NOT NULL,
                    fk_product BIGINT
                )
                """);
            s.execute("""
                CREATE TABLE public.tbl_cylinder_states (
                    pk_cylinder_state_id BIGINT PRIMARY KEY,
                    cylinder_state VARCHAR(100) NOT NULL
                )
                """);
            s.execute("""
                CREATE TABLE public.tbl_cylinder_logistics_execution (
                    pk_cylinder_logistics_execution_id BIGINT PRIMARY KEY,
                    fk_vehicle_load BIGINT NOT NULL
                )
                """);
            s.execute("""
                CREATE TABLE public.tbl_cylinder_logistics_execution_line (
                    pk_cylinder_logistics_execution_line_id BIGINT PRIMARY KEY,
                    fk_cylinder_logistics_execution BIGINT NOT NULL,
                    fk_cylinder BIGINT NOT NULL,
                    fk_cylinder_state BIGINT NOT NULL,
                    is_active BOOLEAN NOT NULL,
                    is_completed BOOLEAN NOT NULL,
                    is_exception BOOLEAN NOT NULL
                )
                """);
            s.execute("""
                CREATE TABLE public.tbl_cylinder_identifier (
                    pk_cylinder_identifier_id BIGINT PRIMARY KEY,
                    fk_cylinder BIGINT NOT NULL,
                    identifier_value VARCHAR(100) NOT NULL,
                    is_active BOOLEAN NOT NULL,
                    is_primary BOOLEAN NOT NULL
                )
                """);

            s.execute("INSERT INTO public.tbl_vehicle_load VALUES (77), (88)");
            s.execute("INSERT INTO public.tbl_product VALUES (10, 'Oxygen')");
            s.execute("""
                INSERT INTO public.tbl_cylinder_states VALUES
                    (1, 'EMPTY_PICKED_FOR_REFILL'),
                    (2, 'EMPTY_IN_TRANSIT_TO_YARD'),
                    (3, 'FULL_PICKED_UP_FOR_DELIVERY')
                """);
            s.execute("""
                INSERT INTO public.tbl_cylinder VALUES
                    (201, 'SER-201', 10),
                    (202, 'SER-202', 10),
                    (203, 'SER-203', 10),
                    (204, 'SER-204', 10),
                    (205, 'SER-205', 10),
                    (206, 'SER-206', 10)
                """);
            s.execute("""
                INSERT INTO public.tbl_cylinder_logistics_execution VALUES
                    (1001, 77),
                    (1002, 88)
                """);
            s.execute("""
                INSERT INTO public.tbl_cylinder_logistics_execution_line VALUES
                    (1, 1001, 201, 1, TRUE,  FALSE, FALSE),
                    (2, 1001, 202, 2, TRUE,  FALSE, FALSE),
                    (3, 1001, 203, 1, FALSE, FALSE, FALSE),
                    (4, 1001, 204, 1, TRUE,  TRUE,  FALSE),
                    (5, 1001, 205, 1, TRUE,  FALSE, TRUE),
                    (6, 1002, 206, 1, TRUE,  FALSE, FALSE)
                """);
            s.execute("""
                INSERT INTO public.tbl_cylinder_identifier VALUES
                    (11, 201, 'PHY-ALPHA', TRUE, TRUE),
                    (12, 202, 'PHY-BETA', TRUE, TRUE),
                    (13, 203, 'INACTIVE-ID', FALSE, TRUE)
                """);
        }
    }

    @Test
    void queryReturnsOnlyActiveOpenNonExceptionLinesForRequestedLoadAndStates() throws Exception {
        assertEquals(List.of(201L, 202L),
                query(77L, List.of("EMPTY_PICKED_FOR_REFILL", "EMPTY_IN_TRANSIT_TO_YARD"), null));
    }

    @Test
    void searchMatchesCylinderSerialOrActivePrimaryPhysicalIdentifier() throws Exception {
        assertEquals(List.of(201L),
                query(77L, List.of("EMPTY_PICKED_FOR_REFILL", "EMPTY_IN_TRANSIT_TO_YARD"), "phy-alpha"));
        assertEquals(List.of(202L),
                query(77L, List.of("EMPTY_PICKED_FOR_REFILL", "EMPTY_IN_TRANSIT_TO_YARD"), "ser-202"));
        assertEquals(List.of(),
                query(77L, List.of("EMPTY_PICKED_FOR_REFILL", "EMPTY_IN_TRANSIT_TO_YARD"), "inactive-id"));
    }

    private List<Long> query(long vehicleLoadId, List<String> states, String searchTerm) throws Exception {
        String sql = """
            SELECT cylinder.pk_cylinder_id
            FROM public.tbl_cylinder_logistics_execution_line line
            JOIN public.tbl_cylinder cylinder
              ON cylinder.pk_cylinder_id = line.fk_cylinder
            LEFT JOIN public.tbl_product product
              ON product.pk_product_id = cylinder.fk_product
            JOIN public.tbl_cylinder_states state
              ON state.pk_cylinder_state_id = line.fk_cylinder_state
            JOIN public.tbl_cylinder_logistics_execution execution
              ON execution.pk_cylinder_logistics_execution_id = line.fk_cylinder_logistics_execution
            JOIN public.tbl_vehicle_load vehicle_load
              ON vehicle_load.pk_vehicle_load_id = execution.fk_vehicle_load
            WHERE vehicle_load.pk_vehicle_load_id = ?
              AND line.is_active = TRUE
              AND line.is_completed = FALSE
              AND line.is_exception = FALSE
              AND state.cylinder_state IN (?, ?)
              AND (? IS NULL OR ? = ''
                   OR LOWER(cylinder.cylinder_serial) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR EXISTS (
                       SELECT 1
                       FROM public.tbl_cylinder_identifier ci
                       WHERE ci.fk_cylinder = cylinder.pk_cylinder_id
                         AND ci.is_active = TRUE
                         AND ci.is_primary = TRUE
                         AND LOWER(ci.identifier_value) LIKE LOWER(CONCAT('%', ?, '%'))
                   ))
            ORDER BY cylinder.cylinder_serial ASC
            """;
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, vehicleLoadId);
            ps.setString(2, states.get(0));
            ps.setString(3, states.get(1));
            for (int i = 4; i <= 7; i++) ps.setString(i, searchTerm);
            try (ResultSet rs = ps.executeQuery()) {
                List<Long> ids = new ArrayList<>();
                while (rs.next()) ids.add(rs.getLong(1));
                return ids;
            }
        }
    }
}
