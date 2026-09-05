import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.seach.response.dto.CylinderSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulCylinderServices;

class Story0094UnitTest {
    private RestfulCylinderServices controller;
    private ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CylinderSearchResponseDto> service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        controller = new RestfulCylinderServices();
        service = mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "cylinderSerachServiceWithOwnershipModel", service);
    }

    @Test
    void globalSearch_routesToOwnershipModelService() throws Exception {
        CylinderSearchResponseDto expected = new CylinderSearchResponseDto();
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        CylinderSearchResponseDto actual = controller.getCylinders("CYL-100");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        verify(service).searchWithText(captor.capture(), isNull());
        assertEquals("CYL-100", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void governedFailure_returnsNonNullEmptyDto() throws Exception {
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
                .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCylinders("CYL-100"));
    }

    private static void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }
}
