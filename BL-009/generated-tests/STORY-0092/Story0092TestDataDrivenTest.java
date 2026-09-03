import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.seach.response.dto.DriverSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulDriverServices;

@ExtendWith(MockitoExtension.class)
class Story0092TestDataDrivenTest {
    @Mock ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, DriverSearchResponseDto> driverSearchService;
    @InjectMocks RestfulDriverServices controller;

    @Test void tc0092_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        DriverSearchResponseDto expected = new DriverSearchResponseDto();
        when(driverSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), any(Pageable.class))).thenReturn(expected);
        DriverSearchResponseDto actual = controller.getDrivers("Ravi");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(driverSearchService).searchWithText(captor.capture(), any(Pageable.class));
        assertEquals("Ravi", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void tc0092_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(driverSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), any(Pageable.class)))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getDrivers("Ravi"));
    }
}
