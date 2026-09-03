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
import com.sreyas.datamatics.application.seach.response.dto.ProductSearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulProductServices;

@ExtendWith(MockitoExtension.class)
class Story0099TestDataDrivenTest {
    @Mock ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, ProductSearchResponseDto> productSearchService;
    @InjectMocks RestfulProductServices controller;

    @Test void tc0099_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        ProductSearchResponseDto expected = new ProductSearchResponseDto();
        when(productSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        ProductSearchResponseDto actual = controller.getProducts("Oxygen");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(productSearchService).searchWithText(captor.capture(), isNull());
        assertEquals("Oxygen", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void tc0099_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(productSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getProducts("Oxygen"));
    }
}
