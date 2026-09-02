package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

/** Executable BL-009 mapping for approved STORY-0127. Not executed until faithful runtime exists. */
class Story0127TestDataDrivenTest {

    @Test
    void tc012701LegacyLookupRedirect() {
        LookupManagementController controller = new LookupManagementController();
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
    }

    @Test
    void tc012702RepeatedInvocationIsPureNavigation() {
        LookupManagementController controller = new LookupManagementController();
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
    }
}
