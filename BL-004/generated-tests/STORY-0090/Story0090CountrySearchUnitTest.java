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
import com.sreyas.datamatics.application.seach.response.dto.CountrySearchResponsesDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulCountryServices;

@ExtendWith(MockitoExtension.class)
class Story0090CountrySearchUnitTest {
    @Mock ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CountrySearchResponsesDto> countrySearchService;
    @InjectMocks RestfulCountryServices controller;

    @Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        CountrySearchResponsesDto expected = new CountrySearchResponsesDto();
        when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        CountrySearchResponsesDto actual = controller.getCountries("India");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(countrySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("India", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCountries("India"));
    }
}
