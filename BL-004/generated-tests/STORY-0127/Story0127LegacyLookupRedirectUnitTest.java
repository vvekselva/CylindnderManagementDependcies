package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Source-bound JUnit 5 unit test for approved BL-002 STORY-0127.
 * Governed source package SHA-256:
 * 60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2.
 */
class Story0127LegacyLookupRedirectUnitTest {

    @Test
    @DisplayName("STORY-0127 UT-01 legacy lookup route returns exact current Lookup Management redirect")
    void legacyLookupReturnsExactRedirect() {
        LookupManagementController controller = new LookupManagementController();

        String result = controller.legacyRedirect();

        assertEquals("redirect:/lookupManagement", result);
    }
}
