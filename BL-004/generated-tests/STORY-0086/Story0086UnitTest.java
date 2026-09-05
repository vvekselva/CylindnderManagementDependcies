import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.seach.response.dto.CustomerAddressSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulAddressServices;

class Story0086UnitTest {
    private RestfulAddressServices controller;
    private ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CustomerAddressSearchResponseDto> service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        controller = new RestfulAddressServices();
        service = mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "customerAddressFetchByIDService", service);
    }

    @Test
    void selectedCustomerId_isCopiedToSearchTerm_andServiceResponseReturned() throws Exception {
        CustomerAddressSearchResponseDto expected = new CustomerAddressSearchResponseDto();
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        CustomerAddressSearchResponseDto actual = controller.getCustomerAddressByCustomerId("77");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        verify(service).searchWithText(captor.capture(), isNull());
        assertEquals("77", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void blankCustomerId_doesNotInvokeService() {
        assertNull(controller.getCustomerAddressByCustomerId("   "));
        verifyNoInteractions(service);
    }

    @Test
    void governedServiceFailure_returnsEmptyResponse() throws Exception {
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
                .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCustomerAddressByCustomerId("77"));
    }

    private static void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }
}
