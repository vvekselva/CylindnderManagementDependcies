import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.jpa.dao.CylinderIdentifierJpaDao;
import com.sreyas.datamatics.application.jpa.dao.CylinderLogisticsExecutionLineJpaDao;
import com.sreyas.datamatics.application.jpa.entity.CylinderLogisticsExecutionLineDo;
import com.sreyas.datamatics.application.seach.response.dto.CylinderSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylinder.management.search.services.CylindersOnVehicleSearchServiceWithOwnershipModel;
import com.sreyas.datamatics.cylinder.management.services.util.CylinderSearchConstants;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulCylinderServices;

class Story0107CylindersOnVehicleUnitTest {

    @Test
    void controllerRoutesRequestToOwnershipVehicleServiceWithPaging() throws Exception {
        RestfulCylinderServices controller = new RestfulCylinderServices();
        @SuppressWarnings("unchecked")
        ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CylinderSearchResponseDto> service =
                mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "cylindersOnVehicleSearchServiceWithOwnershipModel", service);

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        request.setPageNumber(1);
        request.setItemsPerPage(50);
        CylinderSearchResponseDto expected = new CylinderSearchResponseDto();
        when(service.searchWithText(same(request), any(Pageable.class))).thenReturn(expected);

        CylinderSearchResponseDto actual = controller.getCylindersOnVehicle(request);

        var pageable = org.mockito.ArgumentCaptor.forClass(Pageable.class);
        verify(service).searchWithText(same(request), pageable.capture());
        assertEquals(0, pageable.getValue().getPageNumber());
        assertEquals(50, pageable.getValue().getPageSize());
        assertSame(expected, actual);
    }

    @Test
    void supplierStopDefaultsToEmptyOnVehicleStates() throws Exception {
        CylindersOnVehicleSearchServiceWithOwnershipModel service =
                new CylindersOnVehicleSearchServiceWithOwnershipModel();
        CylinderLogisticsExecutionLineJpaDao logisticsDao = mock(CylinderLogisticsExecutionLineJpaDao.class);
        inject(service, "cylinderLogisticsExecutionLineJpaDao", logisticsDao);
        inject(service, "cylinderIdentifierJpaDao", mock(CylinderIdentifierJpaDao.class));

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        Map<String, Object> query = new HashMap<>();
        query.put("VEHICLE_LOAD_ID", 77L);
        query.put("SUPPLIER_STOP", Boolean.TRUE);
        request.setSerachQueryData(query);
        Pageable pageable = PageRequest.of(0, 50);

        List<String> expectedStates = List.of("EMPTY_PICKED_FOR_REFILL", "EMPTY_IN_TRANSIT_TO_YARD");
        when(logisticsDao.findActiveVehicleContents(eq(77L), eq(expectedStates), isNull(), same(pageable)))
                .thenReturn(new PageImpl<CylinderLogisticsExecutionLineDo>(List.of(), pageable, 0));

        CylinderSearchResponseDto response = service.searchWithText(request, pageable);

        verify(logisticsDao).findActiveVehicleContents(eq(77L), eq(expectedStates), isNull(), same(pageable));
        assertNotNull(response);
        assertTrue(response.getCylinderDtos().isEmpty());
    }

    @Test
    void invalidRequestedStateFailsClosedBeforeQuery() throws Exception {
        CylindersOnVehicleSearchServiceWithOwnershipModel service =
                new CylindersOnVehicleSearchServiceWithOwnershipModel();
        CylinderLogisticsExecutionLineJpaDao logisticsDao = mock(CylinderLogisticsExecutionLineJpaDao.class);
        inject(service, "cylinderLogisticsExecutionLineJpaDao", logisticsDao);
        inject(service, "cylinderIdentifierJpaDao", mock(CylinderIdentifierJpaDao.class));

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        Map<String, Object> query = new HashMap<>();
        query.put("VEHICLE_LOAD_ID", 77L);
        query.put(CylinderSearchConstants.KEY_STATE, "BROKEN_STATE");
        request.setSerachQueryData(query);

        assertThrows(CylinderManagementApplicationException.class,
                () -> service.searchWithText(request, PageRequest.of(0, 50)));
        verifyNoInteractions(logisticsDao);
    }

    @Test
    void governedControllerFailureReturnsNonNullEmptyDto() throws Exception {
        RestfulCylinderServices controller = new RestfulCylinderServices();
        @SuppressWarnings("unchecked")
        ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CylinderSearchResponseDto> service =
                mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "cylindersOnVehicleSearchServiceWithOwnershipModel", service);

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        when(service.searchWithText(same(request), any(Pageable.class)))
                .thenThrow(mock(CylinderManagementApplicationException.class));

        assertNotNull(controller.getCylindersOnVehicle(request));
    }

    private static void inject(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
