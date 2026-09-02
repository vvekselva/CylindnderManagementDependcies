import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sreyas.datamatics.application.dto.CylinderManagementApplicationRequestDto;
import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.seach.response.dto.CitySearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulCityServices;

@ExtendWith(MockitoExtension.class)
class Story0089TestDataDrivenTest {

    @Mock
    ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CitySearchResponseDto> citySearchService;

    @InjectMocks
    RestfulCityServices controller;

    @Test
    void tc0089_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        CitySearchResponseDto expected = new CitySearchResponseDto();
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);

        CitySearchResponseDto actual = controller.getCities("Coimbatore");

        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(citySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("Coimbatore", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void tc0089_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenThrow(failure);
        assertNotNull(controller.getCities("Coimbatore"));
    }
}
