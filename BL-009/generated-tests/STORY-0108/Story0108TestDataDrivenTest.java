package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0108TestDataDrivenTest {
    private DomainLookupController controller;
    private LookupDataCache cache;

    @BeforeEach void setup() {
        controller = new DomainLookupController();
        cache = mock(LookupDataCache.class);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
        when(cache.getProductCategories()).thenReturn(List.of());
        when(cache.getProductUom()).thenReturn(List.of());
        when(cache.getVehicles()).thenReturn(List.of());
        when(cache.getDrivers()).thenReturn(List.of());
        when(cache.getProduct()).thenReturn(List.of());
        when(cache.getCylinder()).thenReturn(List.of());
    }

    static Stream<Arguments> tabs() {
        return Stream.of(
            Arguments.of("productCategory"),
            Arguments.of("vehicle"),
            Arguments.of("driver"),
            Arguments.of("cylinder"));
    }

    @ParameterizedTest @MethodSource("tabs")
    void pageRendersApprovedViewAndPreservesTab(String tab) {
        ModelAndView mav = controller.showDomainLookupPage(tab);
        assertEquals("final-version-1/DomainLookup", mav.getViewName());
        assertEquals(tab, mav.getModel().get("activeTab"));
        assertSame(cache.getProductCategories(), mav.getModel().get("productCategories"));
    }
}
