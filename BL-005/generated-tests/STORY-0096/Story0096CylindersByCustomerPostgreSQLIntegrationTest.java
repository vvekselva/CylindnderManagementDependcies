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
 * PostgreSQL query-contract integration for STORY-0096.
 *
 * This deliberately isolates the native SQL relation contract used by
 * CustomerHeldCylinderSearchJpaDao. Controller/service delegation is covered
 * separately in BL-004; this class verifies PostgreSQL filtering/search/count
 * behavior without inventing the rest of the application schema.
 */
@Testcontainers
class Story0096CylindersByCustomerPostgreSQLIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16").withUsername("test").withPassword("test");

    private Connection connection;

    @BeforeEach
    void resetFixture() throws Exception {
        connection = DriverManager.getConnection(
                POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());

        try (Statement s = connection.createStatement()) {
            s.execute("DROP VIEW IF EXISTS public.vw_cylinder_party_custody_with_identifiers");
            s.execute("DROP TABLE IF EXISTS public.story0096_custody_identifier_fixture");
            s.execute("DROP TABLE IF EXISTS public.tbl_cylinder");
            s.execute("DROP TABLE IF EXISTS public.tbl_product");

            s.execute("""
                CREATE TABLE public.tbl_product (
                    pk_product_id BIGINT PRIMARY KEY,
                    product_name VARCHAR(100) NOT NULL
                )
                """);
            s.execute("""
                CREATE TABLE public.tbl_cylinder (
                    pk_cylinder_id BIGINT PRIMARY KEY,
                    description VARCHAR(100),
                    total_quantity NUMERIC(10,2),
                    fk_product BIGINT
                )
                """);
            s.execute("""
                CREATE TABLE public.story0096_custody_identifier_fixture (
                    logical_cylinder_id BIGINT NOT NULL,
                    display_cylinder_identifier VARCHAR(100),
                    logical_cylinder_code VARCHAR(100),
                    active_identifier_id BIGINT,
                    active_identifier_type VARCHAR(50),
                    active_actual_cylinder_identifier VARCHAR(100),
                    asset_ownership_type_id BIGINT,
                    asset_ownership_type_code VARCHAR(50),
                    asset_ownership_type_name VARCHAR(100),
                    is_company_fleet_asset BOOLEAN,
                    is_external_exchangeable BOOLEAN,
                    owner_supplier_id BIGINT,
                    owner_supplier_name VARCHAR(200),
                    owner_customer_id BIGINT,
                    owner_customer_name VARCHAR(500),
                    party_type VARCHAR(20),
                    custody_status VARCHAR(20),
                    fk_customer BIGINT
                )
                """);
            s.execute("""
                CREATE VIEW public.vw_cylinder_party_custody_with_identifiers AS
                SELECT * FROM public.story0096_custody_identifier_fixture
                """);

            s.execute("INSERT INTO public.tbl_product VALUES (10, 'Oxygen')");
            s.execute("""
                INSERT INTO public.tbl_cylinder
                    (pk_cylinder_id, description, total_quantity, fk_product)
                VALUES
                    (101, 'customer 42 active A', 47.50, 10),
                    (102, 'customer 42 active B', 47.50, 10),
                    (103, 'other customer', 47.50, 10),
                    (104, 'closed custody', 47.50, 10),
                    (105, 'supplier custody', 47.50, 10)
                """);

            insertFixture(s,101,"PHY-200","LOG-101","ALT-101","CUSTOMER","ACTIVE",42L);
            insertFixture(s,102,"PHY-100","LOG-102","ALT-X9","CUSTOMER","ACTIVE",42L);
            insertFixture(s,103,"PHY-300","LOG-103","ALT-103","CUSTOMER","ACTIVE",43L);
            insertFixture(s,104,"PHY-400","LOG-104","ALT-104","CUSTOMER","CLOSED",42L);
            insertFixture(s,105,"PHY-500","LOG-105","ALT-105","SUPPLIER","ACTIVE",42L);
        }
    }

    @Test
    void activeCustomerCustodyFiltersExactCustomerAndOrdersByDisplayIdentifier() throws Exception {
        List<Long> ids = query(42L, null);
        assertEquals(List.of(102L, 101L), ids);
        assertEquals(2L, count(42L, null));
    }

    @Test
    void searchMatchesLogicalActualOrDisplayIdentifierCaseInsensitively() throws Exception {
        assertEquals(List.of(102L), query(42L, "alt-x9"));
        assertEquals(List.of(101L), query(42L, "log-101"));
        assertEquals(List.of(101L), query(42L, "phy-200"));
        assertEquals(0L, count(42L, "does-not-exist"));
    }

    private List<Long> query(long customerId, String searchTerm) throws Exception {
        String sql = """
            SELECT v.logical_cylinder_id
            FROM public.vw_cylinder_party_custody_with_identifiers v
            JOIN public.tbl_cylinder c
              ON c.pk_cylinder_id = v.logical_cylinder_id
            LEFT JOIN public.tbl_product p
              ON p.pk_product_id = c.fk_product
            WHERE v.party_type = 'CUSTOMER'
              AND v.custody_status = 'ACTIVE'
              AND v.fk_customer = ?
              AND (? IS NULL OR ? = ''
                   OR LOWER(v.logical_cylinder_code) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR LOWER(v.active_actual_cylinder_identifier) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR LOWER(v.display_cylinder_identifier) LIKE LOWER(CONCAT('%', ?, '%')))
            ORDER BY v.display_cylinder_identifier ASC
            """;
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            for (int i = 2; i <= 6; i++) ps.setString(i, searchTerm);
            try (ResultSet rs = ps.executeQuery()) {
                List<Long> ids = new ArrayList<>();
                while (rs.next()) ids.add(rs.getLong(1));
                return ids;
            }
        }
    }

    private long count(long customerId, String searchTerm) throws Exception {
        String sql = """
            SELECT COUNT(*)
            FROM public.vw_cylinder_party_custody_with_identifiers v
            WHERE v.party_type = 'CUSTOMER'
              AND v.custody_status = 'ACTIVE'
              AND v.fk_customer = ?
              AND (? IS NULL OR ? = ''
                   OR LOWER(v.logical_cylinder_code) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR LOWER(v.active_actual_cylinder_identifier) LIKE LOWER(CONCAT('%', ?, '%'))
                   OR LOWER(v.display_cylinder_identifier) LIKE LOWER(CONCAT('%', ?, '%')))
            """;
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            for (int i = 2; i <= 6; i++) ps.setString(i, searchTerm);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        }
    }

    private static void insertFixture(Statement s, long cylinderId, String display,
            String logical, String actual, String partyType, String custodyStatus,
            long customerId) throws Exception {
        s.execute("""
            INSERT INTO public.story0096_custody_identifier_fixture (
                logical_cylinder_id, display_cylinder_identifier,
                logical_cylinder_code, active_identifier_id,
                active_identifier_type, active_actual_cylinder_identifier,
                asset_ownership_type_id, asset_ownership_type_code,
                asset_ownership_type_name, is_company_fleet_asset,
                is_external_exchangeable, owner_customer_id,
                owner_customer_name, party_type, custody_status, fk_customer
            ) VALUES (
                %d, '%s', '%s', %d, 'COMPANY_SERIAL', '%s',
                1, 'COMPANY_OWNED', 'Company Owned', TRUE, FALSE,
                %d, 'Customer %d', '%s', '%s', %d
            )
            """.formatted(cylinderId, display, logical, cylinderId + 1000, actual,
                    customerId, customerId, partyType, custodyStatus, customerId));
    }
}
