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
import com.sreyas.datamatics.application.seach.response.dto.ProductCategorySearchResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationSearchService;
import com.sreyas.datamatics.cylindermanagement.web.rest.RestfulProductCategoryServices;

@ExtendWith(MockitoExtension.class)
class Story0098TestDataDrivenTest {
    @Mock ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, ProductCategorySearchResponseDto> productCategorySearchService;
    @InjectMocks RestfulProductCategoryServices controller;

    @Test void tc0098_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        ProductCategorySearchResponseDto expected = new ProductCategorySearchResponseDto();
        when(productCategorySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        ProductCategorySearchResponseDto actual = controller.getProductCategories("Industrial");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(productCategorySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("Industrial", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void tc0098_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(productCategorySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getProductCategories("Industrial"));
    }
}
