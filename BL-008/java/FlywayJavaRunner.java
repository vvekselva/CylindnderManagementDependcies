import java.nio.file.Path;
import java.util.Arrays;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationState;
import org.flywaydb.core.api.MigrationVersion;
import org.flywaydb.core.api.output.MigrateResult;
import org.flywaydb.core.api.output.ValidateResult;

/**
 * BL-008 governed Flyway Java API runner.
 *
 * Required runtime libraries (frozen policy):
 *   org.flywaydb:flyway-core:10.0.0
 *   org.flywaydb:flyway-database-postgresql:10.0.0
 *   org.postgresql:postgresql:42.7.2
 *
 * Required environment variables:
 *   DB_URL       JDBC PostgreSQL URL (runtime-only secret material; never persisted)
 *   DB_USER      PostgreSQL user
 *   DB_PASSWORD  PostgreSQL password
 *   MIGRATION_DIR absolute/local path containing the frozen migration files
 *
 * Usage modes:
 *   info
 *   validate
 *   migrate-one   (requires TARGET_VERSION, e.g. 1)
 *
 * Safety properties:
 *   - public schema only
 *   - clean disabled
 *   - no baseline-on-migrate
 *   - out-of-order disabled
 *   - migrate-one requires the requested version to be the first Flyway PENDING version
 *   - migrate-one configures Flyway target to that exact version
 *   - migrate-one fails unless exactly one migration was executed
 */
public final class FlywayJavaRunner {

    private FlywayJavaRunner() {}

    public static void main(String[] args) {
        if (args.length != 1) {
            fail("Expected exactly one mode: info | validate | migrate-one");
        }

        String mode = args[0].trim();
        String dbUrl = requiredEnv("DB_URL");
        String dbUser = requiredEnv("DB_USER");
        String dbPassword = requiredEnv("DB_PASSWORD");
        String migrationDir = requiredEnv("MIGRATION_DIR");

        // Normalize only the local migration path. Never print DB_URL or credentials.
        String location = "filesystem:" + Path.of(migrationDir).toAbsolutePath().normalize();

        Flyway base = Flyway.configure()
                .dataSource(dbUrl, dbUser, dbPassword)
                .locations(location)
                .schemas("public")
                .cleanDisabled(true)
                .baselineOnMigrate(false)
                .outOfOrder(false)
                .load();

        switch (mode) {
            case "info" -> printInfo(base);
            case "validate" -> validate(base);
            case "migrate-one" -> migrateOne(dbUrl, dbUser, dbPassword, location, base);
            default -> fail("Unsupported mode: " + mode);
        }
    }

    private static void printInfo(Flyway flyway) {
        MigrationInfo[] rows = flyway.info().all();
        System.out.println("FLYWAY_INFO_BEGIN");
        Arrays.stream(rows).forEach(FlywayJavaRunner::printMigration);
        System.out.println("FLYWAY_INFO_END");
    }

    private static void validate(Flyway flyway) {
        ValidateResult result = flyway.validateWithResult();
        System.out.println("FLYWAY_VALIDATE_SUCCESS=" + result.validationSuccessful);
        if (!result.validationSuccessful) {
            result.invalidMigrations.forEach(m ->
                    System.out.println("INVALID_MIGRATION=" + m.version + "|" + m.description + "|" + m.errorDetails));
            System.exit(2);
        }
    }

    private static void migrateOne(
            String dbUrl,
            String dbUser,
            String dbPassword,
            String location,
            Flyway preflightFlyway) {

        String targetVersionText = requiredEnv("TARGET_VERSION");
        MigrationVersion targetVersion = MigrationVersion.fromVersion(targetVersionText);

        MigrationInfo firstPending = Arrays.stream(preflightFlyway.info().all())
                .filter(m -> m.getState() == MigrationState.PENDING)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No Flyway PENDING migration exists"));

        if (firstPending.getVersion() == null || !firstPending.getVersion().equals(targetVersion)) {
            throw new IllegalStateException(
                    "Requested TARGET_VERSION=" + targetVersion
                    + " but first Flyway PENDING version is " + firstPending.getVersion());
        }

        ValidateResult validation = preflightFlyway.validateWithResult();
        if (!validation.validationSuccessful) {
            throw new IllegalStateException("Flyway validation failed; migrate-one is forbidden");
        }

        Flyway oneMigrationFlyway = Flyway.configure()
                .dataSource(dbUrl, dbUser, dbPassword)
                .locations(location)
                .schemas("public")
                .cleanDisabled(true)
                .baselineOnMigrate(false)
                .outOfOrder(false)
                .target(targetVersion)
                .load();

        MigrateResult result = oneMigrationFlyway.migrate();
        System.out.println("FLYWAY_MIGRATIONS_EXECUTED=" + result.migrationsExecuted);
        System.out.println("FLYWAY_TARGET_SCHEMA_VERSION=" + result.targetSchemaVersion);

        if (result.migrationsExecuted != 1) {
            throw new IllegalStateException(
                    "Governance violation: expected exactly one migration, executed " + result.migrationsExecuted);
        }

        MigrationInfo appliedTarget = Arrays.stream(oneMigrationFlyway.info().all())
                .filter(m -> targetVersion.equals(m.getVersion()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Applied target not visible in Flyway info after migrate"));

        if (appliedTarget.getState() != MigrationState.SUCCESS) {
            throw new IllegalStateException(
                    "Target version " + targetVersion + " is not SUCCESS after migrate: " + appliedTarget.getState());
        }

        System.out.println("FLYWAY_ONE_MIGRATION_VERIFIED=true");
        printMigration(appliedTarget);
    }

    private static void printMigration(MigrationInfo m) {
        System.out.println(
                "MIGRATION="
                + value(m.getVersion()) + "|"
                + value(m.getDescription()) + "|"
                + value(m.getScript()) + "|"
                + value(m.getChecksum()) + "|"
                + value(m.getState()));
    }

    private static String requiredEnv(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + name);
        }
        return value;
    }

    private static String value(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private static void fail(String message) {
        System.err.println(message);
        System.exit(64);
    }
}
