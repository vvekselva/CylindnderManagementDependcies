import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.seach.response.dto.ChallanTypeSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulChallanTypeServices;

class Story0088UnitTest {
    private RestfulChallanTypeServices controller;
    private ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, ChallanTypeSearchResponseDto> service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        controller = new RestfulChallanTypeServices();
        service = mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "challanTypeSearchService", service);
    }

    @Test
    void exactSearchText_isDelegated_andResponseReturned() throws Exception {
        ChallanTypeSearchResponseDto expected = new ChallanTypeSearchResponseDto();
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        ChallanTypeSearchResponseDto actual = controller.getChallanTypes("DELIVERY");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        verify(service).searchWithText(captor.capture(), isNull());
        assertEquals("DELIVERY", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void governedFailure_returnsNonNullEmptyDto() throws Exception {
        when(service.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
                .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getChallanTypes("DELIVERY"));
    }

    private static void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }
}
