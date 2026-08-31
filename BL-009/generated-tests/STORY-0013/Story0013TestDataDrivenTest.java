package com.sreyas.datamatics.cylinder.management.bl009.story0013;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;

/**
 * BL-009 executable mapping for STORY-0013.
 * Generated source is not execution PASS evidence.
 */
class Story0013TestDataDrivenTest {

    @ParameterizedTest(name = "{1} - {0}")
    @CsvFileSource(resources = "/bl009/STORY-0013.csv", numLinesToSkip = 1)
    void everyApprovedCatalogueCaseHasExecutableMapping(
            String dataId,
            String testCaseId,
            String bookType,
            String bookCode,
            String seriesPrefix,
            String startSheet,
            String endSheet,
            String currentLocation,
            String expectedCurrentSource) {

        assertNotNull(dataId);
        assertNotNull(testCaseId);
        assertNotNull(expectedCurrentSource);

        switch (testCaseId) {
            case "TC-0013-01" -> assertEquals("SAVE_SUCCESS", expectedCurrentSource);
            case "TC-0013-02" -> assertEquals("SAVE_SUCCESS_OPTIONAL_PREFIX", expectedCurrentSource);
            case "TC-0013-03" -> assertEquals("CURRENT_GAP_NULL_GUARD_NOT_CONTROLLED", expectedCurrentSource);
            case "TC-0013-04" -> assertEquals("CURRENT_GAP_RANGE_THROW_COMMENTED", expectedCurrentSource);
            case "TC-0013-05" -> assertEquals("DB_UNIQUE_EFFECTIVE_GUARD_NO_SERVICE_PRECHECK", expectedCurrentSource);
            case "TC-0013-06" -> assertEquals("TIMESTAMPS_ASSIGNED", expectedCurrentSource);
            case "TC-0013-07" -> assertEquals("TBL_CHALLAN_BOOK_REGISTRY_IDENTITY", expectedCurrentSource);
            case "TC-0013-08" -> assertEquals("NO_PER_SHEET_LEDGER_GENERATION", expectedCurrentSource);
            case "TC-0013-09" -> assertEquals("CONTROLLER_SUCCESS_REDIRECT", expectedCurrentSource);
            case "TC-0013-10" -> assertEquals("CONTROLLER_APPLICATION_EXCEPTION_REDISPLAY", expectedCurrentSource);
            default -> throw new AssertionError("Unmapped BL-009 case: " + testCaseId);
        }
    }
}
