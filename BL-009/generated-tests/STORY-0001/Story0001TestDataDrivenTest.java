package generated.bl009.story0001;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/**
 * BL-009 executable test-data contract for approved STORY-0001.
 *
 * This generated JUnit 5 class consumes the same STORY-0001.csv rows used by the
 * human-readable BL-009 catalogue. It provides executable validation of the test-data
 * contract and is the dispatch point for binding each row to the corresponding
 * BL-004 unit, BL-005 integration, or authorized runtime test.
 *
 * IMPORTANT: Data-contract PASS is not application-behaviour PASS. Application
 * behaviour is PASS only after the row is executed against the exact frozen-source
 * bound test implementation and durable evidence is recorded.
 */
class Story0001TestDataDrivenTest {

    private static final String RESOURCE = "/BL-009/test-data/STORY-0001.csv";

    record TestRow(
            String dataId,
            String testCase,
            String username,
            String password,
            String preexistingDailyLogin,
            String expectedAuthentication,
            String expectedDailyLoginRows,
            String expectedOutcome,
            String classification) {
    }

    static Stream<TestRow> story0001Rows() throws IOException {
        return readRows().stream();
    }

    @Test
    @DisplayName("STORY-0001 test-data file contains the seven governed executable rows")
    void shouldContainGovernedRows() throws IOException {
        List<TestRow> rows = readRows();
        assertEquals(7, rows.size());
        assertEquals("TD-0001-01", rows.get(0).dataId());
        assertEquals("TD-0001-07", rows.get(rows.size() - 1).dataId());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    @DisplayName("Every BL-009 row has traceable test-case identity and expected outcome")
    void shouldHaveTraceableExecutableContract(TestRow row) {
        assertTrue(row.dataId().startsWith("TD-0001-"));
        assertTrue(row.testCase().startsWith("TC-0001-"));
        assertFalse(row.expectedOutcome().isBlank());
        assertFalse(row.classification().isBlank());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    @DisplayName("Persisted test data never contains a real runtime secret")
    void shouldNotPersistRealRuntimeSecrets(TestRow row) {
        assertNotNull(row.password());
        if (row.expectedAuthentication().equals("SUCCESS")) {
            assertEquals("<RUNTIME_AUTHORIZED_TEST_SECRET>", row.password());
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    @DisplayName("Client-blocked rows expect no authentication and no daily-login write")
    void shouldModelClientBlockedRowsCorrectly(TestRow row) {
        if (row.expectedAuthentication().equals("CLIENT_BLOCKED")) {
            assertEquals("0", row.expectedDailyLoginRows());
            assertTrue(row.username().isBlank() || row.password().isBlank());
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    @DisplayName("Invalid authentication rows expect no daily-login write")
    void shouldModelFailedAuthenticationCorrectly(TestRow row) {
        if (row.expectedAuthentication().equals("FAIL")) {
            assertEquals("0", row.expectedDailyLoginRows());
            assertEquals("INVALID_USERNAME_OR_PASSWORD", row.expectedOutcome());
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    @DisplayName("Successful authentication rows are ready for bound runtime execution")
    void shouldModelSuccessfulAuthenticationRowsCorrectly(TestRow row) {
        if (row.expectedAuthentication().equals("SUCCESS")) {
            assertEquals("1", row.expectedDailyLoginRows());
            assertTrue(row.expectedOutcome().equals("/ownership-dashboard")
                    || row.expectedOutcome().equals("GENERATED_ID_AND_NON_NULL_LOGIN_TIME"));
        }
    }

    private static List<TestRow> readRows() throws IOException {
        InputStream in = Story0001TestDataDrivenTest.class.getResourceAsStream(RESOURCE);
        assertNotNull(in, "Stage " + RESOURCE + " onto the test classpath before execution");

        List<TestRow> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String header = reader.readLine();
            assertNotNull(header);
            assertTrue(header.startsWith("data_id,test_case,username,password"));

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) {
                    continue;
                }
                String[] values = line.split(",", -1);
                assertEquals(9, values.length, "Unexpected column count for: " + line);
                rows.add(new TestRow(values[0], values[1], values[2], values[3], values[4],
                        values[5], values[6], values[7], values[8]));
            }
        }
        return rows;
    }
}
