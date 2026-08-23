(function () {
  const d = window.TRACEABILITY_DATA;
  if (!d || !Array.isArray(d.endpoints)) return;
  d.metadata.canonicalAcceptedExamined = 41;
  d.metadata.canonicalComplete = 39;
  d.metadata.canonicalUnresolved = 2;
  d.metadata.canonicalNotYetExamined = 93;
  d.metadata.materializedMatrixRows = 14;
  d.metadata.historicalAcceptedRowsPendingBackfill = 27;
  d.metadata.latestMaterializedFromInvocation = "PRODUCTION-FIRE-20260824-005711";

  const row = {
    method: "GET",
    path: "/challan-entry-aging-dashboard",
    controller: "ChallanEntryAgingDashboardController",
    controllerMethod: "showChallanEntryAgingDashboard",
    state: "COMPLETE",
    chainCompleteness: "FULL_BRANCHING",
    paths: [
      {label:"Tracker metrics / rows",nodes:[
        {type:"CONTROLLER",name:"ChallanEntryAgingDashboardController",method:"showChallanEntryAgingDashboard"},
        {type:"SERVICE",name:"ChallanEntryAgingDashboardService",method:"fetchDashboard"},
        {type:"DAO",name:"TripChallanEntryTrackerJpaDao",method:"countByTrackerStatus / findDashboardRows"},
        {type:"ENTITY",name:"TripChallanEntryTrackerDo"},
        {type:"POSTGRES_TABLE",name:"public.tbl_trip_challan_entry_tracker"},
        {type:"MAPPER",name:"ChallanEntryAgingDashboardMapper",method:"mapTrackerDosToDtos"}
      ]},
      {label:"Audit rows",nodes:[
        {type:"CONTROLLER",name:"ChallanEntryAgingDashboardController",method:"showChallanEntryAgingDashboard"},
        {type:"SERVICE",name:"ChallanEntryAgingDashboardService",method:"fetchDashboard"},
        {type:"DAO",name:"TripChallanEntryTrackerAuditJpaDao",method:"findDashboardRows"},
        {type:"ENTITY",name:"TripChallanEntryTrackerAuditDo"},
        {type:"POSTGRES_TABLE",name:"public.tbl_trip_challan_entry_tracker_audit"},
        {type:"MAPPER",name:"ChallanEntryAgingDashboardMapper",method:"mapAuditDosToDtos"}
      ]},
      {label:"Terminal view",nodes:[
        {type:"CONTROLLER",name:"ChallanEntryAgingDashboardController",method:"showChallanEntryAgingDashboard"},
        {type:"TERMINAL_VIEW",name:"final-version-1/ChallanEntryAgingDashboard"}
      ]}
    ],
    finalDependencies:["public.tbl_trip_challan_entry_tracker","public.tbl_trip_challan_entry_tracker_audit","final-version-1/ChallanEntryAgingDashboard"],
    evidence:["logs/runs/PRODUCTION-FIRE-20260824-005711.md"]
  };

  const i = d.endpoints.findIndex(e => e.method === row.method && e.path === row.path);
  if (i >= 0) d.endpoints[i] = row; else d.endpoints.push(row);
})();
