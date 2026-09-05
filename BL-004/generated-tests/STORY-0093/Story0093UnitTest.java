import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.request.dto.DriverFetchByIdRequestDto;
import com.sreyas.datamatics.application.response.dto.DriverFetchByIdResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulDriverServices;

class Story0093UnitTest {
    private RestfulDriverServices controller;
    private ICylinderManagementApplicationService<DriverFetchByIdRequestDto, DriverFetchByIdResponseDto> service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        controller = new RestfulDriverServices();
        service = mock(ICylinderManagementApplicationService.class);
        inject(controller, "driverFetchByIdService", service);
    }

    @Test
    void persistentDriverId_isDelegatedExactly() throws Exception {
        DriverFetchByIdResponseDto expected = new DriverFetchByIdResponseDto();
        when(service.processRequest(any(DriverFetchByIdRequestDto.class))).thenReturn(expected);
        DriverFetchByIdResponseDto actual = controller.getDriverById(91L);
        ArgumentCaptor<DriverFetchByIdRequestDto> captor = ArgumentCaptor.forClass(DriverFetchByIdRequestDto.class);
        verify(service).processRequest(captor.capture());
        assertEquals(91L, captor.getValue().getDriverId());
        assertSame(expected, actual);
    }

    @Test
    void governedFailure_returnsNonNullEmptyDto() throws Exception {
        when(service.processRequest(any(DriverFetchByIdRequestDto.class)))
                .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getDriverById(91L));
    }

    private static void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }
}
