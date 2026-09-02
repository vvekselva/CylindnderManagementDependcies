package com.sreyas.datamatics.cylindermanagement.web.controller.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.ModelAndView;

import com.sreyas.datamatics.application.dto.SummaryMetricLookupDto;
import com.sreyas.datamatics.cylinder.management.services.ChallanBookIngestionService;
import com.sreyas.datamatics.cylinder.management.services.SummaryMetricLookupFetchService;

/** Executable BL-009 mapping for approved STORY-0012. Not executed until faithful runtime exists. */
@ExtendWith(MockitoExtension.class)
class Story0012TestDataDrivenTest {

    @Mock ChallanBookIngestionService challanBookIngestionService;
    @Mock SummaryMetricLookupFetchService summaryMetricLookupFetchService;
    @InjectMocks ChallanBookWebController controller;

    @Test
    void tc001201FormAndMetrics() {
        SummaryMetricLookupDto metric = new SummaryMetricLookupDto();
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics()).thenReturn(List.of(metric));
        when(summaryMetricLookupFetchService.fetchChallanBookActiveMetrics()).thenReturn(List.of(metric));
        when(summaryMetricLookupFetchService.fetchChallanBookUnusedPageMetrics()).thenReturn(List.of(metric));
        ModelAndView result = controller.showAddBookForm();
        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        assertEquals(1, ((List<?>) result.getModel().get("challanBookTotalMetrics")).size());
        assertEquals(1, ((List<?>) result.getModel().get("challanBookActiveMetrics")).size());
        assertEquals(1, ((List<?>) result.getModel().get("challanBookUnusedMetrics")).size());
    }

    @Test
    void tc001202MetricFailureFallback() {
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics()).thenThrow(new RuntimeException("unavailable"));
        ModelAndView result = controller.showAddBookForm();
        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertTrue(((List<?>) result.getModel().get("challanBookTotalMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookActiveMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookUnusedMetrics")).isEmpty());
        assertEquals("Summary metrics are temporarily unavailable.", result.getModel().get("summaryMetricErrorMessage"));
    }
}
