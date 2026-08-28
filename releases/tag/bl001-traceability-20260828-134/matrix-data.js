window.TRACEABILITY_DATA = {
  "schemaVersion": 2,
  "metadata": {
    "backlogItem": "BL-001",
    "status": "READY_FOR_FINAL_RECONCILIATION",
    "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89",
    "canonicalEndpointInventory": 134,
    "canonicalAcceptedExamined": 134,
    "canonicalComplete": 134,
    "canonicalUnresolved": 0,
    "canonicalBlocked": 0,
    "canonicalFailed": 0,
    "canonicalNotYetExamined": 0,
    "materializedMatrixRows": 134,
    "historicalAcceptedRowsPendingBackfill": 0,
    "latestMaterializedFromInvocation": "PRODUCTION-FIRE-20260824-080301",
    "latestInvocation": "RECONCILIATION-FIRE-20260825-020007Z",
    "projectionState": "CONSOLIDATED_CANONICAL_134"
  },
  "endpoints": [
    {
      "method": "GET",
      "path": "/add-stop",
      "controller": "AddStopController",
      "controllerMethod": "showStopPage",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Trip status guard",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "showStopPage"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "getTripStatusByVehicleLoadId"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/vehicle-load/fetch?vehicleLoadId=..."
            }
          ]
        },
        {
          "label": "Customer stop heatmap",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "showStopPage"
            },
            {
              "type": "SERVICE",
              "name": "ChallanHeatmapFetchService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "TripChallanBookAssignmentViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_challan_book_assignments"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPagePhotoDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/Customerstopselectionpage-withoutAutoChallanUpdate"
            }
          ]
        },
        {
          "label": "Supplier stop heatmap",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "showStopPage"
            },
            {
              "type": "SERVICE",
              "name": "ChallanHeatmapFetchService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "TripChallanBookAssignmentViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_challan_book_assignments"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/Supplierstopselectionpage"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_trip",
        "public.tbl_trip_status",
        "public.vw_trip_challan_book_assignments",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_challan_page_photo",
        "Customer/Supplier stop views",
        "guard redirect"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "POST",
      "path": "/add-stop/challan-page-photo/delete-ajax",
      "controller": "AddStopController",
      "controllerMethod": "deleteChallanPagePhotoAjax",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Deactivate active challan photo",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "deleteChallanPagePhotoAjax"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "deactivatePhoto"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao",
              "method": "findById / save"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPagePhotoDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            }
          ]
        },
        {
          "label": "Success terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "deleteChallanPagePhotoAjax"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "deactivatePhoto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "HTTP 200 JSON success=true"
            }
          ]
        },
        {
          "label": "Application error terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "deleteChallanPagePhotoAjax"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "deactivatePhoto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "HTTP 400 JSON success=false"
            }
          ]
        },
        {
          "label": "Unexpected error terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "deleteChallanPagePhotoAjax"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "deactivatePhoto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "HTTP 500 JSON success=false"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_page_photo",
        "HTTP 200 JSON",
        "HTTP 400 JSON",
        "HTTP 500 JSON"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-172900.md"
      ]
    },
    {
      "method": "POST",
      "path": "/add-stop/challan-page-photo/upload",
      "controller": "AddStopController",
      "controllerMethod": "uploadChallanPagePhoto",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Resolve challan page by full number",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhoto -> uploadChallanPhotoInternal"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao",
              "method": "findPageByFullNumber"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_book_registry"
            }
          ]
        },
        {
          "label": "Deactivate previous active photo",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhoto -> uploadChallanPhotoInternal"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao",
              "method": "deactivateActivePhotosForPage"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            }
          ]
        },
        {
          "label": "Persist uploaded photo",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhoto -> uploadChallanPhotoInternal"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPagePhotoDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            }
          ]
        },
        {
          "label": "Success terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhoto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/add-stop?vehicleLoadId=...&actionType=...",
              "method": "flash success"
            }
          ]
        },
        {
          "label": "Error terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhoto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/add-stop?vehicleLoadId=...&actionType=...",
              "method": "flash error"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_challan_book_registry",
        "public.tbl_challan_page_photo",
        "redirect:/add-stop"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-180750.md"
      ]
    },
    {
      "method": "POST",
      "path": "/add-stop/challan-page-photo/upload-ajax",
      "controller": "AddStopController",
      "controllerMethod": "uploadChallanPagePhotoAjax",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Resolve challan page by full number",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhotoAjax -> uploadChallanPhotoInternal"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao",
              "method": "findPageByFullNumber"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_book_registry"
            }
          ]
        },
        {
          "label": "Deactivate previous active photo",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhotoAjax -> uploadChallanPhotoInternal"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao",
              "method": "deactivateActivePhotosForPage"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            }
          ]
        },
        {
          "label": "Persist uploaded photo",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhotoAjax -> uploadChallanPhotoInternal"
            },
            {
              "type": "SERVICE",
              "name": "ChallanPagePhotoUploadService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPagePhotoDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            }
          ]
        },
        {
          "label": "Success terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhotoAjax"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "HTTP 200 JSON success=true"
            }
          ]
        },
        {
          "label": "Application or IO error terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhotoAjax"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "HTTP 400 JSON success=false"
            }
          ]
        },
        {
          "label": "Unexpected error terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "AddStopController",
              "method": "uploadChallanPagePhotoAjax"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "HTTP 500 JSON success=false"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_challan_book_registry",
        "public.tbl_challan_page_photo",
        "HTTP 200 JSON",
        "HTTP 400 JSON",
        "HTTP 500 JSON"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-180750.md"
      ]
    },
    {
      "method": "GET",
      "path": "/logistics/challan-books/add-form",
      "controller": "ChallanBookWebController",
      "controllerMethod": "showAddBookForm",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Summary metrics",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanBookWebController",
              "method": "showAddBookForm"
            },
            {
              "type": "SERVICE",
              "name": "SummaryMetricLookupFetchService",
              "method": "fetchChallanBookTotalMetrics / fetchChallanBookActiveMetrics / fetchChallanBookUnusedPageMetrics"
            },
            {
              "type": "DAO",
              "name": "SummaryMetricLookupJpaDao",
              "method": "findByLookUpKeyIn"
            },
            {
              "type": "ENTITY",
              "name": "SummaryMetricLookupDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_summary_metric_lookup"
            },
            {
              "type": "MAPPER",
              "name": "SummaryMetricLookupMapper",
              "method": "mapDoToDto"
            }
          ]
        },
        {
          "label": "Terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanBookWebController",
              "method": "showAddBookForm"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/add-challan-book.html"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_summary_metric_lookup",
        "final-version-1/add-challan-book.html"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-003111.md"
      ]
    },
    {
      "method": "POST",
      "path": "/logistics/challan-books/save",
      "controller": "ChallanBookWebController",
      "controllerMethod": "processBookIngestion",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Book registry save",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanBookWebController",
              "method": "processBookIngestion"
            },
            {
              "type": "SERVICE",
              "name": "ChallanBookIngestionService",
              "method": "processRequest"
            },
            {
              "type": "MAPPER",
              "name": "ChallanBookRegistryMapper",
              "method": "mapDtoToDo"
            },
            {
              "type": "DAO",
              "name": "ChallanBookRegistryJpaDao",
              "method": "saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "ChallanBookRegistryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_book_registry"
            }
          ]
        },
        {
          "label": "Conditional page cascade",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanBookWebController",
              "method": "processBookIngestion"
            },
            {
              "type": "SERVICE",
              "name": "ChallanBookIngestionService",
              "method": "processRequest"
            },
            {
              "type": "MAPPER",
              "name": "ChallanBookRegistryMapper",
              "method": "mapDtoToDo"
            },
            {
              "type": "MAPPER",
              "name": "ChallanPageAuditLedgerMapper",
              "method": "mapDtoToDo"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            }
          ]
        },
        {
          "label": "Error summary metrics",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanBookWebController",
              "method": "processBookIngestion"
            },
            {
              "type": "SERVICE",
              "name": "SummaryMetricLookupFetchService",
              "method": "fetch metrics"
            },
            {
              "type": "DAO",
              "name": "SummaryMetricLookupJpaDao",
              "method": "findByLookUpKeyIn"
            },
            {
              "type": "ENTITY",
              "name": "SummaryMetricLookupDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_summary_metric_lookup"
            },
            {
              "type": "MAPPER",
              "name": "SummaryMetricLookupMapper",
              "method": "mapDoToDto"
            }
          ]
        },
        {
          "label": "Success redirect",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanBookWebController",
              "method": "processBookIngestion"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10"
            }
          ]
        },
        {
          "label": "Error re-render",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanBookWebController",
              "method": "processBookIngestion"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/add-challan-book"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_book_registry",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_summary_metric_lookup",
        "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10",
        "final-version-1/add-challan-book"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-003111.md"
      ]
    },
    {
      "method": "GET",
      "path": "/challan-entry-aging-dashboard",
      "controller": "ChallanEntryAgingDashboardController",
      "controllerMethod": "showChallanEntryAgingDashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Tracker metrics / rows",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanEntryAgingDashboardController",
              "method": "showChallanEntryAgingDashboard"
            },
            {
              "type": "SERVICE",
              "name": "ChallanEntryAgingDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "TripChallanEntryTrackerJpaDao",
              "method": "countByTrackerStatus / findDashboardRows"
            },
            {
              "type": "ENTITY",
              "name": "TripChallanEntryTrackerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_challan_entry_tracker"
            },
            {
              "type": "MAPPER",
              "name": "ChallanEntryAgingDashboardMapper",
              "method": "mapTrackerDosToDtos"
            }
          ]
        },
        {
          "label": "Audit rows",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanEntryAgingDashboardController",
              "method": "showChallanEntryAgingDashboard"
            },
            {
              "type": "SERVICE",
              "name": "ChallanEntryAgingDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "TripChallanEntryTrackerAuditJpaDao",
              "method": "findDashboardRows"
            },
            {
              "type": "ENTITY",
              "name": "TripChallanEntryTrackerAuditDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_challan_entry_tracker_audit"
            },
            {
              "type": "MAPPER",
              "name": "ChallanEntryAgingDashboardMapper",
              "method": "mapAuditDosToDtos"
            }
          ]
        },
        {
          "label": "Terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanEntryAgingDashboardController",
              "method": "showChallanEntryAgingDashboard"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/ChallanEntryAgingDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_trip_challan_entry_tracker",
        "public.tbl_trip_challan_entry_tracker_audit",
        "final-version-1/ChallanEntryAgingDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-005711.md"
      ]
    },
    {
      "method": "GET",
      "path": "/challan-heatmap",
      "controller": "ChallanHeatmapController",
      "controllerMethod": "showHeatmap",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Heatmap metrics query / mapping",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanHeatmapController",
              "method": "showHeatmap"
            },
            {
              "type": "SERVICE",
              "name": "ChallanHeatmapFetchService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ChallanHeatmapMetricsViewJpaDao",
              "method": "findHeatmapMetrics / findDistinctBookTypes / findDistinctBookCodes / findDistinctSeriesPrefixes"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "ChallanHeatmapMetricsViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_challan_heatmap_metrics"
            },
            {
              "type": "MAPPER",
              "name": "ChallanHeatmapMetricsViewMapper",
              "method": "mapDoToDto"
            }
          ]
        },
        {
          "label": "Terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanHeatmapController",
              "method": "showHeatmap"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/ChallanHeatmapDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_challan_heatmap_metrics",
        "final-version-1/ChallanHeatmapDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-013336.md"
      ]
    },
    {
      "method": "GET",
      "path": "/challan-page-photo/{challanPagePhotoId}",
      "controller": "ChallanPagePhotoController",
      "controllerMethod": "retrieveChallanPagePhoto",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Photo retrieval path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ChallanPagePhotoController",
              "method": "retrieveChallanPagePhoto"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao",
              "method": "findById(challanPagePhotoId)"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPagePhotoDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            },
            {
              "type": "TERMINAL_HTTP_RESPONSE",
              "name": "ResponseEntity<byte[]>",
              "method": "404 when missing/inactive; otherwise inline binary response"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_page_photo",
        "HTTP 404 / inline binary response"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-053325.md",
        "CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89:ChallanPagePhotoController.java#734bf079a5c8227573e2c7f47a984cace9cfd75f",
        "CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89:ChallanPagePhotoJpaDao.java#91786a6147be2d695eae1be5d8d066606cb41633",
        "CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89:ChallanPagePhotoDo.java#cd49fe4e62da3d8a2016ec8c813a2e363ee3d1c6"
      ]
    },
    {
      "method": "POST",
      "path": "/complete-trip",
      "controller": "CompleteTripController",
      "controllerMethod": "completeTrip",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Validation - vehicle load",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CompleteTripRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            }
          ]
        },
        {
          "label": "Validation - logistics execution",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CompleteTripRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionJpaDao",
              "method": "findByVehicleLoad"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution"
            }
          ]
        },
        {
          "label": "Validation - active logistics lines",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CompleteTripRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionLineJpaDao",
              "method": "findByCylinderLogisticsExecutionAndActive"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution_line"
            }
          ]
        },
        {
          "label": "Validation - allowed yard states",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CompleteTripRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "YardInventoryAllowedStateJpaDao",
              "method": "findAll"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryAllowedStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_allowed_state"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo",
              "method": "associated allowed state"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            }
          ]
        },
        {
          "label": "Validation - duplicate active yard line",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CompleteTripRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao",
              "method": "findByCylinderAndActive"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            }
          ]
        },
        {
          "label": "Vehicle load read",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            }
          ]
        },
        {
          "label": "Logistics execution read/write",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionJpaDao",
              "method": "findByVehicleLoad / save"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution"
            }
          ]
        },
        {
          "label": "Logistics execution line read/write",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionLineJpaDao",
              "method": "findByCylinderLogisticsExecutionAndActive / save"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution_line"
            }
          ]
        },
        {
          "label": "Yard entry create",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "YardEntriesJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "YardEntryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_entries"
            }
          ]
        },
        {
          "label": "Yard inventory lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "YardInventoryJpaDao",
              "method": "findByYardCodeIgnoreCaseAndActive"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory"
            }
          ]
        },
        {
          "label": "Yard source type lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "YardInventorySourceTypeJpaDao",
              "method": "findBySourceTypeCodeIgnoreCaseAndActive"
            },
            {
              "type": "ENTITY",
              "name": "YardInventorySourceTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_source_type"
            }
          ]
        },
        {
          "label": "Cylinder state lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao",
              "method": "findByCylinderStateContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            }
          ]
        },
        {
          "label": "Yard inventory line create",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            }
          ]
        },
        {
          "label": "Trip status lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStatusJpaDao",
              "method": "findByStatusName"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            }
          ]
        },
        {
          "label": "Trip update",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            }
          ]
        },
        {
          "label": "Yard-end stop create",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStopJpaDao",
              "method": "findMaxStopSequenceByVehicleTrip / save"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip_stop"
            }
          ]
        },
        {
          "label": "Stop type lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStopTypeJpaDao",
              "method": "findByStopType"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStopTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_stop_type"
            }
          ]
        },
        {
          "label": "Cylinder association read from active logistics line",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo",
              "method": "getCylinder"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            }
          ]
        },
        {
          "label": "Terminal response",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CompleteTripController",
              "method": "completeTrip"
            },
            {
              "type": "SERVICE",
              "name": "CompleteTripServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:ViewConstants.REDIRECT_HOME_LINK",
              "method": "ModelAndView redirect"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_trip",
        "public.tbl_trip_status",
        "public.tbl_vehicle_trip_stop",
        "public.tbl_stop_type",
        "public.tbl_yard_entries",
        "public.tbl_yard_inventory",
        "public.tbl_yard_inventory_line",
        "public.tbl_yard_inventory_source_type",
        "public.tbl_yard_inventory_allowed_state",
        "public.tbl_cylinder_states",
        "public.tbl_cylinder_logistics_execution",
        "public.tbl_cylinder_logistics_execution_line",
        "public.tbl_cylinder",
        "redirect:ViewConstants.REDIRECT_HOME_LINK"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-000114.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-address-location/import-whatsapp-export",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "showWhatsappImport",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Unmapped import list",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "showWhatsappImport"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchUnmappedImports"
            },
            {
              "type": "DAO",
              "name": "CustomerLocationImportInboxJpaDao",
              "method": "findByMappingStatusOrderByImportedAtDesc"
            },
            {
              "type": "ENTITY",
              "name": "CustomerLocationImportInboxDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_location_import_inbox"
            },
            {
              "type": "MAPPER",
              "name": "CustomerLocationImportInboxMapper",
              "method": "toDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerAddressLocationImport"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer_location_import_inbox",
        "with-menu/CustomerAddressLocationImport"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "POST",
      "path": "/customer-address-location/import-whatsapp-export",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "importWhatsappText",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Import persistence",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "importWhatsappText"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "importWhatsappText"
            },
            {
              "type": "DAO",
              "name": "CustomerLocationImportInboxJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerLocationImportInboxDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_location_import_inbox"
            },
            {
              "type": "MAPPER",
              "name": "CustomerLocationImportInboxMapper",
              "method": "toDto"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/customer-address-location/import-whatsapp-export"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer_location_import_inbox",
        "redirect:/customer-address-location/import-whatsapp-export"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-address-location/missing",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "showMissingLocations",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Missing locations",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "showMissingLocations"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchMissingCustomerAddressLocations"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressLocationJpaDao",
              "method": "findMissingCustomerAddressLocations"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_address_location_status"
            },
            {
              "type": "MAPPER",
              "name": "CustomerAddressLocationMapper",
              "method": "toDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerAddressLocationMissing"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_address_location_status",
        "with-menu/CustomerAddressLocationMissing"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-address-location/planning-map",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "showPlanningMap",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "showPlanningMap"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerAddressPlanningMap"
            }
          ]
        }
      ],
      "finalDependencies": [
        "with-menu/CustomerAddressPlanningMap"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-013546.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-address-location/points.geojson",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "customerAddressPointsGeoJson",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Location status view branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "customerAddressPointsGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchCustomerAddressMapPointsGeoJson / fetchCustomerAddressMapPoints"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressLocationJpaDao",
              "method": "findCustomerAddressMapPoints"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_address_location_status"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "Generated GeoJSON response"
            }
          ]
        },
        {
          "label": "Pending order request branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "customerAddressPointsGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchCustomerAddressMapPointsGeoJson / fetchCustomerAddressMapPoints"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressLocationJpaDao",
              "method": "findCustomerAddressMapPoints"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_order_request"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "Generated GeoJSON response"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_address_location_status",
        "public.tbl_customer_order_request",
        "Generated GeoJSON response"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-address-location/upload",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "showUpload",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Terminal upload view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "showUpload"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerAddressLocationUpload"
            }
          ]
        }
      ],
      "finalDependencies": [
        "with-menu/CustomerAddressLocationUpload"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "POST",
      "path": "/customer-address-location/upload",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "saveLocation",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Customer address branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "saveLocation"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "saveCustomerAddressLocation"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            }
          ]
        },
        {
          "label": "Location branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "saveLocation"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "saveCustomerAddressLocation"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressLocationJpaDao",
              "method": "findByCustomerAddressCustomerAddressIdAndActiveTrue / save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressLocationDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address_location"
            },
            {
              "type": "MAPPER",
              "name": "CustomerAddressLocationMapper",
              "method": "toDto"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect customer-address-location"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer_address",
        "public.tbl_customer_address_location",
        "redirect customer-address-location"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "GET",
      "path": "/yard-location/points.geojson",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "yardLocationsGeoJson",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Yard location table",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "yardLocationsGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchYardLocationsGeoJson"
            },
            {
              "type": "DAO",
              "name": "YardLocationJpaDao",
              "method": "findActiveYardLocations"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_location"
            },
            {
              "type": "MAPPER",
              "name": "YardLocationMapper",
              "method": "toDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "Generated GeoJSON response"
            }
          ]
        },
        {
          "label": "Yard inventory join",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "yardLocationsGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchYardLocationsGeoJson"
            },
            {
              "type": "DAO",
              "name": "YardLocationJpaDao",
              "method": "findActiveYardLocations"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory"
            },
            {
              "type": "MAPPER",
              "name": "YardLocationMapper",
              "method": "toDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "Generated GeoJSON response"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_yard_location",
        "public.tbl_yard_inventory",
        "Generated GeoJSON response"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "GET",
      "path": "/yard-location/upload",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "showYardLocationUpload",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Active yards",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "showYardLocationUpload"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchActiveYardsForLocationCapture"
            },
            {
              "type": "DAO",
              "name": "YardInventoryJpaDao",
              "method": "findByActiveTrueOrderByYardNameAsc"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/YardLocationUpload"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_yard_inventory",
        "with-menu/YardLocationUpload"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "POST",
      "path": "/yard-location/upload",
      "controller": "CustomerAddressLocationController",
      "controllerMethod": "saveYardLocation",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Yard branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "saveYardLocation"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "saveYardLocation"
            },
            {
              "type": "DAO",
              "name": "YardInventoryJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory"
            }
          ]
        },
        {
          "label": "Yard location branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerAddressLocationController",
              "method": "saveYardLocation"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "saveYardLocation"
            },
            {
              "type": "DAO",
              "name": "YardLocationJpaDao",
              "method": "findFirstByYardYardInventoryIdAndActiveTrueAndDefaultStartPointTrueOrderByYardLocationIdDesc / save"
            },
            {
              "type": "ENTITY",
              "name": "YardLocationDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_location"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/yard-location/upload"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_yard_inventory",
        "public.tbl_yard_location",
        "redirect:/yard-location/upload"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-020143.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-consumption",
      "controller": "CustomerConsumptionDashboardController",
      "controllerMethod": "dashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Dashboard view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerConsumptionDashboardController",
              "method": "dashboard"
            },
            {
              "type": "SERVICE",
              "name": "CustomerConsumptionDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "CustomerProductConsumptionProjectionViewJpaDao",
              "method": "findAll(specification,pageable) + summary count/sum/status/average queries"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CustomerProductConsumptionProjectionViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "MAPPER",
              "name": "CustomerConsumptionProjectionMapper",
              "method": "toProjectionDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerConsumptionDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_product_consumption_projection",
        "with-menu/CustomerConsumptionDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-023321.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-consumption/",
      "controller": "CustomerConsumptionDashboardController",
      "controllerMethod": "dashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Dashboard view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerConsumptionDashboardController",
              "method": "dashboard"
            },
            {
              "type": "SERVICE",
              "name": "CustomerConsumptionDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "CustomerProductConsumptionProjectionViewJpaDao",
              "method": "findAll(specification,pageable) + summary count/sum/status/average queries"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CustomerProductConsumptionProjectionViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "MAPPER",
              "name": "CustomerConsumptionProjectionMapper",
              "method": "toProjectionDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerConsumptionDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_product_consumption_projection",
        "with-menu/CustomerConsumptionDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-023321.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-consumption/api/dashboard",
      "controller": "CustomerConsumptionDashboardController",
      "controllerMethod": "dashboardData",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Dashboard JSON",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerConsumptionDashboardController",
              "method": "dashboardData"
            },
            {
              "type": "SERVICE",
              "name": "CustomerConsumptionDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "CustomerProductConsumptionProjectionViewJpaDao",
              "method": "findAll(specification,pageable) + summary count/sum/status/average queries"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CustomerProductConsumptionProjectionViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "MAPPER",
              "name": "CustomerConsumptionProjectionMapper",
              "method": "toProjectionDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CustomerConsumptionDashboardDto response body"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_product_consumption_projection",
        "CustomerConsumptionDashboardDto JSON response"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-023321.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-consumption/dashboard",
      "controller": "CustomerConsumptionDashboardController",
      "controllerMethod": "dashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Dashboard view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerConsumptionDashboardController",
              "method": "dashboard"
            },
            {
              "type": "SERVICE",
              "name": "CustomerConsumptionDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "CustomerProductConsumptionProjectionViewJpaDao",
              "method": "findAll(specification,pageable) + summary count/sum/status/average queries"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CustomerProductConsumptionProjectionViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "MAPPER",
              "name": "CustomerConsumptionProjectionMapper",
              "method": "toProjectionDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerConsumptionDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_product_consumption_projection",
        "with-menu/CustomerConsumptionDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-023321.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-demands",
      "controller": "CustomerDemandController",
      "controllerMethod": "dashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Demand rows",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerDemandController",
              "method": "dashboard"
            },
            {
              "type": "SERVICE",
              "name": "CustomerDemandService",
              "method": "fetchPage"
            },
            {
              "type": "DAO",
              "name": "CustomerDemandDashboardViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CustomerDemandDashboardViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_demand_dashboard"
            }
          ]
        },
        {
          "label": "Demand metrics",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerDemandController",
              "method": "dashboard"
            },
            {
              "type": "SERVICE",
              "name": "CustomerDemandService",
              "method": "fetchMetrics"
            },
            {
              "type": "DAO",
              "name": "CustomerDemandJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDemandDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_order_request"
            },
            {
              "type": "DAO",
              "name": "CustomerDemandDailyProductMetricsViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CustomerDemandDailyProductMetricsViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_demand_daily_product_metrics"
            }
          ]
        },
        {
          "label": "Reference lists",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerDemandController",
              "method": "dashboard"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "DAO",
              "name": "ProductJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/CustomerDemandDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_demand_dashboard",
        "public.tbl_customer_order_request",
        "public.vw_customer_demand_daily_product_metrics",
        "public.tbl_customer",
        "public.tbl_customer_address",
        "public.tbl_product",
        "final-version-1/CustomerDemandDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "POST",
      "path": "/customer-demands",
      "controller": "CustomerDemandController",
      "controllerMethod": "create",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Validate references and persist",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerDemandController",
              "method": "create"
            },
            {
              "type": "SERVICE",
              "name": "CustomerDemandService",
              "method": "create"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "DAO",
              "name": "ProductJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "DAO",
              "name": "CustomerDemandJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDemandDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_order_request"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/customer-demands"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "public.tbl_product",
        "public.tbl_customer_address",
        "public.tbl_customer_order_request",
        "redirect:/customer-demands"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "POST",
      "path": "/customer-demands/{requestId}/mark-delivered",
      "controller": "CustomerDemandController",
      "controllerMethod": "markDelivered",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Mark delivered",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerDemandController",
              "method": "markDelivered"
            },
            {
              "type": "SERVICE",
              "name": "CustomerDemandService",
              "method": "markDelivered"
            },
            {
              "type": "DAO",
              "name": "CustomerDemandJpaDao",
              "method": "findById/save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDemandDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_order_request"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/customer-demands"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer_order_request",
        "redirect:/customer-demands"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/fetchCustomerByPage",
      "controller": "CustomerFetchByPageController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Customer root and success view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchByPageController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "page query selected by activeOnly/searchTerm"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/CustomerListPage"
            }
          ]
        },
        {
          "label": "Phone summary expansion",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchByPageController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByPageService",
              "method": "processRequest / toSummary"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "ENTITY",
              "name": "CustomerPhoneNumberDo",
              "method": "getCustomerPhoneNumbers"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_phone_number"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo",
              "method": "getPhoneNumber"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/CustomerListPage"
            }
          ]
        },
        {
          "label": "Address and city summary expansion",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchByPageController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByPageService",
              "method": "processRequest / toSummary"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo",
              "method": "getCustomerAddresses"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "ENTITY",
              "name": "AddressDo",
              "method": "getAddress"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address"
            },
            {
              "type": "ENTITY",
              "name": "CityDo",
              "method": "getCity / getCityName"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/CustomerListPage"
            }
          ]
        },
        {
          "label": "Handled error redirect",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchByPageController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=<itemsPerPage>"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "public.tbl_customer_phone_number",
        "public.tbl_phone_number",
        "public.tbl_customer_address",
        "public.tbl_address",
        "public.tbl_city",
        "final-version-1/CustomerListPage",
        "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=<itemsPerPage>"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-143220.md"
      ]
    },
    {
      "method": "GET",
      "path": "/displayCustomer",
      "controller": "CustomerFetchController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Customer root and success view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByIdService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "DisplayCustomer"
            }
          ]
        },
        {
          "label": "Address expansion",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByIdService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo",
              "method": "getCustomerAddresses"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "ENTITY",
              "name": "AddressDo",
              "method": "getAddress"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address"
            },
            {
              "type": "MAPPER",
              "name": "AddressMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "DisplayCustomer"
            }
          ]
        },
        {
          "label": "Phone-number expansion",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByIdService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "ENTITY",
              "name": "CustomerPhoneNumberDo",
              "method": "getCustomerPhoneNumbers"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_phone_number"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo",
              "method": "getPhoneNumber"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            },
            {
              "type": "MAPPER",
              "name": "PhoneNumberMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "DisplayCustomer"
            }
          ]
        },
        {
          "label": "Handled error redirect",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerFetchController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "CustomerFetchByIdService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "public.tbl_customer_address",
        "public.tbl_address",
        "public.tbl_customer_phone_number",
        "public.tbl_phone_number",
        "DisplayCustomer",
        "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-134342.md"
      ]
    },
    {
      "method": "GET",
      "path": "/customer-spot-cylinder-check/fetch",
      "controller": "CustomerSpotCylinderCheckController",
      "controllerMethod": "fetch handler",
      "state": "COMPLETE",
      "chainCompleteness": "PARTIAL_INTERMEDIATE_HOPS",
      "paths": [
        {
          "label": "Accepted historical source path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "GET /customer-spot-cylinder-check/fetch handler"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "findActiveSpotCheckBooksForLoad"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentViewJpaDao"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_challan_book_assignments"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_trip_challan_book_assignments"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-145512.md#LANE-01"
      ]
    },
    {
      "method": "POST",
      "path": "/customer-spot-cylinder-check/submit",
      "controller": "CustomerSpotCylinderCheckController",
      "controllerMethod": "submit",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Assigned book validation / terminal view lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "submit / buildMav"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "submitSpotCheck / findActiveSpotCheckBooksForLoad"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentViewJpaDao",
              "method": "findByVehicleLoadIdAndBookTypeAndActiveAssignment"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "TripChallanBookAssignmentViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_challan_book_assignments"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/CustomerSpotCylinderCheck"
            }
          ]
        },
        {
          "label": "Customer validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "submit"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "validateMandatoryHeader"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "existsById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            }
          ]
        },
        {
          "label": "Challan page validation and status update",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "submit"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "resolveUnusedPage / submitSpotCheck"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao",
              "method": "findByBookIdAndSheetNumber / updatePageStatus"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            }
          ]
        },
        {
          "label": "Cylinder validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "submit"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "mapAndValidateLine"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao",
              "method": "findByCylinderSerialIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            }
          ]
        },
        {
          "label": "Customer custody validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "submit"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "mapAndValidateLine"
            },
            {
              "type": "DAO",
              "name": "CylinderCustomerCustodyJpaDao",
              "method": "findByCustomerId"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CylinderCustomerCustodyDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_cylinders_at_customers"
            }
          ]
        },
        {
          "label": "Spot-check header and cascaded lines persistence",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "submit"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "submitSpotCheck"
            },
            {
              "type": "DAO",
              "name": "CustomerSpotCylinderCheckJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerSpotCylinderCheckDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_spot_cylinder_check"
            },
            {
              "type": "ENTITY",
              "name": "CustomerSpotCylinderCheckLineDo",
              "method": "cascade ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_spot_cylinder_check_line"
            }
          ]
        },
        {
          "label": "Challan transaction link",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerSpotCylinderCheckController",
              "method": "submit"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSpotCylinderCheckService",
              "method": "submitSpotCheck"
            },
            {
              "type": "DAO",
              "name": "ChallanTransactionLinkJpaDao",
              "method": "insertCustomerSpotCylinderCheckLink"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_transaction_link",
              "method": "native INSERT"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_trip_challan_book_assignments",
        "public.tbl_customer",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_cylinder",
        "public.vw_cylinders_at_customers",
        "public.tbl_customer_spot_cylinder_check",
        "public.tbl_customer_spot_cylinder_check_line",
        "public.tbl_challan_transaction_link",
        "final-version-1/CustomerSpotCylinderCheck"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-100135.md"
      ]
    },
    {
      "method": "POST",
      "path": "/stop",
      "controller": "CustomerStopSelectionController",
      "controllerMethod": "processStopIngestion",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Challan-photo guard",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerStopSelectionController",
              "method": "processStopIngestion"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/add-stop?vehicleLoadId=...&actionType=..."
            }
          ]
        },
        {
          "label": "Customer full delivery",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerStopSelectionController",
              "method": "processStopIngestion"
            },
            {
              "type": "SERVICE_INTERFACE",
              "name": "ICylinderManagementApplicationService<VehicleTripStopIngestionRequestDto,VehicleTripStopIngestionResponseDto>",
              "method": "processRequest"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripStopIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO_SET",
              "name": "VehicleLoadJpaDao; VehicleTripStopTypeJpaDao; CustomerJpaDao; CustomerAddressJpaDao; ChallanTypeJpaDao; CylinderJpaDao; OrderJpaDao; OrderLineJpaDao; CylinderLogisticsExecutionLineJpaDao; VehicleTripJpaDao; VehicleTripStopJpaDao; ChallanPageAuditLedgerJpaDao; ChallanTransactionLinkJpaDao"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_vehicle_load; public.tbl_stop_type; public.tbl_customer; public.tbl_customer_address; public.tbl_challan_type; public.tbl_cylinder; public.tbl_order; public.tbl_order_line; public.tbl_cylinder_logistics_execution_line; public.tbl_vehicle_trip; public.tbl_vehicle_trip_stop; public.tbl_challan_page_audit_ledger; public.tbl_challan_transaction_link"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/vehicle-load/fetch?vehicleLoadId=..."
            }
          ]
        },
        {
          "label": "Customer empty pickup",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "VehicleTripStopIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO_SET",
              "name": "EmptyPickupJpaDao; EmptyPickupLineJpaDao; CylinderJpaDao; CylinderLogisticsExecutionJpaDao; CylinderLogisticsExecutionLineJpaDao; CylinderStateJpaDao; VehicleTripJpaDao; VehicleTripStopJpaDao; ChallanPageAuditLedgerJpaDao; ChallanTransactionLinkJpaDao"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_empty_pickup; public.tbl_empty_pickup_line; public.tbl_cylinder; public.tbl_cylinder_logistics_execution; public.tbl_cylinder_logistics_execution_line; public.tbl_cylinder_states; public.tbl_vehicle_trip; public.tbl_vehicle_trip_stop; public.tbl_challan_page_audit_ledger; public.tbl_challan_transaction_link"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/vehicle-load/fetch?vehicleLoadId=..."
            }
          ]
        },
        {
          "label": "Supplier empty dropoff",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "VehicleTripStopIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO_SET",
              "name": "SupplierJpaDao; VehicleLoadLineJpaDao; SupplierTripJpaDao; SupplierTripLineJpaDao; CylinderJpaDao; CylinderLogisticsExecutionLineJpaDao; VehicleTripJpaDao; VehicleTripStopJpaDao; ChallanPageAuditLedgerJpaDao; ChallanTransactionLinkJpaDao"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_supplier; public.tbl_vehicle_load_line; public.tbl_supplier_trip; public.tbl_supplier_trip_line; public.tbl_cylinder; public.tbl_cylinder_logistics_execution_line; public.tbl_vehicle_trip; public.tbl_vehicle_trip_stop; public.tbl_challan_page_audit_ledger; public.tbl_challan_transaction_link"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/vehicle-load/fetch?vehicleLoadId=..."
            }
          ]
        },
        {
          "label": "Supplier full pickup",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "VehicleTripStopIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO_SET",
              "name": "SupplierJpaDao; CylinderJpaDao; SupplierTripLineJpaDao; SupplierRefillCollectionJpaDao; SupplierRefillCollectionLineJpaDao; CylinderLogisticsExecutionJpaDao; CylinderLogisticsExecutionLineJpaDao; CylinderStateJpaDao; VehicleTripJpaDao; VehicleTripStopJpaDao; ChallanPageAuditLedgerJpaDao; ChallanTransactionLinkJpaDao"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_supplier; public.tbl_cylinder; public.tbl_supplier_trip_line; public.tbl_supplier_refill_collection; public.tbl_supplier_refill_collection_line; public.tbl_cylinder_logistics_execution; public.tbl_cylinder_logistics_execution_line; public.tbl_cylinder_states; public.tbl_vehicle_trip; public.tbl_vehicle_trip_stop; public.tbl_challan_page_audit_ledger; public.tbl_challan_transaction_link"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/vehicle-load/fetch?vehicleLoadId=..."
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_load",
        "public.tbl_stop_type",
        "public.tbl_customer",
        "public.tbl_customer_address",
        "public.tbl_challan_type",
        "public.tbl_cylinder",
        "public.tbl_order",
        "public.tbl_order_line",
        "public.tbl_empty_pickup",
        "public.tbl_empty_pickup_line",
        "public.tbl_supplier",
        "public.tbl_vehicle_load_line",
        "public.tbl_supplier_trip",
        "public.tbl_supplier_trip_line",
        "public.tbl_supplier_refill_collection",
        "public.tbl_supplier_refill_collection_line",
        "public.tbl_cylinder_logistics_execution",
        "public.tbl_cylinder_logistics_execution_line",
        "public.tbl_cylinder_states",
        "public.tbl_vehicle_trip",
        "public.tbl_vehicle_trip_stop",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_challan_transaction_link",
        "redirect:/add-stop",
        "redirect:/vehicle-load/fetch"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-230001.md"
      ]
    },
    {
      "method": "POST",
      "path": "/updateCustomer",
      "controller": "CustomerUpdateController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Existing customer read",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CustomerUpdateRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            }
          ]
        },
        {
          "label": "GST ownership check",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "SERVICE_UTILITY",
              "name": "CustomerDetailsExistenceUtility",
              "method": "getCustomerIdByGstNumber"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findByGstNumberIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            }
          ]
        },
        {
          "label": "Phone ownership check",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "SERVICE_UTILITY",
              "name": "CustomerDetailsExistenceUtility",
              "method": "getCustomerIdByPhoneNumber"
            },
            {
              "type": "DAO",
              "name": "PhoneNumberJpaDao",
              "method": "findByPhoneNumber"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            },
            {
              "type": "ENTITY",
              "name": "CustomerPhoneNumberDo",
              "method": "PhoneNumberDo.customerPhoneNumbers lazy association"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_phone_number"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo",
              "method": "CustomerPhoneNumberDo.customer"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            }
          ]
        },
        {
          "label": "Customer write",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            }
          ]
        },
        {
          "label": "Customer address cascade write",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest / updateAddresses"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo",
              "method": "CustomerDo.customerAddresses cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "ENTITY",
              "name": "AddressDo",
              "method": "CustomerAddressDo.address cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address"
            }
          ]
        },
        {
          "label": "Customer phone cascade write",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "ENTITY",
              "name": "CustomerPhoneNumberDo",
              "method": "CustomerDo.customerPhoneNumbers cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_phone_number"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo",
              "method": "CustomerPhoneNumberDo.phoneNumber cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            }
          ]
        },
        {
          "label": "Success terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10"
            }
          ]
        },
        {
          "label": "Validation failure terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CustomerUpdateRequestValidator",
              "method": "validate"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "UC01RegisterCustomer"
            }
          ]
        },
        {
          "label": "Application exception terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "CustomerUpdateController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "CustomerUpdateService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "/fetchCustomerByPage?pageNumber=1&itemsPerPage=10"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "public.tbl_phone_number",
        "public.tbl_customer_phone_number",
        "public.tbl_customer_address",
        "public.tbl_address",
        "redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10",
        "UC01RegisterCustomer",
        "/fetchCustomerByPage?pageNumber=1&itemsPerPage=10"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-171009.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/customer-coverage.geojson",
      "controller": "DeliveryPlanningApiController",
      "controllerMethod": "customerCoverageGeoJson",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Customer coverage",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "customerCoverageGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "customerCoverageGeoJson"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao",
              "method": "findCustomerCoverage"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_address_location_status"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "GeoJSON FeatureCollection"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_address_location_status",
        "public.tbl_delivery_planning_stop",
        "GeoJSON FeatureCollection"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/customer-density-bubbles.geojson",
      "controller": "DeliveryPlanningApiController",
      "controllerMethod": "customerDensityBubblesGeoJson",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Customer density bubbles",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "customerDensityBubblesGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningMapService",
              "method": "fetchCustomerPopulationDensityBubblesGeoJson"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findCustomerPopulationDensityBubbles"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_location"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address_location"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_delivery_planning_signal"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "GeoJSON FeatureCollection"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_yard_location",
        "public.tbl_yard_inventory",
        "public.tbl_customer_address_location",
        "public.tbl_customer_address",
        "public.vw_customer_delivery_planning_signal",
        "GeoJSON FeatureCollection"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/demand-bubbles.geojson",
      "controller": "DeliveryPlanningApiController",
      "controllerMethod": "demandBubblesGeoJson",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Yard-distance demand bubbles",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "demandBubblesGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningMapService",
              "method": "fetchDemandBubblesGeoJson"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findDemandBubbles"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_location"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address_location"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_delivery_planning_signal"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "GeoJSON FeatureCollection"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_yard_location",
        "public.tbl_yard_inventory",
        "public.tbl_customer_address_location",
        "public.tbl_customer_address",
        "public.vw_customer_delivery_planning_signal",
        "GeoJSON FeatureCollection"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/demand-points.geojson",
      "controller": "DeliveryPlanningApiController",
      "controllerMethod": "demandPointsGeoJson",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Demand points",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "demandPointsGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningMapService",
              "method": "fetchDemandPointsGeoJson -> fetchDemandPoints"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findDemandPoints"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_delivery_planning_signal"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "GeoJSON FeatureCollection"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_delivery_planning_signal",
        "GeoJSON FeatureCollection"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/stops",
      "controller": "DeliveryPlanningApiController",
      "controllerMethod": "listStops",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Planning stops",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "listStops"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "list"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "JSON list"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "JSON list"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/stops.geojson",
      "controller": "DeliveryPlanningApiController",
      "controllerMethod": "planningStopsGeoJson",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Planning stop GeoJSON",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "planningStopsGeoJson"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "stopsGeoJson -> list"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "GeoJSON FeatureCollection"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "GeoJSON FeatureCollection"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/stops/{stopId}/nearby-customers",
      "controller": "DeliveryPlanningApiController",
      "controllerMethod": "nearbyCustomers",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Resolve planning stop",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "nearbyCustomers"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "nearby"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            }
          ]
        },
        {
          "label": "Nearby customer query",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningApiController",
              "method": "nearbyCustomers"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "nearby"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao",
              "method": "findNearby"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_delivery_planning_signal"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_address_location_status"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "JSON customer projections"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "public.vw_customer_delivery_planning_signal",
        "public.vw_customer_address_location_status",
        "JSON customer projections"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning",
      "controller": "DeliveryPlanningController",
      "controllerMethod": "showDeliveryPlanningDashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "SignalMatches",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showDeliveryPlanningDashboard"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findSignalMatches"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningDashboard"
            }
          ]
        },
        {
          "label": "SignalKpi",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showDeliveryPlanningDashboard"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findSignalMatchKpi"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_product_consumption_projection",
        "with-menu/DeliveryPlanningDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-061110-SCHEDULER.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/customer-density-bubble-map",
      "controller": "DeliveryPlanningController",
      "controllerMethod": "showCustomerDensityBubbleMap",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "TerminalView",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showCustomerDensityBubbleMap"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/CustomerDensityBubbleMap"
            }
          ]
        }
      ],
      "finalDependencies": [
        "with-menu/CustomerDensityBubbleMap"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-061110-SCHEDULER.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/dashboard",
      "controller": "DeliveryPlanningController",
      "controllerMethod": "showDeliveryPlanningDashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "SignalMatches",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showDeliveryPlanningDashboard"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findSignalMatches"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningDashboard"
            }
          ]
        },
        {
          "label": "SignalKpi",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showDeliveryPlanningDashboard"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findSignalMatchKpi"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_customer_product_consumption_projection",
        "with-menu/DeliveryPlanningDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-061110-SCHEDULER.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/weekly-forecast",
      "controller": "DeliveryPlanningController",
      "controllerMethod": "showWeeklyForecastReview",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "ForecastConfirmationQueue",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showWeeklyForecastReview"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findForecastConfirmationQueue"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_delivery_planning_forecast_confirmation_worklist"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningWeeklyForecast"
            }
          ]
        },
        {
          "label": "SignalKpi",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showWeeklyForecastReview"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findSignalMatchKpi"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_product_consumption_projection"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningWeeklyForecast"
            }
          ]
        },
        {
          "label": "AddressActivity",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningController",
              "method": "showWeeklyForecastReview"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningDemandJpaDao",
              "method": "findForecastAddressActivity"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_delivery_planning_signal"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningWeeklyForecast"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_delivery_planning_forecast_confirmation_worklist",
        "public.vw_customer_product_consumption_projection",
        "public.vw_customer_delivery_planning_signal",
        "with-menu/DeliveryPlanningWeeklyForecast"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-061110-SCHEDULER.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/stops/manage",
      "controller": "DeliveryPlanningStopManagementController",
      "controllerMethod": "showStopManagementPage",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "StopList",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "showStopManagementPage"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "listWithCustomerCounts"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            }
          ]
        },
        {
          "label": "CoverageKpi",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "showStopManagementPage"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "coverageKpis"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_address_location_status"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningStopManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "public.vw_customer_address_location_status",
        "with-menu/DeliveryPlanningStopManagement"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031321-SCHEDULER.md",
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-031321.yaml"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/stops/manage/",
      "controller": "DeliveryPlanningStopManagementController",
      "controllerMethod": "showStopManagementPage",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "StopList",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "showStopManagementPage"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "listWithCustomerCounts"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            }
          ]
        },
        {
          "label": "CoverageKpi",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "showStopManagementPage"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "coverageKpis"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_customer_address_location_status"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/DeliveryPlanningStopManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "public.vw_customer_address_location_status",
        "with-menu/DeliveryPlanningStopManagement"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031321-SCHEDULER.md",
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-031321.yaml"
      ]
    },
    {
      "method": "POST",
      "path": "/delivery-planning/stops/manage/remove",
      "controller": "DeliveryPlanningStopManagementController",
      "controllerMethod": "removeStop",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Deactivate",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "removeStop"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "deactivate"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao",
              "method": "findById/save"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/delivery-planning/stops/manage"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "redirect:/delivery-planning/stops/manage"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031321-SCHEDULER.md",
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-031321.yaml"
      ]
    },
    {
      "method": "POST",
      "path": "/delivery-planning/stops/manage/save",
      "controller": "DeliveryPlanningStopManagementController",
      "controllerMethod": "saveStop",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Persist",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "saveStop"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "add/update"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao",
              "method": "save/findById"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/delivery-planning/stops/manage"
            }
          ]
        },
        {
          "label": "ValidationTerminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "saveStop"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "validation redirect to stop management"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "redirect:/delivery-planning/stops/manage"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031321-SCHEDULER.md",
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-031321.yaml"
      ]
    },
    {
      "method": "POST",
      "path": "/delivery-planning/stops/manage/save-selected",
      "controller": "DeliveryPlanningStopManagementController",
      "controllerMethod": "saveSelectedPoints",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "BatchPersist",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DeliveryPlanningStopManagementController",
              "method": "saveSelectedPoints"
            },
            {
              "type": "MEDIATOR",
              "name": "DeliveryPlanningStopMediator"
            },
            {
              "type": "VALIDATOR",
              "name": "DeliveryPlanningStopBatchSaveRequestValidator",
              "method": "duplicate check"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "addBatch"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao",
              "method": "saveAllAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/delivery-planning/stops/manage"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_delivery_planning_stop",
        "redirect:/delivery-planning/stops/manage"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031321-SCHEDULER.md",
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-031321.yaml"
      ]
    },
    {
      "method": "GET",
      "path": "/domainLookup",
      "controller": "DomainLookupController",
      "controllerMethod": "showDomainLookupPage",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "CacheHit",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "showDomainLookupPage"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getProductCategories/getProductUom/getVehicles/getDrivers/getProduct/getCylinder"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        },
        {
          "label": "ProductCategoryLazyRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshProductCategory"
            },
            {
              "type": "SERVICE",
              "name": "ProductCategoryFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ProductCategoryJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductCategoryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_category"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        },
        {
          "label": "ProductUomLazyRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshProductUom"
            },
            {
              "type": "SERVICE",
              "name": "ProductUomFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ProductUomJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductUomDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_uom"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        },
        {
          "label": "ProductLazyRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshProduct"
            },
            {
              "type": "SERVICE",
              "name": "ProductFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ProductJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "ENTITY",
              "name": "ProductCategoryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_category"
            },
            {
              "type": "ENTITY",
              "name": "ProductUomDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_uom"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        },
        {
          "label": "CylinderLazyRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshCylinder"
            },
            {
              "type": "SERVICE",
              "name": "CylinderFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "ENTITY",
              "name": "AssetOwnershipTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_asset_ownership_type"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        },
        {
          "label": "VehicleLazyRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshVehicle"
            },
            {
              "type": "SERVICE",
              "name": "VehicleFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        },
        {
          "label": "DriverLazyRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshDriver"
            },
            {
              "type": "SERVICE",
              "name": "DriverFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "DriverJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_product_category",
        "public.tbl_product_uom",
        "public.tbl_product",
        "public.tbl_asset_ownership_type",
        "public.tbl_cylinder",
        "public.tbl_vehicle",
        "public.tbl_driver",
        "final-version-1/DomainLookup"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-051115.md"
      ]
    },
    {
      "method": "POST",
      "path": "/domainLookup/cylinder/save",
      "controller": "DomainLookupController",
      "controllerMethod": "saveCylinder",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "PersistInitialOwnershipAndYardState",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "SERVICE",
              "name": "CylinderIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CylinderIdentifierJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_identifier"
            },
            {
              "type": "DAO",
              "name": "AssetOwnershipTypeJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_asset_ownership_type"
            },
            {
              "type": "DAO",
              "name": "ProductJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "DAO",
              "name": "ProductUomJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_uom"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "DAO",
              "name": "YardInventoryJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory"
            },
            {
              "type": "DAO",
              "name": "YardInventorySourceTypeJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_source_type"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshCylinder"
            },
            {
              "type": "SERVICE",
              "name": "CylinderFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/domainLookup?tab=cylinder"
            }
          ]
        },
        {
          "label": "ValidationErrorModelRebuild",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "buildValidationErrorMav"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "six lookup getters with lazy refresh"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_cylinder_identifier",
        "public.tbl_asset_ownership_type",
        "public.tbl_product",
        "public.tbl_product_uom",
        "public.tbl_cylinder",
        "public.tbl_yard_inventory",
        "public.tbl_yard_inventory_source_type",
        "public.tbl_cylinder_states",
        "public.tbl_yard_inventory_line",
        "DomainLookup cache dependency set"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-051115.md"
      ]
    },
    {
      "method": "POST",
      "path": "/domainLookup/driver/save",
      "controller": "DomainLookupController",
      "controllerMethod": "saveDriver",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "PersistAndRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "SERVICE",
              "name": "DriverIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "DriverJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshDriver"
            },
            {
              "type": "SERVICE",
              "name": "DriverFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/domainLookup?tab=driver"
            }
          ]
        },
        {
          "label": "ValidationErrorModelRebuild",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "buildValidationErrorMav"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "six lookup getters with lazy refresh"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_driver",
        "DomainLookup cache dependency set"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-051115.md"
      ]
    },
    {
      "method": "POST",
      "path": "/domainLookup/product/save",
      "controller": "DomainLookupController",
      "controllerMethod": "saveProduct",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "PersistAndRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "SERVICE",
              "name": "ProductIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ProductCategoryJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_category"
            },
            {
              "type": "DAO",
              "name": "ProductUomJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_uom"
            },
            {
              "type": "DAO",
              "name": "ProductJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshProduct"
            },
            {
              "type": "SERVICE",
              "name": "ProductFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/domainLookup?tab=product"
            }
          ]
        },
        {
          "label": "ValidationErrorModelRebuild",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "buildValidationErrorMav"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "six lookup getters with lazy refresh"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_product",
        "public.tbl_product_category",
        "public.tbl_product_uom",
        "DomainLookup cache dependency set"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-051115.md"
      ]
    },
    {
      "method": "POST",
      "path": "/domainLookup/productCategory/save",
      "controller": "DomainLookupController",
      "controllerMethod": "saveProductCategory",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "PersistAndRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "saveProductCategory"
            },
            {
              "type": "SERVICE",
              "name": "ProductCategoryIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ProductCategoryJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductCategoryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_category"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshProductCategory"
            },
            {
              "type": "SERVICE",
              "name": "ProductCategoryFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ProductCategoryJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_category"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/domainLookup?tab=productCategory"
            }
          ]
        },
        {
          "label": "ValidationErrorModelRebuild",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "buildValidationErrorMav"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "six lookup getters with lazy refresh"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_product_category",
        "DomainLookup cache dependency set",
        "final-version-1/DomainLookup"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-051115.md"
      ]
    },
    {
      "method": "POST",
      "path": "/domainLookup/productUom/save",
      "controller": "DomainLookupController",
      "controllerMethod": "saveProductUom",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "PersistAndRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "SERVICE",
              "name": "ProductUomIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ProductUomJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ProductUomDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_uom"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshProductUom"
            },
            {
              "type": "SERVICE",
              "name": "ProductUomFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/domainLookup?tab=productUom"
            }
          ]
        },
        {
          "label": "ValidationErrorModelRebuild",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "buildValidationErrorMav"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "six lookup getters with lazy refresh"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_product_uom",
        "DomainLookup cache dependency set"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-051115.md"
      ]
    },
    {
      "method": "POST",
      "path": "/domainLookup/vehicle/save",
      "controller": "DomainLookupController",
      "controllerMethod": "saveVehicle",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "PersistAndRefresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController"
            },
            {
              "type": "SERVICE",
              "name": "VehicleIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshVehicle"
            },
            {
              "type": "SERVICE",
              "name": "VehicleFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/domainLookup?tab=vehicle"
            }
          ]
        },
        {
          "label": "ValidationErrorModelRebuild",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "DomainLookupController",
              "method": "buildValidationErrorMav"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "six lookup getters with lazy refresh"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/DomainLookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle",
        "DomainLookup cache dependency set"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-051115.md"
      ]
    },
    {
      "method": "GET",
      "path": "/login",
      "controller": "LoginController",
      "controllerMethod": "showLoginPage",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Terminal view path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LoginController",
              "method": "showLoginPage"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "LOGIN_FORM_VIEW",
              "method": "ModelAndView return; no service/DAO/database dependency"
            }
          ]
        }
      ],
      "finalDependencies": [
        "LOGIN_FORM_VIEW"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-01"
      ]
    },
    {
      "method": "GET",
      "path": "/lookup",
      "controller": "LookupManagementController",
      "controllerMethod": "legacyRedirect",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "legacy redirect",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "legacyRedirect"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/lookupManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "redirect:/lookupManagement"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "GET",
      "path": "/lookupManagement",
      "controller": "LookupManagementController",
      "controllerMethod": "showLookupPage",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "cache hit",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "showLookupPage"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        },
        {
          "label": "address type lazy refresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "showLookupPage"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getAddressTypes/refreshAddressTypes"
            },
            {
              "type": "SERVICE",
              "name": "AddressTypeFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "AddressTypeJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "AddressTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address_type"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        },
        {
          "label": "country lazy refresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "showLookupPage"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getCountries/refreshCountries"
            },
            {
              "type": "SERVICE",
              "name": "CountryFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CountryJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CountryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_country"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        },
        {
          "label": "state lazy refresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "showLookupPage"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getStates/refreshStates"
            },
            {
              "type": "SERVICE",
              "name": "StateFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "StateJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "StateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_state"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        },
        {
          "label": "city lazy refresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "showLookupPage"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getCities/refreshCities"
            },
            {
              "type": "SERVICE",
              "name": "CityFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CityJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CityDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_address_type",
        "public.tbl_country",
        "public.tbl_state",
        "public.tbl_city",
        "final-version-1/LookupManagement"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "POST",
      "path": "/lookupManagement/addressType/save",
      "controller": "LookupManagementController",
      "controllerMethod": "saveAddressType",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "persist and refresh address type",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveAddressType"
            },
            {
              "type": "SERVICE",
              "name": "AddressTypeIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "AddressTypeJpaDao",
              "method": "findByAddressTypeContainingIgnoreCase / saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "AddressTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address_type"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshAddressTypes"
            },
            {
              "type": "SERVICE",
              "name": "AddressTypeFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "AddressTypeJpaDao",
              "method": "findAll/page query"
            },
            {
              "type": "ENTITY",
              "name": "AddressTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address_type"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/lookupManagement?tab=addressType"
            }
          ]
        },
        {
          "label": "validation error model rebuild potential lazy refreshes",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveAddressType"
            },
            {
              "type": "SERVICE",
              "name": "AddressTypeIngestionService",
              "method": "processRequest validation failure"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "address/country/state/city getters"
            },
            {
              "type": "SERVICE_GROUP",
              "name": "AddressTypeFetchByPageService; CountryFetchByPageService; StateFetchByPageService; CityFetchByPageService"
            },
            {
              "type": "DAO_GROUP",
              "name": "AddressTypeJpaDao; CountryJpaDao; StateJpaDao; CityJpaDao"
            },
            {
              "type": "ENTITY_GROUP",
              "name": "AddressTypeDo; CountryDo; StateDo; CityDo"
            },
            {
              "type": "POSTGRES_TABLE_GROUP",
              "name": "public.tbl_address_type; public.tbl_country; public.tbl_state; public.tbl_city"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_address_type",
        "public.tbl_country",
        "public.tbl_state",
        "public.tbl_city",
        "redirect:/lookupManagement?tab=addressType",
        "final-version-1/LookupManagement"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "POST",
      "path": "/lookupManagement/city/save",
      "controller": "LookupManagementController",
      "controllerMethod": "saveCity",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "persist and refresh city",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveCity"
            },
            {
              "type": "SERVICE",
              "name": "CityIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CityJpaDao",
              "method": "findByCityNameContainingIgnoreCase / saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "CityDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshCities"
            },
            {
              "type": "SERVICE",
              "name": "CityFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CityJpaDao",
              "method": "findAll/page query"
            },
            {
              "type": "ENTITY",
              "name": "CityDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/lookupManagement?tab=city"
            }
          ]
        },
        {
          "label": "validation error model rebuild potential lazy refreshes",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveCity"
            },
            {
              "type": "SERVICE",
              "name": "CityIngestionService",
              "method": "processRequest validation failure"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "address/country/state/city getters"
            },
            {
              "type": "SERVICE_GROUP",
              "name": "AddressTypeFetchByPageService; CountryFetchByPageService; StateFetchByPageService; CityFetchByPageService"
            },
            {
              "type": "DAO_GROUP",
              "name": "AddressTypeJpaDao; CountryJpaDao; StateJpaDao; CityJpaDao"
            },
            {
              "type": "ENTITY_GROUP",
              "name": "AddressTypeDo; CountryDo; StateDo; CityDo"
            },
            {
              "type": "POSTGRES_TABLE_GROUP",
              "name": "public.tbl_address_type; public.tbl_country; public.tbl_state; public.tbl_city"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_address_type",
        "public.tbl_country",
        "public.tbl_state",
        "public.tbl_city",
        "redirect:/lookupManagement?tab=city",
        "final-version-1/LookupManagement"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "POST",
      "path": "/lookupManagement/country/save",
      "controller": "LookupManagementController",
      "controllerMethod": "saveCountry",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "persist and refresh country",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveCountry"
            },
            {
              "type": "SERVICE",
              "name": "CountryIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CountryJpaDao",
              "method": "findByCountryNameContainingIgnoreCase / saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "CountryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_country"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshCountries"
            },
            {
              "type": "SERVICE",
              "name": "CountryFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CountryJpaDao",
              "method": "findAll/page query"
            },
            {
              "type": "ENTITY",
              "name": "CountryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_country"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/lookupManagement?tab=country"
            }
          ]
        },
        {
          "label": "validation error model rebuild potential lazy refreshes",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveCountry"
            },
            {
              "type": "SERVICE",
              "name": "CountryIngestionService",
              "method": "processRequest validation failure"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "address/country/state/city getters"
            },
            {
              "type": "SERVICE_GROUP",
              "name": "AddressTypeFetchByPageService; CountryFetchByPageService; StateFetchByPageService; CityFetchByPageService"
            },
            {
              "type": "DAO_GROUP",
              "name": "AddressTypeJpaDao; CountryJpaDao; StateJpaDao; CityJpaDao"
            },
            {
              "type": "ENTITY_GROUP",
              "name": "AddressTypeDo; CountryDo; StateDo; CityDo"
            },
            {
              "type": "POSTGRES_TABLE_GROUP",
              "name": "public.tbl_address_type; public.tbl_country; public.tbl_state; public.tbl_city"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_address_type",
        "public.tbl_country",
        "public.tbl_state",
        "public.tbl_city",
        "redirect:/lookupManagement?tab=country",
        "final-version-1/LookupManagement"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "POST",
      "path": "/lookupManagement/state/save",
      "controller": "LookupManagementController",
      "controllerMethod": "saveState",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "persist and refresh state",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveState"
            },
            {
              "type": "SERVICE",
              "name": "StateIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "StateJpaDao",
              "method": "findByStateNameContainingIgnoreCase / saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "StateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_state"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "refreshStates"
            },
            {
              "type": "SERVICE",
              "name": "StateFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "StateJpaDao",
              "method": "findAll/page query"
            },
            {
              "type": "ENTITY",
              "name": "StateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_state"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/lookupManagement?tab=state"
            }
          ]
        },
        {
          "label": "validation error model rebuild potential lazy refreshes",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "LookupManagementController",
              "method": "saveState"
            },
            {
              "type": "SERVICE",
              "name": "StateIngestionService",
              "method": "processRequest validation failure"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "address/country/state/city getters"
            },
            {
              "type": "SERVICE_GROUP",
              "name": "AddressTypeFetchByPageService; CountryFetchByPageService; StateFetchByPageService; CityFetchByPageService"
            },
            {
              "type": "DAO_GROUP",
              "name": "AddressTypeJpaDao; CountryJpaDao; StateJpaDao; CityJpaDao"
            },
            {
              "type": "ENTITY_GROUP",
              "name": "AddressTypeDo; CountryDo; StateDo; CityDo"
            },
            {
              "type": "POSTGRES_TABLE_GROUP",
              "name": "public.tbl_address_type; public.tbl_country; public.tbl_state; public.tbl_city"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/LookupManagement"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_address_type",
        "public.tbl_country",
        "public.tbl_state",
        "public.tbl_city",
        "redirect:/lookupManagement?tab=state",
        "final-version-1/LookupManagement"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "GET",
      "path": "/offline-map/status",
      "controller": "OfflineMapController",
      "controllerMethod": "status path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Status path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OfflineMapController",
              "method": "status path"
            },
            {
              "type": "SERVICE",
              "name": "OfflineVectorTileService",
              "method": "fetchStatus()"
            },
            {
              "type": "FILE",
              "name": "Configured MBTiles filesystem path"
            },
            {
              "type": "SQLITE_TABLE",
              "name": "metadata"
            },
            {
              "type": "CLASSPATH_RESOURCE",
              "name": "MapLibre JS/CSS and glyph resources"
            }
          ]
        }
      ],
      "finalDependencies": [
        "MBTiles file",
        "SQLite metadata",
        "MapLibre/glyph classpath resources"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-02"
      ]
    },
    {
      "method": "GET",
      "path": "/offline-map/status-json",
      "controller": "OfflineMapController",
      "controllerMethod": "status-json path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Status JSON path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OfflineMapController",
              "method": "status-json path"
            },
            {
              "type": "SERVICE",
              "name": "OfflineVectorTileService",
              "method": "fetchStatus()"
            },
            {
              "type": "FILE",
              "name": "Configured MBTiles filesystem path"
            },
            {
              "type": "SQLITE_TABLE",
              "name": "metadata"
            },
            {
              "type": "CLASSPATH_RESOURCE",
              "name": "Frontend classpath-resource checks"
            }
          ]
        }
      ],
      "finalDependencies": [
        "MBTiles file",
        "SQLite metadata",
        "frontend classpath resources"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-02"
      ]
    },
    {
      "method": "GET",
      "path": "/offline-map/style.json",
      "controller": "OfflineMapController",
      "controllerMethod": "style path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Style generation path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OfflineMapController",
              "method": "style path"
            },
            {
              "type": "SERVICE",
              "name": "OfflineMapStyleService",
              "method": "buildStyleJson(...)"
            },
            {
              "type": "CONFIGURATION",
              "name": "OfflineMapProperties + request-derived application base URL"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "Generated style JSON response"
            }
          ]
        }
      ],
      "finalDependencies": [
        "OfflineMapProperties",
        "generated JSON"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-02"
      ]
    },
    {
      "method": "GET",
      "path": "/offline-map/vector-tiles/{z}/{x}/{y}.pbf",
      "controller": "OfflineMapController",
      "controllerMethod": "vector-tile path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Vector tile path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OfflineMapController",
              "method": "vector-tile path"
            },
            {
              "type": "SERVICE",
              "name": "OfflineVectorTileService",
              "method": "fetchTile(...)"
            },
            {
              "type": "FILE",
              "name": "Configured MBTiles filesystem file"
            },
            {
              "type": "SQLITE_TABLE",
              "name": "tiles",
              "method": "select tile_data from tiles ..."
            },
            {
              "type": "SQLITE_TABLE",
              "name": "metadata",
              "method": "tile format lookup"
            }
          ]
        }
      ],
      "finalDependencies": [
        "MBTiles file",
        "SQLite tiles",
        "SQLite metadata"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-02"
      ]
    },
    {
      "method": "GET",
      "path": "/ownership-dashboard",
      "controller": "OwnershipDashboardController",
      "controllerMethod": "showOwnershipDashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Ownership summary",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipDashboardController",
              "method": "showOwnershipDashboard"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipDashboardFetchService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "OwnershipSummaryByLocationViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipSummaryByLocationViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_ownership_summary_by_location"
            }
          ]
        },
        {
          "label": "Current cylinder location",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipDashboardController",
              "method": "showOwnershipDashboard"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipDashboardFetchService",
              "method": "fetchOwnershipPage"
            },
            {
              "type": "DAO",
              "name": "OwnershipCurrentCylinderLocationViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipCurrentCylinderLocationViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_ownership_current_cylinder_location"
            }
          ]
        },
        {
          "label": "Party ownership summary",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipDashboardController",
              "method": "showOwnershipDashboard"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipDashboardFetchService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "PartyCylinderDashboardOwnershipViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "PartyCylinderDashboardOwnershipViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_party_cylinder_dashboard_ownership"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-2/OwnershipDashboard_PremiumEnterprise_Fixed"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_ownership_summary_by_location",
        "public.vw_ownership_current_cylinder_location",
        "public.vw_party_cylinder_dashboard_ownership",
        "final-version-2/OwnershipDashboard_PremiumEnterprise_Fixed"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/ownership-dashboard/customer",
      "controller": "OwnershipDashboardController",
      "controllerMethod": "showCustomerOwnership",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Customer ownership",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipDashboardController",
              "method": "showCustomerOwnership"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipDashboardFetchService",
              "method": "fetchByLocation(CUSTOMER)"
            },
            {
              "type": "DAO",
              "name": "OwnershipCurrentCylinderLocationViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipCurrentCylinderLocationViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_ownership_current_cylinder_location"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/OwnershipLocationDetail"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_ownership_current_cylinder_location",
        "with-menu/OwnershipLocationDetail"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/ownership-dashboard/logistics",
      "controller": "OwnershipDashboardController",
      "controllerMethod": "showLogisticsOwnership",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Logistics ownership",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipDashboardController",
              "method": "showLogisticsOwnership"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipDashboardFetchService",
              "method": "fetchByLocation(LOGISTICS)"
            },
            {
              "type": "DAO",
              "name": "OwnershipCurrentCylinderLocationViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipCurrentCylinderLocationViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_ownership_current_cylinder_location"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/OwnershipLocationDetail"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_ownership_current_cylinder_location",
        "with-menu/OwnershipLocationDetail"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/ownership-dashboard/supplier",
      "controller": "OwnershipDashboardController",
      "controllerMethod": "showSupplierOwnership",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Supplier ownership",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipDashboardController",
              "method": "showSupplierOwnership"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipDashboardFetchService",
              "method": "fetchByLocation(SUPPLIER)"
            },
            {
              "type": "DAO",
              "name": "OwnershipCurrentCylinderLocationViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipCurrentCylinderLocationViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_ownership_current_cylinder_location"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/OwnershipLocationDetail"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_ownership_current_cylinder_location",
        "with-menu/OwnershipLocationDetail"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/ownership-dashboard/yard",
      "controller": "OwnershipDashboardController",
      "controllerMethod": "showYardOwnership",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Yard ownership",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipDashboardController",
              "method": "showYardOwnership"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipDashboardFetchService",
              "method": "fetchByLocation(YARD)"
            },
            {
              "type": "DAO",
              "name": "OwnershipCurrentCylinderLocationViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipCurrentCylinderLocationViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_ownership_current_cylinder_location"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/OwnershipLocationDetail"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_ownership_current_cylinder_location",
        "with-menu/OwnershipLocationDetail"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/ownership-obligation-dashboard",
      "controller": "OwnershipObligationDashboardController",
      "controllerMethod": "showOwnershipObligationDashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Ownership obligation detail branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipObligationDashboardController",
              "method": "showOwnershipObligationDashboard"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipObligationDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "OwnershipObligationDetailJpaDao",
              "method": "countByCustodyStatus / countByPartyTypeAndCustodyStatus / countAgingObligations / findDashboardRows"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipObligationDetailViewDo"
            },
            {
              "type": "SUBSELECT",
              "name": "Ownership obligation detail @Subselect"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_party_custody"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_supplier"
            },
            {
              "type": "MAPPER",
              "name": "OwnershipObligationDashboardMapper",
              "method": "mapDetailDosToDtos"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/OwnershipObligationDashboard"
            }
          ]
        },
        {
          "label": "Party summary branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipObligationDashboardController",
              "method": "showOwnershipObligationDashboard"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipObligationDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "OwnershipObligationPartySummaryJpaDao",
              "method": "findTopPartySummaries"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipObligationPartySummaryViewDo"
            },
            {
              "type": "SUBSELECT",
              "name": "Ownership obligation party summary @Subselect"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_party_custody"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_supplier"
            },
            {
              "type": "MAPPER",
              "name": "OwnershipObligationDashboardMapper",
              "method": "mapSummaryDosToDtos"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/OwnershipObligationDashboard"
            }
          ]
        },
        {
          "label": "Closed-today metric branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "OwnershipObligationDashboardController",
              "method": "showOwnershipObligationDashboard"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipObligationDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "OwnershipObligationDetailJpaDao",
              "method": "countClosedTodayObligations"
            },
            {
              "type": "NATIVE_SQL",
              "name": "SELECT COUNT(*) FROM public.tbl_cylinder_party_custody ..."
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_party_custody"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/OwnershipObligationDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_cylinder_party_custody",
        "public.tbl_cylinder",
        "public.tbl_customer",
        "public.tbl_supplier",
        "final-version-1/OwnershipObligationDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-033550.md"
      ]
    },
    {
      "method": "GET",
      "path": "/party-custody-traceability",
      "controller": "PartyCustodyTraceabilityController",
      "controllerMethod": "showTraceability",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Custody detail",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PartyCustodyTraceabilityController",
              "method": "showTraceability"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipObligationDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "OwnershipObligationDetailJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipObligationDetailViewDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_party_custody"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_supplier"
            }
          ]
        },
        {
          "label": "Party summary",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PartyCustodyTraceabilityController",
              "method": "showTraceability"
            },
            {
              "type": "SERVICE",
              "name": "OwnershipObligationDashboardService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "OwnershipObligationPartySummaryJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "OwnershipObligationPartySummaryViewDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_party_custody"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_supplier"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/PartyCustodyTraceabilityDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_cylinder_party_custody",
        "public.tbl_cylinder",
        "public.tbl_customer",
        "public.tbl_supplier",
        "final-version-1/PartyCustodyTraceabilityDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/delivery-planning/predefined-trips",
      "controller": "PredefinedDeliveryTripController",
      "controllerMethod": "page path",
      "state": "COMPLETE",
      "chainCompleteness": "PARTIAL_INTERMEDIATE_HOPS",
      "paths": [
        {
          "label": "Source-proved service/dependency set",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PredefinedDeliveryTripController",
              "method": "page path"
            },
            {
              "type": "SERVICE_GROUP",
              "name": "PredefinedDeliveryTripService",
              "method": "trips / metrics / stopRows"
            },
            {
              "type": "SERVICE",
              "name": "DeliveryPlanningStopService",
              "method": "list"
            },
            {
              "type": "DAO",
              "name": "PredefinedDeliveryTripJpaDao",
              "method": "findActiveTripMetrics() for metrics branch"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_predefined_delivery_trip; public.tbl_predefined_delivery_trip_stop; public.tbl_delivery_planning_stop; public.vw_customer_address_location_status; public.vw_customer_delivery_planning_signal"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_predefined_delivery_trip",
        "public.tbl_predefined_delivery_trip_stop",
        "public.tbl_delivery_planning_stop",
        "public.vw_customer_address_location_status",
        "public.vw_customer_delivery_planning_signal"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-03"
      ]
    },
    {
      "method": "POST",
      "path": "/delivery-planning/predefined-trips/add-stop",
      "controller": "PredefinedDeliveryTripController",
      "controllerMethod": "add-stop path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Predefined trip branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PredefinedDeliveryTripController",
              "method": "add-stop path"
            },
            {
              "type": "SERVICE",
              "name": "PredefinedDeliveryTripService",
              "method": "addStop"
            },
            {
              "type": "DAO",
              "name": "PredefinedDeliveryTripJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "PredefinedDeliveryTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_predefined_delivery_trip"
            }
          ]
        },
        {
          "label": "Delivery planning stop branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PredefinedDeliveryTripController",
              "method": "add-stop path"
            },
            {
              "type": "SERVICE",
              "name": "PredefinedDeliveryTripService",
              "method": "addStop"
            },
            {
              "type": "DAO",
              "name": "DeliveryPlanningStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DeliveryPlanningStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_delivery_planning_stop"
            }
          ]
        },
        {
          "label": "Trip stop branch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PredefinedDeliveryTripController",
              "method": "add-stop path"
            },
            {
              "type": "SERVICE",
              "name": "PredefinedDeliveryTripService",
              "method": "addStop"
            },
            {
              "type": "DAO",
              "name": "PredefinedDeliveryTripStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "PredefinedDeliveryTripStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_predefined_delivery_trip_stop"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_predefined_delivery_trip",
        "public.tbl_delivery_planning_stop",
        "public.tbl_predefined_delivery_trip_stop"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-03"
      ]
    },
    {
      "method": "POST",
      "path": "/delivery-planning/predefined-trips/create",
      "controller": "PredefinedDeliveryTripController",
      "controllerMethod": "create path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Create",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PredefinedDeliveryTripController",
              "method": "create path"
            },
            {
              "type": "SERVICE",
              "name": "PredefinedDeliveryTripService",
              "method": "create"
            },
            {
              "type": "DAO",
              "name": "PredefinedDeliveryTripJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "PredefinedDeliveryTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_predefined_delivery_trip"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_predefined_delivery_trip"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-03"
      ]
    },
    {
      "method": "POST",
      "path": "/delivery-planning/predefined-trips/remove",
      "controller": "PredefinedDeliveryTripController",
      "controllerMethod": "remove path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Deactivate trip",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PredefinedDeliveryTripController",
              "method": "remove path"
            },
            {
              "type": "SERVICE",
              "name": "PredefinedDeliveryTripService",
              "method": "deactivate"
            },
            {
              "type": "DAO",
              "name": "PredefinedDeliveryTripJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "PredefinedDeliveryTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_predefined_delivery_trip"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_predefined_delivery_trip"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-03"
      ]
    },
    {
      "method": "POST",
      "path": "/delivery-planning/predefined-trips/remove-stop",
      "controller": "PredefinedDeliveryTripController",
      "controllerMethod": "remove-stop path",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Remove stop",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "PredefinedDeliveryTripController",
              "method": "remove-stop path"
            },
            {
              "type": "SERVICE",
              "name": "PredefinedDeliveryTripService",
              "method": "removeStop / resequence"
            },
            {
              "type": "DAO",
              "name": "PredefinedDeliveryTripStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "PredefinedDeliveryTripStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_predefined_delivery_trip_stop"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_predefined_delivery_trip_stop"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-160000.md#LANE-03"
      ]
    },
    {
      "method": "GET",
      "path": "/reconciliation-command-center",
      "controller": "ReconciliationCommandCenterController",
      "controllerMethod": "showCommandCenter",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Summary and trip rows",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ReconciliationCommandCenterController",
              "method": "showCommandCenter"
            },
            {
              "type": "SERVICE",
              "name": "ReconciliationCommandCenterService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "ReconciliationHeaderJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationHeaderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_header"
            },
            {
              "type": "DAO",
              "name": "TripChallanEntryTrackerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "TripChallanEntryTrackerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_challan_entry_tracker"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/ReconciliationCommandCenter"
            }
          ]
        },
        {
          "label": "Optional trip event detail",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ReconciliationCommandCenterController",
              "method": "showCommandCenter"
            },
            {
              "type": "SERVICE",
              "name": "ReconciliationCommandCenterService",
              "method": "fetchDashboard when tripId != null"
            },
            {
              "type": "DAO",
              "name": "ReconciliationEventLogJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationEventLogDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_event_log"
            },
            {
              "type": "DAO",
              "name": "ReconciliationStatusAuditJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationStatusAuditDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_status_audit"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_reconciliation_header",
        "public.tbl_trip_challan_entry_tracker",
        "public.tbl_reconciliation_event_log",
        "public.tbl_reconciliation_status_audit",
        "with-menu/ReconciliationCommandCenter"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/reconciliation-command-center/details",
      "controller": "ReconciliationCommandCenterController",
      "controllerMethod": "showTripDetails",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Trip reconciliation details",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ReconciliationCommandCenterController",
              "method": "showTripDetails"
            },
            {
              "type": "SERVICE",
              "name": "ReconciliationCommandCenterService",
              "method": "fetchDashboard"
            },
            {
              "type": "DAO",
              "name": "ReconciliationHeaderJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationHeaderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_header"
            },
            {
              "type": "DAO",
              "name": "TripChallanEntryTrackerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "TripChallanEntryTrackerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_challan_entry_tracker"
            },
            {
              "type": "DAO",
              "name": "ReconciliationEventLogJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationEventLogDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_event_log"
            },
            {
              "type": "DAO",
              "name": "ReconciliationStatusAuditJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationStatusAuditDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_status_audit"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/ReconciliationCommandCenterDetails"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_reconciliation_header",
        "public.tbl_trip_challan_entry_tracker",
        "public.tbl_reconciliation_event_log",
        "public.tbl_reconciliation_status_audit",
        "with-menu/ReconciliationCommandCenterDetails"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/reconciliation-dashboard",
      "controller": "ReconciliationDashboardController",
      "controllerMethod": "viewDashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "dashboard fetch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ReconciliationDashboardController",
              "method": "viewDashboard"
            },
            {
              "type": "SERVICE",
              "name": "ReconciliationDashboardService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ReconciliationCheckpointJpaDao",
              "method": "findByCheckpointDate"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationCheckpointDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_checkpoint"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/reconciliation_checkpoint_dashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_reconciliation_checkpoint",
        "final-version-1/reconciliation_checkpoint_dashboard"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "POST",
      "path": "/reconciliation-dashboard/search",
      "controller": "ReconciliationDashboardController",
      "controllerMethod": "searchDashboard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "dashboard search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ReconciliationDashboardController",
              "method": "searchDashboard"
            },
            {
              "type": "SERVICE",
              "name": "ReconciliationDashboardService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "ReconciliationCheckpointJpaDao",
              "method": "findByCheckpointDate"
            },
            {
              "type": "ENTITY",
              "name": "ReconciliationCheckpointDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_reconciliation_checkpoint"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/reconciliation_checkpoint_dashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_reconciliation_checkpoint",
        "final-version-1/reconciliation_checkpoint_dashboard"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "GET",
      "path": "/search/address/customer-address/{customerId}",
      "controller": "RestfulAddressServices",
      "controllerMethod": "getCustomerAddressByCustomerId",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Valid customer id",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulAddressServices",
              "method": "getCustomerAddressByCustomerId"
            },
            {
              "type": "SERVICE_INTERFACE",
              "name": "ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto,CustomerAddressSearchResponseDto>",
              "method": "searchWithText"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressFetchByIDService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressJpaDao",
              "method": "findByCustomer_CustomerId"
            },
            {
              "type": "ENTITY_SET",
              "name": "CustomerAddressDo; CustomerDo; AddressDo"
            },
            {
              "type": "MAPPER_SET",
              "name": "CustomerAddressMapper; AddressMapper"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_customer_address; public.tbl_customer; public.tbl_address"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CustomerAddressSearchResponseDto"
            }
          ]
        },
        {
          "label": "Blank customer id",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulAddressServices",
              "method": "getCustomerAddressByCustomerId"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "null response body"
            }
          ]
        },
        {
          "label": "Invalid numeric id / service exception",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulAddressServices",
              "method": "getCustomerAddressByCustomerId"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressFetchByIDService",
              "method": "searchWithText"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "empty CustomerAddressSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer_address",
        "public.tbl_customer",
        "public.tbl_address",
        "CustomerAddressSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-231647.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/addresstype/{searchText}",
      "controller": "RestfulAddressTypeServices",
      "controllerMethod": "getAddressTypes",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Address type search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulAddressTypeServices",
              "method": "getAddressTypes"
            },
            {
              "type": "SERVICE",
              "name": "AddressTypeSearchService",
              "method": "searchWithText"
            },
            {
              "type": "VALIDATOR",
              "name": "SearchRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "AddressTypeJpaDao",
              "method": "findByAddressTypeContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "AddressTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address_type"
            },
            {
              "type": "MAPPER_INTERFACE",
              "name": "ICylindermanagementApplicationDoToDtoMapper<AddressTypeDto, AddressTypeDo>",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "AddressTypeSearchResponseDto",
              "method": "success DTO or empty DTO on service exception"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_address_type",
        "AddressTypeSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-233707.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/challantype/{searchText}",
      "controller": "RestfulChallanTypeServices",
      "controllerMethod": "getChallanTypes",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Challan type search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulChallanTypeServices",
              "method": "getChallanTypes"
            },
            {
              "type": "SERVICE",
              "name": "ChallanTypeSearchService",
              "method": "searchWithText"
            },
            {
              "type": "VALIDATOR",
              "name": "SearchRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "ChallanTypeJpaDao",
              "method": "findByChallanTypeContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "ChallanTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_type"
            },
            {
              "type": "MAPPER_INTERFACE",
              "name": "ICylindermanagementApplicationDoToDtoMapper<ChallanTypeDto, ChallanTypeDo>",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "ChallanTypeSearchResponseDto",
              "method": "success DTO or empty DTO on service exception"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_type",
        "ChallanTypeSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-233707.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/city/{searchText}",
      "controller": "RestfulCityServices",
      "controllerMethod": "getCities",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "City search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCityServices",
              "method": "getCities"
            },
            {
              "type": "SERVICE",
              "name": "CitySearchService",
              "method": "searchWithText"
            },
            {
              "type": "VALIDATOR",
              "name": "SearchRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CityJpaDao",
              "method": "findByCityNameContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CityDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            },
            {
              "type": "MAPPER_INTERFACE",
              "name": "ICylindermanagementApplicationDoToDtoMapper<CityDto, CityDo>",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CitySearchResponseDto",
              "method": "success DTO or empty DTO on service exception"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_city",
        "CitySearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-233707.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/country/{searchText}",
      "controller": "RestfulCountryServices",
      "controllerMethod": "getCountries",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Country search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCountryServices",
              "method": "getCountries"
            },
            {
              "type": "SERVICE",
              "name": "CountrySearchService",
              "method": "searchWithText"
            },
            {
              "type": "VALIDATOR",
              "name": "SearchRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CountryJpaDao",
              "method": "findByCountryNameContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CountryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_country"
            },
            {
              "type": "MAPPER_INTERFACE",
              "name": "ICylindermanagementApplicationDoToDtoMapper<CountryDto, CountryDo>",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CountrySearchResponsesDto",
              "method": "success DTO or empty DTO on service exception"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_country",
        "CountrySearchResponsesDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-233707.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/customer/{searchText}",
      "controller": "RestfulCustomerServices",
      "controllerMethod": "getCustomers",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Customer search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCustomerServices",
              "method": "getCustomers"
            },
            {
              "type": "SERVICE",
              "name": "CustomerSearchService",
              "method": "searchWithText"
            },
            {
              "type": "VALIDATOR",
              "name": "SearchRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findByCustomerNameContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "MAPPER",
              "name": "CustomerMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CustomerSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "CustomerSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-000044.md"
      ]
    },
    {
      "method": "POST",
      "path": "/search/cylinder/by-customer",
      "controller": "RestfulCylinderServices",
      "controllerMethod": "getCylindersByCustomer",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Active customer custody search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCylinderServices",
              "method": "getCylindersByCustomer"
            },
            {
              "type": "SERVICE",
              "name": "CylindersByCustomerSearchServiceWithOwnershipModel",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "CustomerHeldCylinderSearchJpaDao",
              "method": "findActiveCustomerHeldCylinders"
            },
            {
              "type": "POSTGRES_VIEW",
              "name": "public.vw_cylinder_party_custody_with_identifiers"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CylinderSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_cylinder_party_custody_with_identifiers",
        "public.tbl_cylinder",
        "public.tbl_product",
        "CylinderSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-001738.md"
      ]
    },
    {
      "method": "POST",
      "path": "/search/cylinder/by-serial-and-state",
      "controller": "RestfulCylinderServices",
      "controllerMethod": "getCylinderBySerialAndState",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "State validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCylinderServices",
              "method": "getCylinderBySerialAndState"
            },
            {
              "type": "SERVICE",
              "name": "CylinderCurrentOwnershipBySerialAndStateSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao",
              "method": "findByCylinderStateIn"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            }
          ]
        },
        {
          "label": "Identifier/state search",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "CylinderCurrentOwnershipBySerialAndStateSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "CylinderGlobalSearchViewJpaDao",
              "method": "searchBySerialAndStateNames"
            },
            {
              "type": "ENTITY",
              "name": "CylinderGlobalSearchViewDo"
            },
            {
              "type": "POSTGRES_VIEW",
              "name": "public.vw_cylinder_global_search"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CylinderSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_cylinder_states",
        "public.vw_cylinder_global_search",
        "CylinderSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-001738.md"
      ]
    },
    {
      "method": "POST",
      "path": "/search/cylinder/by-state",
      "controller": "RestfulCylinderServices",
      "controllerMethod": "getCylindersByState",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "YardStock",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCylinderServices",
              "method": "getCylindersByState"
            },
            {
              "type": "SERVICE",
              "name": "AvailableYardCylinderByStateSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao",
              "method": "findYardProductWiseEmptyFullCounts / findActiveYardCylindersByStateNames*"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "DAO",
              "name": "CylinderIdentifierJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderIdentifierDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_identifier"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "YardCylinderStockResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_yard_inventory_line",
        "public.tbl_cylinder",
        "public.tbl_cylinder_identifier",
        "YardCylinderStockResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031101.md"
      ]
    },
    {
      "method": "POST",
      "path": "/search/cylinder/by-supplier",
      "controller": "RestfulCylinderServices",
      "controllerMethod": "getCylindersBySupplier",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Active supplier custody search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCylinderServices",
              "method": "getCylindersBySupplier"
            },
            {
              "type": "SERVICE",
              "name": "CylindersBySupplierSearchServiceWithOwnershipModel",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "SupplierHeldCylinderSearchJpaDao",
              "method": "findActiveSupplierHeldCylinders"
            },
            {
              "type": "POSTGRES_VIEW",
              "name": "public.vw_cylinder_party_custody_with_identifiers"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CylinderSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_cylinder_party_custody_with_identifiers",
        "public.tbl_cylinder",
        "public.tbl_product",
        "CylinderSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-001738.md"
      ]
    },
    {
      "method": "POST",
      "path": "/search/cylinder/on-vehicle",
      "controller": "RestfulCylinderServices",
      "controllerMethod": "getCylindersOnVehicle",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "VehicleContents",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCylinderServices",
              "method": "getCylindersOnVehicle"
            },
            {
              "type": "SERVICE",
              "name": "CylindersOnVehicleSearchServiceWithOwnershipModel",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionLineJpaDao",
              "method": "findActiveVehicleContents"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution_line"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "DAO",
              "name": "CylinderIdentifierJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderIdentifierDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_identifier"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CylinderSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_cylinder_logistics_execution_line",
        "public.tbl_cylinder",
        "public.tbl_cylinder_identifier",
        "CylinderSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031101.md"
      ]
    },
    {
      "method": "POST",
      "path": "/search/cylinder/ownership/by-state",
      "controller": "RestfulCylinderServices",
      "controllerMethod": "getCylindersByStateUsingOwnershipModel",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "OwnershipByState",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCylinderServices",
              "method": "getCylindersByStateUsingOwnershipModel"
            },
            {
              "type": "SERVICE",
              "name": "CylinderCurrentOwnershipByStateSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "CylinderGlobalSearchViewJpaDao",
              "method": "searchByStateNames"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "CylinderGlobalSearchViewDo"
            },
            {
              "type": "POSTGRES_VIEW",
              "name": "public.vw_cylinder_global_search"
            },
            {
              "type": "MAPPER",
              "name": "CylinderDtoIdentifierMappingUtil",
              "method": "fromGlobalSearchRow"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CylinderSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_cylinder_global_search",
        "CylinderSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-031101.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/cylinder/{searchText}",
      "controller": "RestfulCylinderServices",
      "controllerMethod": "getCylinders",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Ownership-model global cylinder search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulCylinderServices",
              "method": "getCylinders"
            },
            {
              "type": "SERVICE",
              "name": "CylinderSearchServiceWithOwnershipModel",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "CylinderGlobalSearchViewJpaDao",
              "method": "searchBySerial"
            },
            {
              "type": "ENTITY",
              "name": "CylinderGlobalSearchViewDo"
            },
            {
              "type": "POSTGRES_VIEW",
              "name": "public.vw_cylinder_global_search"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "CylinderSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_cylinder_global_search",
        "CylinderSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-001738.md"
      ]
    },
    {
      "method": "GET",
      "path": "/find/Driver-by-Id/{driverId}",
      "controller": "RestfulDriverServices",
      "controllerMethod": "getDriverById",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Driver by id",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulDriverServices",
              "method": "getDriverById"
            },
            {
              "type": "SERVICE",
              "name": "DriverFetchByIdService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "DriverJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "MAPPER",
              "name": "DriverMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "DriverFetchByIdResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_driver",
        "DriverFetchByIdResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-000044.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/driver/{searchText}",
      "controller": "RestfulDriverServices",
      "controllerMethod": "getDrivers",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Driver search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulDriverServices",
              "method": "getDrivers"
            },
            {
              "type": "SERVICE",
              "name": "DriverSearchService",
              "method": "searchWithText"
            },
            {
              "type": "VALIDATOR",
              "name": "SearchRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "DriverJpaDao",
              "method": "findByDriverNameContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "MAPPER",
              "name": "DriverMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "DriverSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_driver",
        "DriverSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-000044.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/product-category/{searchText}",
      "controller": "RestfulProductCategoryServices",
      "controllerMethod": "getProductCategories",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulProductCategoryServices",
              "method": "getProductCategories"
            },
            {
              "type": "SERVICE",
              "name": "ProductCategorySearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "ProductCategoryJpaDao",
              "method": "findByProductCategoryContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "ProductCategoryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_category"
            },
            {
              "type": "MAPPER",
              "name": "ProductCategoryMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "ProductCategorySearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_product_category",
        "ProductCategorySearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-003910.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/product/{searchText}",
      "controller": "RestfulProductServices",
      "controllerMethod": "getProducts",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulProductServices",
              "method": "getProducts"
            },
            {
              "type": "SERVICE",
              "name": "ProductSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "ProductJpaDao",
              "method": "findByProductNameContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "ProductDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            },
            {
              "type": "MAPPER",
              "name": "ProductMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "ProductSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_product",
        "ProductSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-003910.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/product-uom/{searchText}",
      "controller": "RestfulProductUomServices",
      "controllerMethod": "getProductUoms",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulProductUomServices",
              "method": "getProductUoms"
            },
            {
              "type": "SERVICE",
              "name": "ProductUomSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "ProductUomJpaDao",
              "method": "findByProductUomContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "ProductUomDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product_uom"
            },
            {
              "type": "MAPPER",
              "name": "ProductUomMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "ProductUomSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_product_uom",
        "ProductUomSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-003910.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/state/{searchText}",
      "controller": "RestfulStateServices",
      "controllerMethod": "getStates",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulStateServices",
              "method": "getStates"
            },
            {
              "type": "SERVICE",
              "name": "StateSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "StateJpaDao",
              "method": "findByStateNameContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "StateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_state"
            },
            {
              "type": "MAPPER",
              "name": "StateMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "StateSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_state",
        "StateSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-003910.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/supplier/{searchText}",
      "controller": "RestfulSupplierSearchService",
      "controllerMethod": "getSuppliers",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulSupplierSearchService",
              "method": "getSuppliers"
            },
            {
              "type": "SERVICE",
              "name": "SupplierSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "SupplierJpaDao",
              "method": "findBySupplierNameContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "SupplierDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_supplier"
            },
            {
              "type": "MAPPER",
              "name": "SupplierMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "SupplierSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_supplier",
        "SupplierSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-003910.md"
      ]
    },
    {
      "method": "GET",
      "path": "/find/Vehicle-by-Id/{vehicleId}",
      "controller": "RestfulVehicleServices",
      "controllerMethod": "getVehicleById",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "FetchById",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulVehicleServices",
              "method": "getVehicleById"
            },
            {
              "type": "SERVICE",
              "name": "VehicleFetchByIdService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            },
            {
              "type": "MAPPER",
              "name": "VehicleMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "VehicleFetchByIdResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle",
        "VehicleFetchByIdResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-020259.md"
      ]
    },
    {
      "method": "GET",
      "path": "/search/vehicle/{searchText}",
      "controller": "RestfulVehicleServices",
      "controllerMethod": "getVehicles",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Search",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "RestfulVehicleServices",
              "method": "getVehicles"
            },
            {
              "type": "SERVICE",
              "name": "VehicleSearchService",
              "method": "searchWithText"
            },
            {
              "type": "DAO",
              "name": "VehicleJpaDao",
              "method": "findByVehicleNumberContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            },
            {
              "type": "MAPPER",
              "name": "VehicleMapper",
              "method": "mapDoToDto"
            },
            {
              "type": "TERMINAL_JSON",
              "name": "VehicleSearchResponseDto"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle",
        "VehicleSearchResponseDto"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-020259.md"
      ]
    },
    {
      "method": "GET",
      "path": "/fetchSupplierByPage",
      "controller": "SupplierFetchByPageController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Supplier page and mapped relations",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "SupplierFetchByPageController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "SupplierFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "SupplierJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "SupplierDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_supplier"
            },
            {
              "type": "ENTITY",
              "name": "AddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            },
            {
              "type": "ENTITY",
              "name": "CityDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            },
            {
              "type": "ENTITY",
              "name": "StateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_state"
            },
            {
              "type": "ENTITY",
              "name": "CountryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_country"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/SupplierListPage"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_supplier",
        "public.tbl_address",
        "public.tbl_phone_number",
        "public.tbl_city",
        "public.tbl_state",
        "public.tbl_country",
        "final-version-1/SupplierListPage",
        "redirect:/fetchSupplierByPage?..."
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/ingestSupplier",
      "controller": "SupplierIngestionController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Blank supplier form",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "SupplierIngestionController",
              "method": "doGet"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/SupplierIngestion"
            }
          ]
        }
      ],
      "finalDependencies": [
        "with-menu/SupplierIngestion"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-191248.md"
      ]
    },
    {
      "method": "POST",
      "path": "/ingestSupplier",
      "controller": "SupplierIngestionController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Reference reads and supplier persistence",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "SupplierIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "SupplierIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CityJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CityDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            },
            {
              "type": "DAO",
              "name": "StateJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "StateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_state"
            },
            {
              "type": "DAO",
              "name": "CountryJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CountryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_country"
            },
            {
              "type": "DAO",
              "name": "SupplierJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "SupplierDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_supplier"
            },
            {
              "type": "ENTITY",
              "name": "AddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:HOME or with-menu/SupplierIngestion"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_city",
        "public.tbl_state",
        "public.tbl_country",
        "public.tbl_supplier",
        "public.tbl_address",
        "public.tbl_phone_number",
        "with-menu/SupplierIngestion",
        "redirect:HOME"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-191248.md"
      ]
    },
    {
      "method": "POST",
      "path": "/setCustomerActive",
      "controller": "ToggleCustomerActiveStatusController",
      "controllerMethod": "setCustomerActive",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Activate customer",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ToggleCustomerActiveStatusController",
              "method": "setCustomerActive"
            },
            {
              "type": "SERVICE",
              "name": "CustomerActiveStateUpdateService",
              "method": "updateActiveStatus(customerId,true)"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "updateActiveStatus(id,status)"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/fetchCustomerByPage?pageNumber=...&itemsPerPage=...[&searchTerm=...]"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "redirect:/fetchCustomerByPage"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-190650.md"
      ]
    },
    {
      "method": "POST",
      "path": "/setCustomerInactive",
      "controller": "ToggleCustomerActiveStatusController",
      "controllerMethod": "setCustomerInactive",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Deactivate customer",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "ToggleCustomerActiveStatusController",
              "method": "setCustomerInactive"
            },
            {
              "type": "SERVICE",
              "name": "CustomerActiveStateUpdateService",
              "method": "updateActiveStatus(customerId,false)"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "updateActiveStatus(id,status)"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/fetchCustomerByPage?pageNumber=...&itemsPerPage=...[&searchTerm=...]"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "redirect:/fetchCustomerByPage"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-190650.md"
      ]
    },
    {
      "method": "GET",
      "path": "/trip-return",
      "controller": "TripReturnController",
      "controllerMethod": "showReturnPage",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Trip header",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReturnController",
              "method": "showReturnPage"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "loadReturnPage"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            }
          ]
        },
        {
          "label": "Returned challan books",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReturnController",
              "method": "showReturnPage"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "loadReturnPage"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "TripChallanBookAssignmentViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_challan_book_assignments"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            },
            {
              "type": "DAO",
              "name": "ChallanPagePhotoJpaDao"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_photo"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/TripReturnChallanBookReview"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_trip",
        "public.tbl_trip_status",
        "public.tbl_vehicle",
        "public.tbl_driver",
        "public.vw_trip_challan_book_assignments",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_challan_page_photo",
        "final-version-1/TripReturnChallanBookReview"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "POST",
      "path": "/trip-return",
      "controller": "TripReturnController",
      "controllerMethod": "returnTripAndBooks",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Challan page state updates",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReturnController",
              "method": "returnTripAndBooks"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "returnTripAndBooks"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            }
          ]
        },
        {
          "label": "Book assignment return",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReturnController",
              "method": "returnTripAndBooks"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "returnTripAndBooks"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "TripChallanBookAssignmentDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_challan_book_assignment"
            },
            {
              "type": "DAO",
              "name": "ChallanBookRegistryJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "ChallanBookRegistryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_book_registry"
            }
          ]
        },
        {
          "label": "Trip status transition",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReturnController",
              "method": "returnTripAndBooks"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "returnTripAndBooks"
            },
            {
              "type": "DAO",
              "name": "VehicleTripJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStatusJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "redirect:/vehicle-loads/list"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_trip_challan_book_assignment",
        "public.tbl_challan_book_registry",
        "public.tbl_vehicle_trip",
        "public.tbl_trip_status",
        "redirect:/vehicle-loads/list",
        "final-version-1/TripReturnChallanBookReview"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/trip-review",
      "controller": "TripReviewController",
      "controllerMethod": "showReviewQueue",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Review queue",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReviewController",
              "method": "showReviewQueue"
            },
            {
              "type": "SERVICE",
              "name": "TripReviewFetchService",
              "method": "fetchNotReviewedTrips"
            },
            {
              "type": "DAO",
              "name": "TripReviewHeaderViewJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "TripReviewHeaderViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_review_header"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/TripReviewList"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_trip_review_header",
        "with-menu/TripReviewList"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/trip-review/{vehicleTripId}",
      "controller": "TripReviewController",
      "controllerMethod": "showTripReview",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Header",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReviewController",
              "method": "showTripReview"
            },
            {
              "type": "SERVICE",
              "name": "TripReviewFetchService",
              "method": "fetchTripReview"
            },
            {
              "type": "DAO",
              "name": "TripReviewHeaderViewJpaDao",
              "method": "findByVehicleTripId"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "TripReviewHeaderViewDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_review_header"
            }
          ]
        },
        {
          "label": "Stops and challan identity",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "TripReviewFetchService",
              "method": "fetchTripReview"
            },
            {
              "type": "DAO",
              "name": "TripReviewDirectDetailJpaDao",
              "method": "findStopsByVehicleTripId / findChallanPhotosByVehicleTripId"
            },
            {
              "type": "PROJECTION",
              "name": "TripReviewStopProjectionDo / TripReviewChallanPhotoProjectionDo"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_vehicle_trip_stop; public.tbl_stop_type; public.tbl_customer; public.tbl_supplier; public.tbl_challan_transaction_link; public.tbl_challan_page_audit_ledger; public.tbl_challan_book_registry; public.tbl_challan_page_photo"
            }
          ]
        },
        {
          "label": "Cylinder movement and accountability",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "TripReviewFetchService",
              "method": "fetchTripReview"
            },
            {
              "type": "DAO",
              "name": "TripReviewDirectDetailJpaDao",
              "method": "movement/accountability queries"
            },
            {
              "type": "PROJECTION",
              "name": "TripReviewCylinderMovementProjectionDo"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_vehicle_load; public.tbl_vehicle_load_line; public.tbl_cylinder_logistics_execution; public.tbl_cylinder_logistics_execution_line; public.tbl_cylinder; public.tbl_product; public.tbl_vehicle_load_purpose; public.tbl_order; public.tbl_order_line; public.tbl_empty_pickup; public.tbl_empty_pickup_line; public.tbl_supplier_trip; public.tbl_supplier_trip_line; public.tbl_supplier_refill_collection; public.tbl_supplier_refill_collection_line; public.tbl_cylinder_states; public.tbl_yard_inventory_line; public.tbl_vehicle_trip; public.fn_trip_load_accountability"
            }
          ]
        },
        {
          "label": "Custody synchronization",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "TripReviewFetchService",
              "method": "fetchTripReview"
            },
            {
              "type": "DAO",
              "name": "TripReviewDirectDetailJpaDao",
              "method": "findPartyCustodySyncRows / findActiveLogisticsSyncRows"
            },
            {
              "type": "PROJECTION",
              "name": "TripReviewCustodySyncProjectionDo"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_cylinder_party_custody plus the source transaction/load/logistics tables and public.fn_trip_load_accountability"
            }
          ]
        },
        {
          "label": "Trip review map",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "TripReviewFetchService",
              "method": "fetchTripReview"
            },
            {
              "type": "SERVICE",
              "name": "CustomerAddressLocationOfflineMapService",
              "method": "fetchTripReviewMap"
            },
            {
              "type": "DAO",
              "name": "YardLocationJpaDao",
              "method": "findActiveYardLocations"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_yard_location; public.tbl_yard_inventory"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressLocationJpaDao",
              "method": "findTripReviewCustomerStopLocations"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_trip_review_customer_stop_location"
            }
          ]
        },
        {
          "label": "Terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReviewController",
              "method": "showTripReview"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/TripReviewDashboard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_trip_review_header",
        "public.tbl_vehicle_trip_stop",
        "public.tbl_stop_type",
        "public.tbl_customer",
        "public.tbl_supplier",
        "public.tbl_challan_transaction_link",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_challan_book_registry",
        "public.tbl_challan_page_photo",
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_load_line",
        "public.tbl_cylinder_logistics_execution",
        "public.tbl_cylinder_logistics_execution_line",
        "public.tbl_cylinder",
        "public.tbl_product",
        "public.tbl_vehicle_load_purpose",
        "public.tbl_order",
        "public.tbl_order_line",
        "public.tbl_empty_pickup",
        "public.tbl_empty_pickup_line",
        "public.tbl_supplier_trip",
        "public.tbl_supplier_trip_line",
        "public.tbl_supplier_refill_collection",
        "public.tbl_supplier_refill_collection_line",
        "public.tbl_cylinder_states",
        "public.tbl_yard_inventory_line",
        "public.tbl_vehicle_trip",
        "public.tbl_cylinder_party_custody",
        "public.fn_trip_load_accountability",
        "public.tbl_yard_location",
        "public.tbl_yard_inventory",
        "public.vw_trip_review_customer_stop_location",
        "with-menu/TripReviewDashboard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-170049.md"
      ]
    },
    {
      "method": "POST",
      "path": "/trip-review/{vehicleTripId}/close-review",
      "controller": "TripReviewController",
      "controllerMethod": "closeReview",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Review close update",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "TripReviewController",
              "method": "closeReview"
            },
            {
              "type": "SERVICE",
              "name": "TripReviewUpdateService",
              "method": "closeReview"
            },
            {
              "type": "DAO",
              "name": "VehicleTripReviewJpaDao",
              "method": "markTripReviewed"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip",
              "method": "native UPDATE"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_review_status",
              "method": "REVIEWED / NOT_REVIEWED status lookup"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/trip-review/{vehicleTripId}",
              "method": "success or error flash message"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_trip",
        "public.tbl_vehicle_review_status",
        "redirect:/trip-review/{vehicleTripId}"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-213728.md"
      ]
    },
    {
      "method": "GET",
      "path": "/registerCustomer",
      "controller": "UC01RegisterCustomerController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Cache hit",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doGet"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getAddressTypes()"
            },
            {
              "type": "IN_MEMORY_DATA",
              "name": "addressTypes"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/UC01RegisterCustomer"
            }
          ]
        },
        {
          "label": "Cache miss / lazy reload",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doGet"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getAddressTypes()"
            },
            {
              "type": "CACHE_REFRESH",
              "name": "LookupDataCache",
              "method": "refreshAddressTypes()"
            },
            {
              "type": "SERVICE",
              "name": "AddressTypeFetchByPageService",
              "method": "processRequest(...)"
            },
            {
              "type": "DAO",
              "name": "AddressTypeJpaDao",
              "method": "findAll(pageable)"
            },
            {
              "type": "ENTITY",
              "name": "AddressTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address_type"
            },
            {
              "type": "IN_MEMORY_DATA",
              "name": "addressTypes"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/UC01RegisterCustomer"
            }
          ]
        }
      ],
      "finalDependencies": [
        "in-memory addressTypes",
        "public.tbl_address_type",
        "final-version-1/UC01RegisterCustomer"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-093200.md"
      ]
    },
    {
      "method": "POST",
      "path": "/registerCustomer",
      "controller": "UC01RegisterCustomerController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Address-type cache hit",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost / resolveAddressTypes"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getAddressTypes"
            },
            {
              "type": "IN_MEMORY_TERMINAL",
              "name": "addressTypes"
            }
          ]
        },
        {
          "label": "Address-type cache-miss fallback",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost / resolveAddressTypes"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getAddressTypes / refreshAddressTypes"
            },
            {
              "type": "SERVICE",
              "name": "AddressTypeFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "AddressTypeJpaDao",
              "method": "findAll(Pageable)"
            },
            {
              "type": "ENTITY",
              "name": "AddressTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address_type"
            }
          ]
        },
        {
          "label": "GST uniqueness validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CustomerIngestionRequstValidator",
              "method": "validate"
            },
            {
              "type": "SERVICE_UTILITY",
              "name": "CustomerDetailsExistenceUtility",
              "method": "isGstNumberExists"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "existsByGstNumberIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            }
          ]
        },
        {
          "label": "Phone uniqueness validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CustomerIngestionRequstValidator",
              "method": "validate"
            },
            {
              "type": "SERVICE_UTILITY",
              "name": "CustomerDetailsExistenceUtility",
              "method": "isPhoneNumberExists"
            },
            {
              "type": "DAO",
              "name": "PhoneNumberJpaDao",
              "method": "existsByPhoneNumber"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            }
          ]
        },
        {
          "label": "City reference read",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CityJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CityDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_city"
            }
          ]
        },
        {
          "label": "State reference read",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "StateJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "StateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_state"
            }
          ]
        },
        {
          "label": "Country reference read",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CountryJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CountryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_country"
            }
          ]
        },
        {
          "label": "Customer and address cascade write",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo",
              "method": "CustomerDo.customerAddresses cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "ENTITY",
              "name": "AddressDo",
              "method": "CustomerAddressDo.address cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_address"
            }
          ]
        },
        {
          "label": "Customer and phone cascade write",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "ENTITY",
              "name": "CustomerPhoneNumberDo",
              "method": "CustomerDo.customerPhoneNumbers cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_phone_number"
            },
            {
              "type": "ENTITY",
              "name": "PhoneNumberDo",
              "method": "CustomerPhoneNumberDo.phoneNumber cascade=ALL"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_phone_number"
            }
          ]
        },
        {
          "label": "Success terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/ownership-dashboard"
            }
          ]
        },
        {
          "label": "Validation failure terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "UC01RegisterCustomerController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "UC01RegisterCustomerMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "CustomerIngestionService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "CustomerIngestionRequstValidator",
              "method": "validate"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/UC01RegisterCustomer"
            }
          ]
        }
      ],
      "finalDependencies": [
        "LookupDataCache.addressTypes",
        "public.tbl_address_type",
        "public.tbl_customer",
        "public.tbl_phone_number",
        "public.tbl_city",
        "public.tbl_state",
        "public.tbl_country",
        "public.tbl_customer_address",
        "public.tbl_address",
        "public.tbl_customer_phone_number",
        "redirect:/ownership-dashboard",
        "final-version-1/UC01RegisterCustomer"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-150939.md"
      ]
    },
    {
      "method": "GET",
      "path": "/vehicleLoad",
      "controller": "Uc02Phase01VehicleLoadController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Cache hit",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doGet"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getVehicleLoadPurposes()"
            },
            {
              "type": "IN_MEMORY_DATA",
              "name": "vehicleLoadPurposes cached list"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/Uc02-Phase01-VehicleLoadView"
            }
          ]
        },
        {
          "label": "Cache miss reload",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doGet"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "getVehicleLoadPurposes() -> refreshVehicleLoadPurpose()"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadPurposeFetchAllService",
              "method": "processRequest()"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadPurposeJpaDao",
              "method": "findAll()"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadPurposeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load_purpose"
            },
            {
              "type": "CACHE",
              "name": "LookupDataCache",
              "method": "replace vehicleLoadPurposes list"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/Uc02-Phase01-VehicleLoadView"
            }
          ]
        }
      ],
      "finalDependencies": [
        "in-memory vehicleLoadPurposes cache",
        "public.tbl_vehicle_load_purpose",
        "with-menu/Uc02-Phase01-VehicleLoadView"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-083401.md"
      ]
    },
    {
      "method": "POST",
      "path": "/vehicleLoad",
      "controller": "Uc02Phase01VehicleLoadController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Validation and location checks",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "Uc02Phase01VehicleLoadMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadIngestionService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "VehicleLoadIngestionValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "VALIDATOR",
              "name": "CylinderLocationExclusivityValidator",
              "method": "validateCylinderAvailableOnlyInYard"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionLineJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution_line"
            }
          ]
        },
        {
          "label": "Trip load and stop persistence",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "Uc02Phase01VehicleLoadMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadPurposeJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadPurposeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load_purpose"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStopTypeJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStopTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_stop_type"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStopJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip_stop"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStatusJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            }
          ]
        },
        {
          "label": "Vehicle load persistence",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "Uc02Phase01VehicleLoadMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadLineDo",
              "method": "cascade from VehicleLoadDo.loadLines"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load_line"
            }
          ]
        },
        {
          "label": "Yard to logistics transfer",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doPost"
            },
            {
              "type": "MEDIATOR",
              "name": "Uc02Phase01VehicleLoadMediator",
              "method": "invokeServices"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadIngestionService",
              "method": "transferYardInventoryToVehicleLogistics"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionLineJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution_line"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao",
              "method": "saveAll"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            }
          ]
        },
        {
          "label": "Success terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doPost"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/vehicle-loads/list"
            }
          ]
        },
        {
          "label": "Validation error terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase01VehicleLoadController",
              "method": "doPost"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/Uc02-Phase01-VehicleLoadView"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_cylinder",
        "public.tbl_yard_inventory_line",
        "public.tbl_cylinder_logistics_execution_line",
        "public.tbl_vehicle_trip",
        "public.tbl_vehicle_load_purpose",
        "public.tbl_stop_type",
        "public.tbl_vehicle_trip_stop",
        "public.tbl_trip_status",
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_load_line",
        "public.tbl_cylinder_logistics_execution",
        "public.tbl_cylinder_states",
        "/vehicle-loads/list",
        "with-menu/Uc02-Phase01-VehicleLoadView"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-085811.md"
      ]
    },
    {
      "method": "GET",
      "path": "/cylinderDelivery",
      "controller": "Uc02Phase02CylinderDeliveryController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Terminal view path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase02CylinderDeliveryController",
              "method": "doGet()"
            },
            {
              "type": "DTO",
              "name": "UC02Phase02CylinderDeliveryRequestDto",
              "method": "construct request"
            },
            {
              "type": "DTO",
              "name": "OrderDto",
              "method": "new OrderDto() / setOrderDto"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "Uc02-Phase02-CylinderDeliveryView",
              "method": "ModelAndView return"
            }
          ]
        }
      ],
      "finalDependencies": [
        "Uc02-Phase02-CylinderDeliveryView"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-070036.md",
        "CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89:Uc02Phase02CylinderDeliveryController.java#ccb1a980de6002d45585bd8c8f56fc19867e3299"
      ]
    },
    {
      "method": "POST",
      "path": "/cylinderDelivery",
      "controller": "Uc02Phase02CylinderDeliveryController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Mediator and service path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase02CylinderDeliveryController",
              "method": "doPost(...)"
            },
            {
              "type": "MEDIATOR",
              "name": "Uc02Phase02CylinderDeliveryMediator",
              "method": "invokeServices(...)"
            },
            {
              "type": "SERVICE",
              "name": "OrderIngestionService",
              "method": "processRequest(...)"
            }
          ]
        },
        {
          "label": "Validation and lookup branches",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "OrderIngestionService",
              "method": "processRequest(...)"
            },
            {
              "type": "VALIDATOR",
              "name": "OrderIngestionRequestValidator",
              "method": "validate(...)"
            },
            {
              "type": "DAO_GROUP",
              "name": "ChallanTypeJpaDao; CustomerJpaDao; CustomerAddressJpaDao; DriverJpaDao; VehicleJpaDao; CylinderJpaDao"
            },
            {
              "type": "ENTITY_GROUP",
              "name": "ChallanTypeDo; CustomerDo; CustomerAddressDo; DriverDo; VehicleDo; CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE_SET",
              "name": "public.tbl_challan_type; public.tbl_customer; public.tbl_customer_address; public.tbl_driver; public.tbl_vehicle; public.tbl_cylinder"
            }
          ]
        },
        {
          "label": "Order persistence branch",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "OrderIngestionService",
              "method": "processRequest(...)"
            },
            {
              "type": "DAO",
              "name": "OrderJpaDao",
              "method": "save(orderDo)"
            },
            {
              "type": "ENTITY",
              "name": "OrderDo",
              "method": "cascade orderLines"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_order"
            },
            {
              "type": "ENTITY",
              "name": "OrderLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_order_line"
            },
            {
              "type": "ENTITY",
              "name": "ProductDo",
              "method": "lineDo.setProduct(cylinderDo.getProduct())"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_product"
            }
          ]
        },
        {
          "label": "Controller terminal branches",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "Uc02Phase02CylinderDeliveryController",
              "method": "doPost(...)"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "/orderList?pageNumber=1&itemsPerPage=10",
              "method": "success"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "Uc02-Phase02-CylinderDeliveryView",
              "method": "InvalidInputParameterException"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_challan_type",
        "public.tbl_customer",
        "public.tbl_customer_address",
        "public.tbl_driver",
        "public.tbl_vehicle",
        "public.tbl_cylinder",
        "public.tbl_product",
        "public.tbl_order",
        "public.tbl_order_line",
        "/orderList?pageNumber=1&itemsPerPage=10",
        "Uc02-Phase02-CylinderDeliveryView"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-080301.md",
        "CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89:Uc02Phase02CylinderDeliveryMediator.java#bb4796913edc0399fc076c3a8123139b04620f3c",
        "CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89:OrderIngestionService.java#282f41ab73163ea07d074b53dc4370405dd2722b",
        "CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89:OrderIngestionRequestValidator.java#67d9a5a686fd7bcd20965f5200108a438a87abf1"
      ]
    },
    {
      "method": "GET",
      "path": "/vehicle-loads/all-list",
      "controller": "VehicleLoadByPageController",
      "controllerMethod": "listAllVehicleLoads",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "All load list",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleLoadByPageController",
              "method": "listAllVehicleLoads"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            }
          ]
        },
        {
          "label": "Trip status helper",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleLoadByPageController",
              "method": "fetchTripStatusByLoadId"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "getTripStatusByVehicleLoadIds"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/VehicleLoadFetchByPageView"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_trip",
        "public.tbl_driver",
        "public.tbl_vehicle",
        "public.tbl_trip_status",
        "final-version-1/VehicleLoadFetchByPageView"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/vehicle-loads/list",
      "controller": "VehicleLoadByPageController",
      "controllerMethod": "listVehicleLoads",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Active load list",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleLoadByPageController",
              "method": "listVehicleLoads"
            },
            {
              "type": "SERVICE",
              "name": "VehicleActiveTripFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleActiveTripJpaDao"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "VehicleActiveTripDo"
            },
            {
              "type": "DATABASE_VIEW",
              "name": "public.vw_active_trips"
            },
            {
              "type": "DAO",
              "name": "VehicleTripJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            }
          ]
        },
        {
          "label": "Trip status by load",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleLoadByPageController",
              "method": "fetchTripStatusByLoadId"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "getTripStatusByVehicleLoadIds"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/VehicleLoadFetchByPageView"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_active_trips",
        "public.tbl_vehicle_trip",
        "public.tbl_vehicle_load",
        "public.tbl_driver",
        "public.tbl_vehicle",
        "public.tbl_trip_status",
        "final-version-1/VehicleLoadFetchByPageView"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/vehicle-load/fetch",
      "controller": "VehicleLoadFetchByIdController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "vehicle load fetch",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleLoadFetchByIdController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadFetchByIdService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "ENTITY_GROUP",
              "name": "DriverDo; VehicleDo; VehicleTripStopDo; VehicleTripStopTypeDo"
            },
            {
              "type": "POSTGRES_TABLE_GROUP",
              "name": "public.tbl_driver; public.tbl_vehicle; public.tbl_vehicle_trip_stop; public.tbl_stop_type"
            }
          ]
        },
        {
          "label": "trip status",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleLoadFetchByIdController",
              "method": "doGet"
            },
            {
              "type": "SERVICE",
              "name": "TripReturnWorkflowService",
              "method": "getTripStatusByVehicleLoadId"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/Displayvehicleload.html"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_trip",
        "public.tbl_driver",
        "public.tbl_vehicle",
        "public.tbl_vehicle_trip_stop",
        "public.tbl_stop_type",
        "public.tbl_trip_status",
        "with-menu/Displayvehicleload.html"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260825-005948-SCHEDULER.md",
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "GET",
      "path": "/vehicle-trips/list",
      "controller": "VehicleTripController",
      "controllerMethod": "listVehicleTrips",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Vehicle trips",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripController",
              "method": "listVehicleTrips"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "tst/trip-list"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle_trip",
        "public.tbl_vehicle",
        "public.tbl_driver",
        "tst/trip-list"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-181810.md"
      ]
    },
    {
      "method": "GET",
      "path": "/addVechileTrip",
      "controller": "VehicleTripIngestionController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doGet"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/VehicleTripIngestion"
            }
          ]
        }
      ],
      "finalDependencies": [
        "with-menu/VehicleTripIngestion"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "POST",
      "path": "/addVechileTrip",
      "controller": "VehicleTripIngestionController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "validation vehicle",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripIngestionServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "VehicleTripIngestionRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "VehicleJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            }
          ]
        },
        {
          "label": "validation driver",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripIngestionServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "VehicleTripIngestionRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "DriverJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            }
          ]
        },
        {
          "label": "validation customer address",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripIngestionServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "VehicleTripIngestionRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            }
          ]
        },
        {
          "label": "validation customer",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripIngestionServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "VehicleTripIngestionRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            }
          ]
        },
        {
          "label": "started status",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripIngestionServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStatusJpaDao",
              "method": "findByStatusName"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            }
          ]
        },
        {
          "label": "persist trip",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "VehicleTripIngestionServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleTripJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/vehicleLoad"
            }
          ]
        },
        {
          "label": "validation or service error",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripIngestionController",
              "method": "doPost"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "with-menu/VehicleTripIngestion"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_vehicle",
        "public.tbl_driver",
        "public.tbl_customer_address",
        "public.tbl_customer",
        "public.tbl_trip_status",
        "public.tbl_vehicle_trip",
        "redirect:/vehicleLoad",
        "with-menu/VehicleTripIngestion"
      ],
      "evidence": [
        "backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml"
      ],
      "sourceBaseline": "3ae6e61442132d94a307275b08dd65fcef228d89"
    },
    {
      "method": "GET",
      "path": "/wizard/vehicle-trip-load",
      "controller": "VehicleTripLoadWizardController",
      "controllerMethod": "showWizard",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Lookup cache and terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "showWizard"
            },
            {
              "type": "IN_MEMORY_CACHE",
              "name": "LookupDataCache",
              "method": "getVehicleLoadPurposes / getTotalProducts / getProduct"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/VehicleTripLoadWizard"
            }
          ]
        },
        {
          "label": "Active challan books and terminal view",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "showWizard / populateActiveChallanBooks"
            },
            {
              "type": "DAO",
              "name": "ActiveChallanBookForTripLoadViewJpaDao",
              "method": "findByBookType"
            },
            {
              "type": "VIEW_ENTITY",
              "name": "ActiveChallanBookForTripLoadViewDo"
            },
            {
              "type": "POSTGRES_VIEW",
              "name": "public.vw_active_challan_books_for_trip_load"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/VehicleTripLoadWizard"
            }
          ]
        }
      ],
      "finalDependencies": [
        "LookupDataCache",
        "public.vw_active_challan_books_for_trip_load",
        "final-version-1/VehicleTripLoadWizard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-110011.md"
      ]
    },
    {
      "method": "POST",
      "path": "/wizard/vehicle-trip-load/save",
      "controller": "VehicleTripLoadWizardController",
      "controllerMethod": "save",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Challan book validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadAndTripIngestionService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "TripChallanBookAssignmentSelectionValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "ActiveChallanBookForTripLoadViewJpaDao",
              "method": "findByBookIdAndBookType"
            },
            {
              "type": "POSTGRES_VIEW",
              "name": "public.vw_active_challan_books_for_trip_load"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao",
              "method": "countUnusedPageByBookIdAndSheetNumber"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentJpaDao",
              "method": "existsByChallanBookIdAndReturnedAtIsNull"
            },
            {
              "type": "ENTITY",
              "name": "TripChallanBookAssignmentDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_challan_book_assignment"
            }
          ]
        },
        {
          "label": "Cylinder location validation",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadAndTripIngestionService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "VehicleLoadIngestionValidator"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "VALIDATOR",
              "name": "CylinderLocationExclusivityValidator"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao",
              "method": "findByCylinderAndActive"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionLineJpaDao",
              "method": "findByCylinderAndActive"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution_line"
            }
          ]
        },
        {
          "label": "Trip header and master data",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadAndTripIngestionService",
              "method": "processRequest / createVehicleTrip"
            },
            {
              "type": "DAO",
              "name": "VehicleJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle"
            },
            {
              "type": "DAO",
              "name": "DriverJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "DriverDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_driver"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStatusJpaDao"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStatusDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_status"
            },
            {
              "type": "DAO",
              "name": "VehicleTripJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip"
            }
          ]
        },
        {
          "label": "Vehicle load and lines",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadAndTripIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadPurposeJpaDao",
              "method": "findAllByOrderByLoadPurposeAsc"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadPurposeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load_purpose"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao",
              "method": "findByCylinderAndActive"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            },
            {
              "type": "DAO",
              "name": "VehicleLoadJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load"
            },
            {
              "type": "ENTITY",
              "name": "VehicleLoadLineDo",
              "method": "cascade from VehicleLoadDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_load_line"
            }
          ]
        },
        {
          "label": "YARD_START stop",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadAndTripIngestionService",
              "method": "createYardStartStop"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStopTypeJpaDao",
              "method": "findByStopType"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStopTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_stop_type"
            },
            {
              "type": "DAO",
              "name": "VehicleTripStopJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "VehicleTripStopDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_vehicle_trip_stop"
            }
          ]
        },
        {
          "label": "Trip challan assignments",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadAndTripIngestionService",
              "method": "assignSelectedChallanBooksToTrip"
            },
            {
              "type": "DAO",
              "name": "TripChallanBookAssignmentJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "TripChallanBookAssignmentDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_trip_challan_book_assignment"
            }
          ]
        },
        {
          "label": "Yard to logistics transfer",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "SERVICE",
              "name": "VehicleLoadAndTripIngestionService",
              "method": "transferYardInventoryToVehicleLogistics"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao",
              "method": "findByCylinderStateContainingIgnoreCase"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            },
            {
              "type": "DAO",
              "name": "CylinderLogisticsExecutionLineJpaDao",
              "method": "saveAll"
            },
            {
              "type": "ENTITY",
              "name": "CylinderLogisticsExecutionLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_logistics_execution_line"
            },
            {
              "type": "DAO",
              "name": "YardInventoryLineJpaDao",
              "method": "saveAll"
            },
            {
              "type": "ENTITY",
              "name": "YardInventoryLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_inventory_line"
            }
          ]
        },
        {
          "label": "Terminal paths",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "VehicleTripLoadWizardController",
              "method": "save"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:/vehicle-loads/list",
              "method": "success"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/VehicleTripLoadWizard",
              "method": "CylinderManagementApplicationException -> errorMav"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.vw_active_challan_books_for_trip_load",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_trip_challan_book_assignment",
        "public.tbl_cylinder",
        "public.tbl_yard_inventory_line",
        "public.tbl_cylinder_logistics_execution_line",
        "public.tbl_vehicle",
        "public.tbl_driver",
        "public.tbl_customer",
        "public.tbl_customer_address",
        "public.tbl_trip_status",
        "public.tbl_vehicle_trip",
        "public.tbl_vehicle_load_purpose",
        "public.tbl_vehicle_load",
        "public.tbl_vehicle_load_line",
        "public.tbl_stop_type",
        "public.tbl_vehicle_trip_stop",
        "public.tbl_cylinder_logistics_execution",
        "public.tbl_cylinder_states",
        "redirect:/vehicle-loads/list",
        "final-version-1/VehicleTripLoadWizard"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-113951.md"
      ]
    },
    {
      "method": "GET",
      "path": "/walkin-sale",
      "controller": "WalkinSaleIngestionController",
      "controllerMethod": "GET handler",
      "state": "COMPLETE",
      "chainCompleteness": "FULL",
      "paths": [
        {
          "label": "Terminal view path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "WalkinSaleIngestionController",
              "method": "GET /walkin-sale handler"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/WalkinSaleIngestion",
              "method": "returned directly; durable accepted source evidence records no persistence service call"
            }
          ]
        }
      ],
      "finalDependencies": [
        "final-version-1/WalkinSaleIngestion"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-145512.md#LANE-03"
      ]
    },
    {
      "method": "POST",
      "path": "/walkin-sale",
      "controller": "WalkinSaleIngestionController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Common customer and address lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "WalkinSaleIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE_INTERFACE",
              "name": "ICylinderManagementApplicationService<WalkinSaleRequestDto, WalkinSaleResponseDto>",
              "method": "processRequest"
            },
            {
              "type": "SERVICE",
              "name": "WalkinSaleServiceImpl",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CustomerJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer"
            },
            {
              "type": "DAO",
              "name": "CustomerAddressJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CustomerAddressDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_customer_address"
            }
          ]
        },
        {
          "label": "Full-cylinder delivery order and walk-in sale",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "WalkinSaleIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "WalkinSaleServiceImpl",
              "method": "createWalkInDeliveryOrder"
            },
            {
              "type": "DAO",
              "name": "OrderJpaDao",
              "method": "saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "OrderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_order"
            },
            {
              "type": "ENTITY",
              "name": "OrderLineDo",
              "method": "cascade ALL through OrderDo.orderLines"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_order_line"
            },
            {
              "type": "DAO",
              "name": "WalkInSaleJpaDao",
              "method": "saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "WalkInSaleDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_walk_in_sale"
            }
          ]
        },
        {
          "label": "Full-cylinder and challan-type lookup",
          "nodes": [
            {
              "type": "SERVICE",
              "name": "WalkinSaleServiceImpl",
              "method": "createWalkInDeliveryOrder / resolveDeliveryChallanType"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "DAO",
              "name": "ChallanTypeJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "ChallanTypeDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_type"
            }
          ]
        },
        {
          "label": "Empty-cylinder pickup and yard return",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "WalkinSaleIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "WalkinSaleServiceImpl",
              "method": "createWalkInPickupAndYardEntriesForReturnedEmptyCylinders"
            },
            {
              "type": "DAO",
              "name": "WalkInPickupJpaDao",
              "method": "saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "WalkInPickupDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_walk_in_pickup"
            },
            {
              "type": "DAO",
              "name": "CylinderJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CylinderDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder"
            },
            {
              "type": "DAO",
              "name": "WalkInPickupLineJpaDao",
              "method": "saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "WalkInPickupLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_walk_in_pickup_line"
            },
            {
              "type": "DAO",
              "name": "YardEntriesJpaDao",
              "method": "saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "YardEntryDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_entries"
            }
          ]
        },
        {
          "label": "Delivery challan page journal link",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "WalkinSaleIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "WalkinSaleServiceImpl",
              "method": "linkDeliveryChallanLeafIfPresent"
            },
            {
              "type": "DAO",
              "name": "ChallanPageAuditLedgerJpaDao",
              "method": "findAll / save"
            },
            {
              "type": "ENTITY",
              "name": "ChallanPageAuditLedgerDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_page_audit_ledger"
            },
            {
              "type": "DAO",
              "name": "ChallanTransactionLinkJpaDao",
              "method": "findByChallanPage / delete / flush / save"
            },
            {
              "type": "ENTITY",
              "name": "ChallanTransactionLinkDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_challan_transaction_link"
            }
          ]
        },
        {
          "label": "Terminal outcomes",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "WalkinSaleIngestionController",
              "method": "doPost"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:BACK_LINK",
              "method": "success"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/WalkinSaleIngestion",
              "method": "validation/application error"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_customer",
        "public.tbl_customer_address",
        "public.tbl_cylinder",
        "public.tbl_challan_type",
        "public.tbl_order",
        "public.tbl_order_line",
        "public.tbl_walk_in_sale",
        "public.tbl_walk_in_pickup",
        "public.tbl_walk_in_pickup_line",
        "public.tbl_yard_entries",
        "public.tbl_challan_page_audit_ledger",
        "public.tbl_challan_transaction_link",
        "redirect:BACK_LINK",
        "final-version-1/WalkinSaleIngestion"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-145512.md#LANE-03",
        "logs/runs/PRODUCTION-FIRE-20260824-103703.md"
      ]
    },
    {
      "method": "GET",
      "path": "/yard-audit-dashboard",
      "controller": "YardAuditDashboardController",
      "controllerMethod": "dashboard handler",
      "state": "COMPLETE",
      "chainCompleteness": "PARTIAL_INTERMEDIATE_HOPS",
      "paths": [
        {
          "label": "Accepted historical source path",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardAuditDashboardController",
              "method": "GET /yard-audit-dashboard handler"
            },
            {
              "type": "SERVICE",
              "name": "YardAuditDashboardFetchService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "YardQualityGateJpaDao"
            },
            {
              "type": "DATABASE_OBJECT_SET",
              "name": "public.tbl_yard_stock_check; public.tbl_yard_stock_check_line; public.tbl_yard_quality_gate; public.tbl_cylinder_states; public.tbl_yard_check_event"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_yard_stock_check",
        "public.tbl_yard_stock_check_line",
        "public.tbl_yard_quality_gate",
        "public.tbl_cylinder_states",
        "public.tbl_yard_check_event"
      ],
      "evidence": [
        "logs/runs/INVOCATION-20260823-145512.md#LANE-02"
      ]
    },
    {
      "method": "GET",
      "path": "/ingestYardStockCheck",
      "controller": "YardStockCheckIngestionController",
      "controllerMethod": "doGet",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Cache hit",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doGet"
            },
            {
              "type": "COMPONENT",
              "name": "LookupDataCache",
              "method": "getCylinderStates"
            },
            {
              "type": "IN_MEMORY_CACHE",
              "name": "cylinderStates"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/YardStockCheckIngestion"
            }
          ]
        },
        {
          "label": "Cache miss refresh",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doGet"
            },
            {
              "type": "COMPONENT",
              "name": "LookupDataCache",
              "method": "getCylinderStates -> refreshCylinderStates"
            },
            {
              "type": "SERVICE",
              "name": "CylinderStateFetchByPageService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao",
              "method": "findAll(pageable)"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            },
            {
              "type": "IN_MEMORY_CACHE",
              "name": "cylinderStates"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/YardStockCheckIngestion"
            }
          ]
        }
      ],
      "finalDependencies": [
        "in-memory cylinderStates cache",
        "public.tbl_cylinder_states",
        "final-version-1/YardStockCheckIngestion"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-203431.md"
      ]
    },
    {
      "method": "POST",
      "path": "/ingestYardStockCheck",
      "controller": "YardStockCheckIngestionController",
      "controllerMethod": "doPost",
      "state": "COMPLETE",
      "chainCompleteness": "FULL_BRANCHING",
      "paths": [
        {
          "label": "Validation cylinder-state lookup",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "YardStockCheckIngestionService",
              "method": "processRequest"
            },
            {
              "type": "VALIDATOR",
              "name": "YardStockCheckIngestionRequestValidator",
              "method": "validate"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            }
          ]
        },
        {
          "label": "Stock-check header persistence",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "YardStockCheckIngestionService",
              "method": "processRequest"
            },
            {
              "type": "MAPPER",
              "name": "YardStockCheckMapper",
              "method": "mapDtoToDo"
            },
            {
              "type": "DAO",
              "name": "YardStockCheckJpaDao",
              "method": "saveAndFlush"
            },
            {
              "type": "ENTITY",
              "name": "YardStockCheckDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_stock_check"
            }
          ]
        },
        {
          "label": "Observed-state lookup and stock-check line persistence",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "YardStockCheckIngestionService",
              "method": "processRequest"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao",
              "method": "findById"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            },
            {
              "type": "DAO",
              "name": "YardStockCheckLineJpaDao",
              "method": "save"
            },
            {
              "type": "ENTITY",
              "name": "YardStockCheckLineDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_yard_stock_check_line"
            }
          ]
        },
        {
          "label": "Success terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doPost"
            },
            {
              "type": "SERVICE",
              "name": "YardStockCheckIngestionService",
              "method": "processRequest"
            },
            {
              "type": "TERMINAL_REDIRECT",
              "name": "redirect:"
            }
          ]
        },
        {
          "label": "Validation error cache refresh and form",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doPost"
            },
            {
              "type": "COMPONENT",
              "name": "LookupDataCache",
              "method": "getCylinderStates"
            },
            {
              "type": "SERVICE",
              "name": "CylinderStateFetchByPageService",
              "method": "processRequest when cache empty"
            },
            {
              "type": "DAO",
              "name": "CylinderStateJpaDao",
              "method": "findAll(pageable)"
            },
            {
              "type": "ENTITY",
              "name": "CylinderStateDo"
            },
            {
              "type": "POSTGRES_TABLE",
              "name": "public.tbl_cylinder_states"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/YardStockCheckIngestion"
            }
          ]
        },
        {
          "label": "Application error terminal",
          "nodes": [
            {
              "type": "CONTROLLER",
              "name": "YardStockCheckIngestionController",
              "method": "doPost"
            },
            {
              "type": "TERMINAL_VIEW",
              "name": "final-version-1/YardStockCheckIngestion"
            }
          ]
        }
      ],
      "finalDependencies": [
        "public.tbl_cylinder_states",
        "public.tbl_yard_stock_check",
        "public.tbl_yard_stock_check_line",
        "final-version-1/YardStockCheckIngestion",
        "redirect:BACK_LINK"
      ],
      "evidence": [
        "logs/runs/PRODUCTION-FIRE-20260824-203431.md"
      ]
    }
  ],
  "unresolved": []
};
