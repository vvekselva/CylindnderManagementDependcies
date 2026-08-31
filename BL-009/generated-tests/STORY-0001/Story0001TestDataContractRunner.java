package bl009.story0001;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dependency-free Java 21 substitution runner for the BL-009 STORY-0001
 * test-data CONTRACT only. This does not replace JUnit 5 application tests,
 * does not exercise the Cylinder application, and must never be treated as
 * application-behavior PASS or JaCoCo coverage evidence.
 */
public final class Story0001TestDataContractRunner {
    private static final String[] HEADER = {
        "data_id", "test_case", "username", "password", "preexisting_daily_login",
        "expected_authentication", "expected_daily_login_rows",
        "expected_visible_or_navigation_outcome", "data_classification"
    };

    private record Expected(
        String testCase,
        String preexisting,
        String authentication,
        String rows,
        String outcome,
        String classification) {}

    private static final Map<String, Expected> EXPECTED = Map.of(
        "TD-0001-01", new Expected("TC-0001-02", "NO", "CLIENT_BLOCKED", "0", "USERNAME_REQUIRED", "SYNTHETIC_NON_SECRET"),
        "TD-0001-02", new Expected("TC-0001-03", "NO", "CLIENT_BLOCKED", "0", "PASSWORD_REQUIRED", "SYNTHETIC_NON_SECRET"),
        "TD-0001-03", new Expected("TC-0001-05", "NO", "FAIL", "0", "INVALID_USERNAME_OR_PASSWORD", "SYNTHETIC_NON_SECRET"),
        "TD-0001-04", new Expected("TC-0001-06", "N/A", "N/A", "N/A", "LOGOUT_SUCCESS_MESSAGE", "SYNTHETIC_NON_SECRET"),
        "TD-0001-05", new Expected("TC-0001-07", "NO", "SUCCESS", "1", "/ownership-dashboard", "SYNTHETIC_ID_RUNTIME_SECRET_NOT_STORED"),
        "TD-0001-06", new Expected("TC-0001-08", "YES", "SUCCESS", "1", "/ownership-dashboard", "SYNTHETIC_ID_RUNTIME_SECRET_NOT_STORED"),
        "TD-0001-07", new Expected("TC-0001-09", "NO", "SUCCESS", "1", "GENERATED_ID_AND_NON_NULL_LOGIN_TIME", "SYNTHETIC_ID_RUNTIME_SECRET_NOT_STORED")
    );

    private Story0001TestDataContractRunner() {}

    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            throw new IllegalArgumentException("Usage: Story0001TestDataContractRunner <STORY-0001.csv>");
        }
        Path csv = Path.of(args[0]);
        List<String> lines = Files.readAllLines(csv);
        require(lines.size() == 8, "Expected one header plus seven governed rows; got " + lines.size());

        String[] header = split(lines.get(0));
        require(header.length == HEADER.length, "Unexpected header width");
        for (int i = 0; i < HEADER.length; i++) {
            require(HEADER[i].equals(header[i]), "Header mismatch at column " + i + ": " + header[i]);
        }

        List<String> seen = new ArrayList<>();
        for (int lineNo = 1; lineNo < lines.size(); lineNo++) {
            String[] c = split(lines.get(lineNo));
            require(c.length == HEADER.length, "Row width mismatch at CSV line " + (lineNo + 1));
            String id = c[0];
            Expected e = EXPECTED.get(id);
            require(e != null, "Unexpected data_id " + id);
            require(!seen.contains(id), "Duplicate data_id " + id);
            seen.add(id);

            require(e.testCase().equals(c[1]), id + " test_case mismatch");
            require(e.preexisting().equals(c[4]), id + " preexisting_daily_login mismatch");
            require(e.authentication().equals(c[5]), id + " expected_authentication mismatch");
            require(e.rows().equals(c[6]), id + " expected_daily_login_rows mismatch");
            require(e.outcome().equals(c[7]), id + " expected outcome mismatch");
            require(e.classification().equals(c[8]), id + " classification mismatch");
            require(!containsPersistedRealSecret(c[3]), id + " password field appears to persist a real secret");
            System.out.println("PASS " + id + " -> " + c[1]);
        }

        require(seen.size() == EXPECTED.size(), "Not all governed data IDs were consumed");
        System.out.println("PASS STORY-0001 BL-009 DATA_CONTRACT rows=" + seen.size());
    }

    private static String[] split(String line) {
        return line.split(",", -1);
    }

    private static boolean containsPersistedRealSecret(String password) {
        if (password.isEmpty() || "N/A".equals(password)) return false;
        if (password.startsWith("<") && password.endsWith(">")) return false;
        return password.toLowerCase().contains("prod") || password.toLowerCase().contains("token=") || password.toLowerCase().contains("password=");
    }

    private static void require(boolean condition, String message) throws IOException {
        if (!condition) throw new IOException("DATA_CONTRACT_FAIL: " + message);
    }
}
