import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.application.exception.CylinderManagementApplicationException;
import com.sreyas.datamatics.application.exception.InvalidInputParameterException;
import com.sreyas.datamatics.application.request.dto.WalkinSaleRequestDto;
import com.sreyas.datamatics.application.response.dto.WalkinSaleResponseDto;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService;
import com.sreyas.datamatics.cylindermanagement.misc.web.controller.WalkinSaleIngestionController;

class Story0033UnitTest {
    private WalkinSaleIngestionController controller;
    private ICylinderManagementApplicationService<WalkinSaleRequestDto, WalkinSaleResponseDto> service;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() throws Exception {
        controller = new WalkinSaleIngestionController();
        service = mock(ICylinderManagementApplicationService.class);
        Field f = WalkinSaleIngestionController.class.getDeclaredField("walkinSaleService");
        f.setAccessible(true);
        f.set(controller, service);
    }

    @Test
    void successfulSubmission_delegatesExactRequest_andRedirects() throws Exception {
        WalkinSaleRequestDto request = new WalkinSaleRequestDto();
        when(service.processRequest(same(request))).thenReturn(new WalkinSaleResponseDto());

        ModelAndView mav = controller.doPost(request);

        verify(service).processRequest(same(request));
        assertTrue(mav.getViewName().startsWith("redirect:"));
    }

    @Test
    void validationFailure_redisplaysFormWithControlledMessage() throws Exception {
        WalkinSaleRequestDto request = new WalkinSaleRequestDto();
        InvalidInputParameterException failure = mock(InvalidInputParameterException.class);
        when(service.processRequest(same(request))).thenThrow(failure);

        ModelAndView mav = controller.doPost(request);

        assertEquals("final-version-1/WalkinSaleIngestion", mav.getViewName());
        assertEquals("Walk-in sale validation failed. Please correct the highlighted details.", mav.getModel().get("errorMessage"));
    }

    @Test
    void governedApplicationFailure_redisplaysFormWithControlledMessage() throws Exception {
        WalkinSaleRequestDto request = new WalkinSaleRequestDto();
        when(service.processRequest(same(request))).thenThrow(mock(CylinderManagementApplicationException.class));

        ModelAndView mav = controller.doPost(request);

        assertEquals("final-version-1/WalkinSaleIngestion", mav.getViewName());
        assertEquals("Walk-in sale could not be processed. Please verify the challan and cylinder selection.", mav.getModel().get("errorMessage"));
    }
}
