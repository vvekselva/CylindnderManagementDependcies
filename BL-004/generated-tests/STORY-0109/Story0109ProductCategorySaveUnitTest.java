package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sreyas.datamatics.application.request.dto.ProductCategoryIngestionRequestDto;
import com.sreyas.datamatics.application.response.dto.ProductCategoryIngestionResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService;
import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0109ProductCategorySaveUnitTest {
    private DomainLookupController controller;
    private ICylinderManagementApplicationService<ProductCategoryIngestionRequestDto, ProductCategoryIngestionResponseDto> service;
    private LookupDataCache cache;
    private RedirectAttributes redirect;

    @SuppressWarnings("unchecked")
    @BeforeEach void setup() {
        controller = new DomainLookupController();
        service = mock(ICylinderManagementApplicationService.class);
        cache = mock(LookupDataCache.class);
        redirect = mock(RedirectAttributes.class);
        ReflectionTestUtils.setField(controller, "productCategoryIngestionService", service);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
    }

    @Test void addNormalizesInputDelegatesRefreshesAndRedirects() throws Exception {
        when(service.processRequest(any(ProductCategoryIngestionRequestDto.class))).thenReturn(new ProductCategoryIngestionResponseDto());
        ModelAndView mav = controller.saveProductCategory(null, "  industrial  ", "  desc  ", redirect);
        ArgumentCaptor<ProductCategoryIngestionRequestDto> cap = ArgumentCaptor.forClass(ProductCategoryIngestionRequestDto.class);
        verify(service).processRequest(cap.capture());
        assertEquals("INDUSTRIAL", cap.getValue().getProductCategoryDto().getProductCategory());
        assertEquals("desc", cap.getValue().getProductCategoryDto().getDescription());
        verify(cache).refreshProductCategory();
        assertEquals("redirect:/domainLookup?tab=productCategory", mav.getViewName());
    }
}
