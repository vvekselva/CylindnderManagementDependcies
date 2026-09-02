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

import com.sreyas.datamatics.application.dto.CylinderDto;
import com.sreyas.datamatics.application.dto.DriverDto;
import com.sreyas.datamatics.application.dto.ProductCategoryDto;
import com.sreyas.datamatics.application.dto.ProductDto;
import com.sreyas.datamatics.application.dto.ProductUomDto;
import com.sreyas.datamatics.application.dto.VehicleDto;
import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;

class Story0108DomainLookupPageUnitTest {
    private DomainLookupController controller;
    private LookupDataCache cache;

    @BeforeEach void setup() {
        controller = new DomainLookupController();
        cache = mock(LookupDataCache.class);
        ReflectionTestUtils.setField(controller, "lookupDataCache", cache);
    }

    @Test void defaultTabContractRendersExpectedViewAndCachedCollections() {
        List<ProductCategoryDto> categories = List.of(new ProductCategoryDto());
        List<ProductUomDto> uoms = List.of(new ProductUomDto());
        List<VehicleDto> vehicles = List.of(new VehicleDto());
        List<DriverDto> drivers = List.of(new DriverDto());
        List<ProductDto> products = List.of(new ProductDto());
        List<CylinderDto> cylinders = List.of(new CylinderDto());
        when(cache.getProductCategories()).thenReturn(categories);
        when(cache.getProductUom()).thenReturn(uoms);
        when(cache.getVehicles()).thenReturn(vehicles);
        when(cache.getDrivers()).thenReturn(drivers);
        when(cache.getProduct()).thenReturn(products);
        when(cache.getCylinder()).thenReturn(cylinders);

        ModelAndView mav = controller.showDomainLookupPage("productCategory");

        assertEquals("final-version-1/DomainLookup", mav.getViewName());
        assertEquals("productCategory", mav.getModel().get("activeTab"));
        assertSame(categories, mav.getModel().get("productCategories"));
        assertSame(uoms, mav.getModel().get("productUoms"));
        assertSame(vehicles, mav.getModel().get("vehicles"));
        assertSame(drivers, mav.getModel().get("drivers"));
        assertSame(products, mav.getModel().get("products"));
        assertSame(cylinders, mav.getModel().get("cylinders"));
    }

    @Test void requestedTabIsPreserved() {
        when(cache.getProductCategories()).thenReturn(List.of());
        when(cache.getProductUom()).thenReturn(List.of());
        when(cache.getVehicles()).thenReturn(List.of());
        when(cache.getDrivers()).thenReturn(List.of());
        when(cache.getProduct()).thenReturn(List.of());
        when(cache.getCylinder()).thenReturn(List.of());
        assertEquals("driver", controller.showDomainLookupPage("driver").getModel().get("activeTab"));
    }
}
