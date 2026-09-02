package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.sreyas.datamatics.application.request.dto.ProductCategoryIngestionRequestDto;
import com.sreyas.datamatics.application.response.dto.ProductCategoryIngestionResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService;
import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0109ProductCategorySaveMvcIntegrationTest {
    private MockMvc mvc;
    private LookupDataCache cache;

    @SuppressWarnings("unchecked")
    @BeforeEach void setup() throws Exception {
        DomainLookupController controller = new DomainLookupController();
        ICylinderManagementApplicationService<ProductCategoryIngestionRequestDto, ProductCategoryIngestionResponseDto> service = mock(ICylinderManagementApplicationService.class);
        cache = mock(LookupDataCache.class);
        when(service.processRequest(any(ProductCategoryIngestionRequestDto.class))).thenReturn(new ProductCategoryIngestionResponseDto());
        ReflectionTestUtils.setField(controller, "productCategoryIngestionService", service);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
        mvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test void successfulPostUsesPrgAndRefreshesOnlyCategoryCache() throws Exception {
        mvc.perform(post("/domainLookup/productCategory/save").param("productCategory", "industrial").param("description", "desc"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl("/domainLookup?tab=productCategory"));
        verify(cache).refreshProductCategory();
    }
}
