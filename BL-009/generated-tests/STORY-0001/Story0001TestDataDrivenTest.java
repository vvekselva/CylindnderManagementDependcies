package generated.bl009.story0001;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

/**
 * BL-009 executable test-data mapping for reapproved STORY-0001.
 * Reads the canonical BL-009 CSV directly. Data-contract execution is not
 * application-behavior PASS evidence.
 */
class Story0001TestDataDrivenTest {

    private static final Path CSV = Path.of("BL-009", "test-data", "STORY-0001.csv");

    record TestRow(String dataId, String testCase, String username, String password,
            String preexistingDailyLogin, String expectedAuthentication,
            String expectedDailyLoginRows, String expectedOutcome, String classification) {
    }

    static Stream<TestRow> story0001Rows() throws IOException {
        return readRows().stream();
    }

    @Test
    @DisplayName("STORY-0001 has seven governed data rows")
    void shouldContainGovernedRows() throws IOException {
        List<TestRow> rows = readRows();
        assertEquals(7, rows.size());
        assertEquals("TD-0001-01", rows.get(0).dataId());
        assertEquals("TD-0001-07", rows.get(rows.size() - 1).dataId());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    void everyRowHasTraceableCaseAndExpectedOutcome(TestRow row) {
        assertTrue(row.dataId().startsWith("TD-0001-"));
        assertTrue(row.testCase().startsWith("TC-0001-"));
        assertFalse(row.expectedOutcome().isBlank());
        assertFalse(row.classification().isBlank());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    void successfulRowsDoNotPersistRealRuntimeSecrets(TestRow row) {
        assertNotNull(row.password());
        if (row.expectedAuthentication().equals("SUCCESS")) {
            assertEquals("<RUNTIME_AUTHORIZED_TEST_SECRET>", row.password());
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    void clientBlockedRowsExpectNoDailyLoginWrite(TestRow row) {
        if (row.expectedAuthentication().equals("CLIENT_BLOCKED")) {
            assertEquals("0", row.expectedDailyLoginRows());
            assertTrue(row.username().isBlank() || row.password().isBlank());
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    void failedAuthenticationRowsExpectNoDailyLoginWrite(TestRow row) {
        if (row.expectedAuthentication().equals("FAIL")) {
            assertEquals("0", row.expectedDailyLoginRows());
            assertEquals("INVALID_USERNAME_OR_PASSWORD", row.expectedOutcome());
        }
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("story0001Rows")
    void successfulRowsMatchReapprovedBusinessOutcomes(TestRow row) {
        if (row.expectedAuthentication().equals("SUCCESS")) {
            assertEquals("1", row.expectedDailyLoginRows());
            assertTrue(row.expectedOutcome().equals("/ownership-dashboard")
                    || row.expectedOutcome().equals("GENERATED_ID_AND_NON_NULL_LOGIN_TIME"));
        }
    }

    private static List<TestRow> readRows() throws IOException {
        try (Stream<String> lines = Files.lines(CSV)) {
            return lines.skip(1)
                    .filter(line -> !line.isBlank())
                    .map(line -> line.split(",", -1))
                    .map(values -> {
                        assertEquals(9, values.length, "Unexpected column count");
                        return new TestRow(values[0], values[1], values[2], values[3], values[4],
                                values[5], values[6], values[7], values[8]);
                    })
                    .toList();
        }
    }
}
