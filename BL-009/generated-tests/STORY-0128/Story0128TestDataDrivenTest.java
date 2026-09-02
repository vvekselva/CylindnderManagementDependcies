package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

/** Executable BL-009 mapping for approved STORY-0128. Not executed until faithful runtime exists. */
class Story0128TestDataDrivenTest {

    private LookupManagementController controller;
    private LookupDataCache cache;

    @BeforeEach
    void setup() throws Exception {
        controller = new LookupManagementController();
        cache = mock(LookupDataCache.class);
        when(cache.getAddressTypes()).thenReturn(Collections.emptyList());
        when(cache.getCountries()).thenReturn(Collections.emptyList());
        when(cache.getStates()).thenReturn(Collections.emptyList());
        when(cache.getCities()).thenReturn(Collections.emptyList());
        Field field = LookupManagementController.class.getDeclaredField("lookupDataCache");
        field.setAccessible(true);
        field.set(controller, cache);
    }

    @Test
    void tc012801AddressTypeRenderContract() {
        ModelAndView mav = controller.showLookupPage("addressType");
        assertEquals("final-version-1/LookupManagement", mav.getViewName());
        assertEquals("addressType", mav.getModel().get("activeTab"));
        assertSame(Collections.emptyList(), mav.getModel().get("addressTypes"));
        assertSame(Collections.emptyList(), mav.getModel().get("countries"));
        assertSame(Collections.emptyList(), mav.getModel().get("states"));
        assertSame(Collections.emptyList(), mav.getModel().get("cities"));
    }

    @Test
    void tc012802ExplicitCountryTabIsPreserved() {
        ModelAndView mav = controller.showLookupPage("country");
        assertEquals("country", mav.getModel().get("activeTab"));
        assertEquals("final-version-1/LookupManagement", mav.getViewName());
    }

    @Test
    void tc012804GetDoesNotRefreshCaches() {
        controller.showLookupPage("state");
        verify(cache, never()).refreshAddressTypes();
        verify(cache, never()).refreshCountries();
        verify(cache, never()).refreshStates();
        verify(cache, never()).refreshCities();
    }
}
