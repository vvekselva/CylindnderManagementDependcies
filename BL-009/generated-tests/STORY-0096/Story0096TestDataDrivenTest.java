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
import com.sreyas.datamatics.application.jpa.dao.CustomerHeldCylinderSearchJpaDao;
import com.sreyas.datamatics.application.jpa.projection.entity.CustomerHeldCylinderProjectionDo;
import com.sreyas.datamatics.application.seach.response.dto.CylinderSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylinder.management.search.services.CylindersByCustomerSearchServiceWithOwnershipModel;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulCylinderServices;

class Story0096TestDataDrivenTest {

    @Test
    void tc0096_01_controllerRoutesRequestToOwnershipCustomerServiceWithPaging() throws Exception {
        RestfulCylinderServices controller = new RestfulCylinderServices();
        @SuppressWarnings("unchecked")
        ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CylinderSearchResponseDto> service =
                mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "customerSearchServiceWithOwnershipModel", service);

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        request.setPageNumber(1);
        request.setItemsPerPage(50);
        CylinderSearchResponseDto expected = new CylinderSearchResponseDto();
        when(service.searchWithText(same(request), any(Pageable.class))).thenReturn(expected);

        CylinderSearchResponseDto actual = controller.getCylindersByCustomer(request);

        var pageable = org.mockito.ArgumentCaptor.forClass(Pageable.class);
        verify(service).searchWithText(same(request), pageable.capture());
        assertEquals(0, pageable.getValue().getPageNumber());
        assertEquals(50, pageable.getValue().getPageSize());
        assertSame(expected, actual);
    }

    @Test
    void tc0096_02_serviceUsesCustomerIdAndNormalizesBlankSearchTerm() throws Exception {
        CylindersByCustomerSearchServiceWithOwnershipModel service =
                new CylindersByCustomerSearchServiceWithOwnershipModel();
        CustomerHeldCylinderSearchJpaDao dao = mock(CustomerHeldCylinderSearchJpaDao.class);
        inject(service, "customerHeldCylinderSearchJpaDao", dao);

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        Map<String, Object> query = new HashMap<>();
        query.put("CUSTOMER_ID", 42L);
        request.setSerachQueryData(query);
        request.setSearchTerm("   ");
        Pageable pageable = PageRequest.of(0, 50);

        when(dao.findActiveCustomerHeldCylinders(eq(42L), isNull(), same(pageable)))
                .thenReturn(new PageImpl<CustomerHeldCylinderProjectionDo>(List.of(), pageable, 0));

        CylinderSearchResponseDto response = service.searchWithText(request, pageable);

        verify(dao).findActiveCustomerHeldCylinders(eq(42L), isNull(), same(pageable));
        assertNotNull(response);
        assertTrue(response.getCylinderDtos().isEmpty());
    }

    @Test
    void tc0096_03_missingCustomerIdFailsClosed() throws Exception {
        CylindersByCustomerSearchServiceWithOwnershipModel service =
                new CylindersByCustomerSearchServiceWithOwnershipModel();
        inject(service, "customerHeldCylinderSearchJpaDao", mock(CustomerHeldCylinderSearchJpaDao.class));

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        request.setSerachQueryData(new HashMap<>());

        assertThrows(CylinderManagementApplicationException.class,
                () -> service.searchWithText(request, PageRequest.of(0, 50)));
    }

    @Test
    void tc0096_04_governedControllerFailureReturnsNonNullEmptyDto() throws Exception {
        RestfulCylinderServices controller = new RestfulCylinderServices();
        @SuppressWarnings("unchecked")
        ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CylinderSearchResponseDto> service =
                mock(ICylinderManagementApplicationSearchService.class);
        inject(controller, "customerSearchServiceWithOwnershipModel", service);

        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        when(service.searchWithText(same(request), any(Pageable.class)))
                .thenThrow(mock(CylinderManagementApplicationException.class));

        assertNotNull(controller.getCylindersByCustomer(request));
    }

    private static void inject(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
