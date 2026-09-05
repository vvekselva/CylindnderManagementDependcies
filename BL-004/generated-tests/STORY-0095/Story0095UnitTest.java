import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.seach.response.dto.CylinderSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulCylinderServices;

class Story0095UnitTest {
    private RestfulCylinderServices controller;
    private ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CylinderSearchResponseDto> service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        controller = new RestfulCylinderServices();
        service = mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "cylinderCurrentOwnershipBySerialAndStateSearchService", service);
    }

    @Test
    void requestAndPaging_areDelegatedToOwnershipSerialStateService() throws Exception {
        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        request.setSearchTerm("CYL-100");
        request.setPageNumber(2);
        request.setItemsPerPage(25);
        CylinderSearchResponseDto expected = new CylinderSearchResponseDto();
        when(service.searchWithText(same(request), any(Pageable.class))).thenReturn(expected);

        CylinderSearchResponseDto actual = controller.getCylinderBySerialAndState(request);

        var pageableCaptor = org.mockito.ArgumentCaptor.forClass(Pageable.class);
        verify(service).searchWithText(same(request), pageableCaptor.capture());
        assertEquals(1, pageableCaptor.getValue().getPageNumber());
        assertEquals(25, pageableCaptor.getValue().getPageSize());
        assertSame(expected, actual);
    }

    @Test
    void governedFailure_returnsNonNullEmptyDto() throws Exception {
        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        when(service.searchWithText(same(request), any(Pageable.class)))
                .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCylinderBySerialAndState(request));
    }

    private static void inject(Object target, String field, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(target, value);
    }
}
