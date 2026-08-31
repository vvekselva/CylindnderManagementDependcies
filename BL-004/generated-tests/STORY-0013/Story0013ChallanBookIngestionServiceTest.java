package com.sreyas.datamatics.cylinder.management.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sreyas.datamatics.application.codes.CylinderManagementApplicationResponseCode;
import com.sreyas.datamatics.application.dto.ChallanBookRegistryDto;
import com.sreyas.datamatics.application.jpa.dao.ChallanBookRegistryJpaDao;
import com.sreyas.datamatics.application.jpa.entity.ChallanBookRegistryDo;
import com.sreyas.datamatics.application.request.dto.ChallanBookIngestionRequestDto;
import com.sreyas.datamatics.application.response.dto.ChallanBookIngestionResponseDto;
import com.sreyas.datamatics.cylinder.management.mapper.ChallanBookRegistryMapper;

/** Source-bound tests for approved STORY-0013 frozen at CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89. */
@ExtendWith(MockitoExtension.class)
class Story0013ChallanBookIngestionServiceTest {

    @Mock
    private ChallanBookRegistryJpaDao dao;

    @Mock
    private ChallanBookRegistryMapper mapper;

    @InjectMocks
    private ChallanBookIngestionService service;

    @Test
    @DisplayName("STORY-0013 UT-01 valid book is timestamped persisted and returned as SUCCESS")
    void validBookIsTimestampedPersistedAndReturnedAsSuccess() throws Exception {
        ChallanBookRegistryDto dto = book("BOOK-001", 1, 10);
        ChallanBookIngestionRequestDto request = request(dto);
        ChallanBookRegistryDo entity = new ChallanBookRegistryDo();
        ChallanBookRegistryDo saved = new ChallanBookRegistryDo();
        saved.setBookId(101L);
        ChallanBookRegistryDto savedDto = new ChallanBookRegistryDto();
        savedDto.setBookId(101L);

        when(mapper.mapDtoToDo(dto)).thenReturn(entity);
        when(dao.saveAndFlush(entity)).thenReturn(saved);
        when(mapper.mapDoToDto(saved)).thenReturn(savedDto);

        ChallanBookIngestionResponseDto response = service.processRequest(request);

        ArgumentCaptor<ChallanBookRegistryDo> persisted = ArgumentCaptor.forClass(ChallanBookRegistryDo.class);
        verify(dao, times(1)).saveAndFlush(persisted.capture());
        assertNotNull(persisted.getValue().getCreatedAt());
        assertNotNull(persisted.getValue().getUpdatedAt());
        assertEquals(CylinderManagementApplicationResponseCode.SUCCESS.ordinal(), response.getResponseCode());
        assertEquals(101L, response.getIngestedChallanBook().getBookId());
    }

    @Test
    @DisplayName("STORY-0013 UT-02 invalid sheet range still reaches save in frozen source")
    void invalidSheetRangeStillReachesSaveBecauseControlledThrowIsCommented() throws Exception {
        ChallanBookRegistryDto dto = book("RANGE-GAP", 50, 1);
        ChallanBookRegistryDo entity = new ChallanBookRegistryDo();
        ChallanBookRegistryDo saved = new ChallanBookRegistryDo();
        saved.setBookId(102L);

        when(mapper.mapDtoToDo(dto)).thenReturn(entity);
        when(dao.saveAndFlush(entity)).thenReturn(saved);
        when(mapper.mapDoToDto(saved)).thenReturn(dto);

        service.processRequest(request(dto));

        verify(dao, times(1)).saveAndFlush(entity);
    }

    @Test
    @DisplayName("STORY-0013 UT-03 null request exposes current null-guard defect")
    void nullRequestCurrentlyThrowsNullPointerException() {
        assertThrows(NullPointerException.class, () -> service.processRequest(null));
        verify(dao, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("STORY-0013 UT-04 service performs no duplicate-code precheck")
    void serviceDoesNotCallFindByBookCodeBeforeSave() throws Exception {
        ChallanBookRegistryDto dto = book("DUP-CHECK", 1, 5);
        ChallanBookRegistryDo entity = new ChallanBookRegistryDo();
        ChallanBookRegistryDo saved = new ChallanBookRegistryDo();
        saved.setBookId(103L);

        when(mapper.mapDtoToDo(dto)).thenReturn(entity);
        when(dao.saveAndFlush(entity)).thenReturn(saved);
        when(mapper.mapDoToDto(saved)).thenReturn(dto);

        service.processRequest(request(dto));

        verify(dao, never()).findByBookCode("DUP-CHECK");
        verify(dao, times(1)).saveAndFlush(entity);
    }

    @Test
    @DisplayName("STORY-0013 UT-05 service does not generate per-sheet ledger rows")
    void serviceDoesNotGeneratePerSheetLedgerRows() throws Exception {
        ChallanBookRegistryDto dto = book("NO-LEDGER", 1, 3);
        ChallanBookRegistryDo entity = new ChallanBookRegistryDo();
        ChallanBookRegistryDo saved = new ChallanBookRegistryDo();
        saved.setBookId(104L);

        when(mapper.mapDtoToDo(dto)).thenReturn(entity);
        when(dao.saveAndFlush(entity)).thenReturn(saved);
        when(mapper.mapDoToDto(saved)).thenReturn(dto);

        service.processRequest(request(dto));

        assertNotNull(entity.getPages());
        assertEquals(0, entity.getPages().size());
    }

    private static ChallanBookIngestionRequestDto request(ChallanBookRegistryDto dto) {
        ChallanBookIngestionRequestDto request = new ChallanBookIngestionRequestDto();
        request.setChallanBook(dto);
        return request;
    }

    private static ChallanBookRegistryDto book(String code, int start, int end) {
        ChallanBookRegistryDto dto = new ChallanBookRegistryDto();
        dto.setBookCode(code);
        dto.setStartSheetNumber(start);
        dto.setEndSheetNumber(end);
        return dto;
    }
}
