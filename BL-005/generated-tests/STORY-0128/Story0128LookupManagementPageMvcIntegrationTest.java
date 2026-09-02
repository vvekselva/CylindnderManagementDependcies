package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0128LookupManagementPageMvcIntegrationTest {
    private MockMvc mvc;
    private LookupDataCache cache;

    @BeforeEach void setup() {
        LookupManagementController controller = new LookupManagementController();
        cache = mock(LookupDataCache.class);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
        when(cache.getAddressTypes()).thenReturn(List.of());
        when(cache.getCountries()).thenReturn(List.of());
        when(cache.getStates()).thenReturn(List.of());
        when(cache.getCities()).thenReturn(List.of());
        mvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test void getWithoutTabUsesAddressTypeDefault() throws Exception {
        mvc.perform(get("/lookupManagement"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/LookupManagement"))
            .andExpect(model().attribute("activeTab", "addressType"));
    }

    @Test void getWithTabPreservesRequestedTab() throws Exception {
        mvc.perform(get("/lookupManagement").param("tab", "city"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/LookupManagement"))
            .andExpect(model().attribute("activeTab", "city"));
    }
}
