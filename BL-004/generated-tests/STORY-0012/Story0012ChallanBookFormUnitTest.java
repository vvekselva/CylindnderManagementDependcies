package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.application.dto.SummaryMetricLookupDto;
import com.sreyas.datamatics.cylinder.management.services.ChallanBookIngestionService;
import com.sreyas.datamatics.cylinder.management.services.SummaryMetricLookupFetchService;

/**
 * Source-bound JUnit 5 unit tests for approved BL-002 STORY-0012.
 * Governed source package SHA-256:
 * 60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2.
 */
@ExtendWith(MockitoExtension.class)
class Story0012ChallanBookFormUnitTest {

    @Mock
    private ChallanBookIngestionService challanBookIngestionService;

    @Mock
    private SummaryMetricLookupFetchService summaryMetricLookupFetchService;

    @InjectMocks
    private ChallanBookWebController controller;

    @Test
    @DisplayName("STORY-0012 UT-01 GET renders Challan Book form with blank request and all metric groups")
    void getRendersFormAndMetricGroups() {
        SummaryMetricLookupDto total = new SummaryMetricLookupDto();
        SummaryMetricLookupDto active = new SummaryMetricLookupDto();
        SummaryMetricLookupDto unused = new SummaryMetricLookupDto();
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics()).thenReturn(List.of(total));
        when(summaryMetricLookupFetchService.fetchChallanBookActiveMetrics()).thenReturn(List.of(active));
        when(summaryMetricLookupFetchService.fetchChallanBookUnusedPageMetrics()).thenReturn(List.of(unused));

        ModelAndView result = controller.showAddBookForm();

        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        assertEquals(List.of(total), result.getModel().get("challanBookTotalMetrics"));
        assertEquals(List.of(active), result.getModel().get("challanBookActiveMetrics"));
        assertEquals(List.of(unused), result.getModel().get("challanBookUnusedMetrics"));
    }

    @Test
    @DisplayName("STORY-0012 UT-02 metric failure does not turn the read-only GET into a write or failed page")
    void metricFailureRendersEmptyMetricGroupsAndVisibleErrorModel() {
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics())
                .thenThrow(new RuntimeException("metric store unavailable"));

        ModelAndView result = controller.showAddBookForm();

        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        assertTrue(((List<?>) result.getModel().get("challanBookTotalMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookActiveMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookUnusedMetrics")).isEmpty());
        assertEquals("Summary metrics are temporarily unavailable.",
                result.getModel().get("summaryMetricErrorMessage"));
    }
}
