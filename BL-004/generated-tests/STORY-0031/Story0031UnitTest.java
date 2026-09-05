import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Pageable;

import com.sreyas.datamatics.application.dashboard.dto.OwnershipObligationDashboardDto;
import com.sreyas.datamatics.application.jpa.virtual.view.jap.dao.OwnershipObligationDetailJpaDao;
import com.sreyas.datamatics.application.jpa.virtual.view.jap.dao.OwnershipObligationPartySummaryJpaDao;
import com.sreyas.datamatics.cylinder.management.mapper.OwnershipObligationDashboardMapper;
import com.sreyas.datamatics.cylinder.management.services.OwnershipObligationDashboardService;

class Story0031UnitTest {
    private OwnershipObligationDetailJpaDao detailDao;
    private OwnershipObligationPartySummaryJpaDao summaryDao;
    private OwnershipObligationDashboardMapper mapper;
    private OwnershipObligationDashboardService service;

    @BeforeEach
    void setUp() {
        detailDao = mock(OwnershipObligationDetailJpaDao.class);
        summaryDao = mock(OwnershipObligationPartySummaryJpaDao.class);
        mapper = mock(OwnershipObligationDashboardMapper.class);
        service = new OwnershipObligationDashboardService(detailDao, summaryDao, mapper);
    }

    @Test
    void dashboard_usesGlobalKpis_limitsAndTrimmedDetailFilter() {
        when(detailDao.countByCustodyStatus("ACTIVE")).thenReturn(10L);
        when(detailDao.countByPartyTypeAndCustodyStatus("CUSTOMER", "ACTIVE")).thenReturn(6L);
        when(detailDao.countByPartyTypeAndCustodyStatus("SUPPLIER", "ACTIVE")).thenReturn(4L);
        when(detailDao.countAgingObligations()).thenReturn(3L);
        when(detailDao.countClosedTodayObligations()).thenReturn(2L);
        when(summaryDao.findTopPartySummaries(any(Pageable.class))).thenReturn(List.of());
        when(detailDao.findDashboardRows(eq("CUSTOMER"), eq("ACTIVE"), eq(77L), eq("Acme"), any(Pageable.class))).thenReturn(List.of());
        when(mapper.mapSummaryDosToDtos(anyList())).thenReturn(List.of());
        when(mapper.mapDetailDosToDtos(anyList())).thenReturn(List.of());

        OwnershipObligationDashboardDto dto = service.fetchDashboard("CUSTOMER", "ACTIVE", 77L, "  Acme  ");

        assertEquals(10L, dto.getTotalActiveObligations());
        assertEquals(6L, dto.getCustomerActiveObligations());
        assertEquals(4L, dto.getSupplierActiveObligations());
        assertEquals(3L, dto.getAgingObligations());
        assertEquals(2L, dto.getClosedTodayObligations());

        ArgumentCaptor<Pageable> summaryPage = ArgumentCaptor.forClass(Pageable.class);
        verify(summaryDao).findTopPartySummaries(summaryPage.capture());
        assertEquals(0, summaryPage.getValue().getPageNumber());
        assertEquals(50, summaryPage.getValue().getPageSize());

        ArgumentCaptor<Pageable> detailPage = ArgumentCaptor.forClass(Pageable.class);
        verify(detailDao).findDashboardRows(eq("CUSTOMER"), eq("ACTIVE"), eq(77L), eq("Acme"), detailPage.capture());
        assertEquals(0, detailPage.getValue().getPageNumber());
        assertEquals(200, detailPage.getValue().getPageSize());
    }
}
