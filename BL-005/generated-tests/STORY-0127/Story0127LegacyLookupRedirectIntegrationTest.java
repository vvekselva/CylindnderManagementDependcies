package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/**
 * MVC integration mapping for approved navigation-only STORY-0127.
 * PostgreSQL integration is not applicable because the approved method has no DAO/database boundary.
 */
class Story0127LegacyLookupRedirectIntegrationTest {

    @Test
    void mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new LookupManagementController()).build();

        mvc.perform(get("/lookup"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/lookupManagement"));
    }
}
