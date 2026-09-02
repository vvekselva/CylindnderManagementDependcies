package com.sreyas.datamatics.cylindermanagement.misc.web.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.application.dto.AddressTypeDto;
import com.sreyas.datamatics.application.dto.CityDto;
import com.sreyas.datamatics.application.dto.CountryDto;
import com.sreyas.datamatics.application.dto.StateDto;
import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0128LookupManagementPageUnitTest {
    private LookupManagementController controller;
    private LookupDataCache cache;

    @BeforeEach void setup() {
        controller = new LookupManagementController();
        cache = mock(LookupDataCache.class);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
    }

    @Test void rendersExpectedViewAndCachedCollections() {
        List<AddressTypeDto> addressTypes = List.of(new AddressTypeDto());
        List<CountryDto> countries = List.of(new CountryDto());
        List<StateDto> states = List.of(new StateDto());
        List<CityDto> cities = List.of(new CityDto());
        when(cache.getAddressTypes()).thenReturn(addressTypes);
        when(cache.getCountries()).thenReturn(countries);
        when(cache.getStates()).thenReturn(states);
        when(cache.getCities()).thenReturn(cities);

        ModelAndView mav = controller.showLookupPage("addressType");

        assertEquals("final-version-1/LookupManagement", mav.getViewName());
        assertEquals("addressType", mav.getModel().get("activeTab"));
        assertSame(addressTypes, mav.getModel().get("addressTypes"));
        assertSame(countries, mav.getModel().get("countries"));
        assertSame(states, mav.getModel().get("states"));
        assertSame(cities, mav.getModel().get("cities"));
    }

    @Test void explicitTabIsPreserved() {
        when(cache.getAddressTypes()).thenReturn(List.of());
        when(cache.getCountries()).thenReturn(List.of());
        when(cache.getStates()).thenReturn(List.of());
        when(cache.getCities()).thenReturn(List.of());
        assertEquals("city", controller.showLookupPage("city").getModel().get("activeTab"));
    }
}
