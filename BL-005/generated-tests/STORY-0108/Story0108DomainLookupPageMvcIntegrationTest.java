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

class Story0108DomainLookupPageMvcIntegrationTest {
    private MockMvc mvc;
    private LookupDataCache cache;

    @BeforeEach void setup() {
        DomainLookupController controller = new DomainLookupController();
        cache = mock(LookupDataCache.class);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
        when(cache.getProductCategories()).thenReturn(List.of());
        when(cache.getProductUom()).thenReturn(List.of());
        when(cache.getVehicles()).thenReturn(List.of());
        when(cache.getDrivers()).thenReturn(List.of());
        when(cache.getProduct()).thenReturn(List.of());
        when(cache.getCylinder()).thenReturn(List.of());
        mvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test void getWithoutTabUsesProductCategoryDefault() throws Exception {
        mvc.perform(get("/domainLookup"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/DomainLookup"))
            .andExpect(model().attribute("activeTab", "productCategory"));
    }

    @Test void getWithTabPreservesRequestedTab() throws Exception {
        mvc.perform(get("/domainLookup").param("tab", "driver"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/DomainLookup"))
            .andExpect(model().attribute("activeTab", "driver"));
    }
}
