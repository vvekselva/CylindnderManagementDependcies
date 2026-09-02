package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService;
import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0129AddressTypeSaveMvcIntegrationTest {
    private MockMvc mvc; private LookupDataCache cache;
    @BeforeEach void setup() {
        LookupManagementController c = new LookupManagementController();
        ReflectionTestUtils.setField(c, "addressTypeIngestionService", mock(ICylinderManagementApplicationService.class));
        cache = mock(LookupDataCache.class); ReflectionTestUtils.setField(c, "lookupDataCache", cache);
        mvc = MockMvcBuilders.standaloneSetup(c).build();
    }
    @Test void successfulPostUsesPrgAndRefreshesAddressTypeCache() throws Exception {
        mvc.perform(post("/lookupManagement/addressType/save").param("addressType", "home").param("description", "residence"))
            .andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=addressType"));
        verify(cache).refreshAddressTypes();
    }
}
