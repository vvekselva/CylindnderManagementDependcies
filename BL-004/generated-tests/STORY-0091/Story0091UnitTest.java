import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.seach.response.dto.CustomerSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulCustomerServices;

class Story0091UnitTest {
    private RestfulCustomerServices controller;
    private ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CustomerSearchResponseDto> service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        controller = new RestfulCustomerServices();
        service = mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "customerSearchService", service);
    }

    @Test
    void searchText_isCopiedExactly_andServiceResponseReturned() throws Exception {
        CustomerSearchResponseDto expected = new CustomerSearchResponseDto();
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        CustomerSearchResponseDto actual = controller.getCustomers("Acme");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        verify(service).searchWithText(captor.capture(), isNull());
        assertEquals("Acme", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void governedFailure_returnsNonNullEmptyDto() throws Exception {
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
                .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCustomers("Acme"));
    }

    private static void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }
}
