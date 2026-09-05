import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.application.request.dto.WalkinSaleRequestDto;
import com.sreyas.datamatics.cylindermanagement.misc.web.controller.WalkinSaleIngestionController;

class Story0032UnitTest {
    @Test
    void getWalkinSale_initializesRequiredNestedRequest_andDoesNotProcessTransaction() {
        WalkinSaleIngestionController controller = new WalkinSaleIngestionController();

        ModelAndView mav = controller.doGet();

        assertEquals("final-version-1/WalkinSaleIngestion", mav.getViewName());
        assertTrue(mav.getModel().containsKey("backLink"));
        WalkinSaleRequestDto request = (WalkinSaleRequestDto) mav.getModel().get("walkinSale");
        assertNotNull(request);
        assertNotNull(request.getCustomer());
        assertNotNull(request.getCustomerAddress());
        assertNotNull(request.getChallanLeaf());
        assertEquals("DELIVERY", request.getChallanLeaf().getChallanType());
    }
}
