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
import com.sreyas.datamatics.application.seach.response.dto.AddressTypeSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulAddressTypeServices;

@ExtendWith(MockitoExtension.class)
class Story0087AddressTypeSearchUnitTest {
    @Mock ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, AddressTypeSearchResponseDto> addressTypeSearchService;
    @InjectMocks RestfulAddressTypeServices controller;

    @Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        AddressTypeSearchResponseDto expected = new AddressTypeSearchResponseDto();
        when(addressTypeSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        AddressTypeSearchResponseDto actual = controller.getAddressTypes("HOME");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(addressTypeSearchService).searchWithText(captor.capture(), isNull());
        assertEquals("HOME", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(addressTypeSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getAddressTypes("HOME"));
    }
}
