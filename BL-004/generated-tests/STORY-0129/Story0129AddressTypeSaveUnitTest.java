package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sreyas.datamatics.application.dto.AddressTypeIngestionRequestDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService;
import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0129AddressTypeSaveUnitTest {
    private LookupManagementController controller;
    private ICylinderManagementApplicationService<AddressTypeIngestionRequestDto, ?> service;
    private LookupDataCache cache;

    @SuppressWarnings("unchecked")
    @BeforeEach void setup() {
        controller = new LookupManagementController();
        service = mock(ICylinderManagementApplicationService.class);
        cache = mock(LookupDataCache.class);
        ReflectionTestUtils.setField(controller, "addressTypeIngestionService", service);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
    }

    @Test void createNormalizesDelegatesRefreshesAndRedirects() throws Exception {
        RedirectAttributes ra = mock(RedirectAttributes.class);
        ModelAndView mav = controller.saveAddressType(null, " home ", " residence ", ra);
        ArgumentCaptor<AddressTypeIngestionRequestDto> cap = ArgumentCaptor.forClass(AddressTypeIngestionRequestDto.class);
        verify(service).processRequest(cap.capture());
        assertEquals("HOME", cap.getValue().getAddressTypeDto().getAddressType());
        assertEquals("residence", cap.getValue().getAddressTypeDto().getDescription());
        verify(cache).refreshAddressTypes();
        assertEquals("redirect:/lookupManagement?tab=addressType", mav.getViewName());
    }
}
