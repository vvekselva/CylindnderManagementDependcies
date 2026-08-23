(function () {
  const d = window.TRACEABILITY_DATA;
  if (!d || !Array.isArray(d.endpoints)) return;
  d.metadata.canonicalAcceptedExamined = 42;
  d.metadata.canonicalComplete = 40;
  d.metadata.canonicalUnresolved = 2;
  d.metadata.canonicalNotYetExamined = 92;
  d.metadata.materializedMatrixRows = 15;
  d.metadata.historicalAcceptedRowsPendingBackfill = 27;
  d.metadata.latestMaterializedFromInvocation = "PRODUCTION-FIRE-20260824-013336";

  const row = {
    method: "GET",
    path: "/challan-heatmap",
    controller: "ChallanHeatmapController",
    controllerMethod: "showHeatmap",
    state: "COMPLETE",
    chainCompleteness: "FULL_BRANCHING",
    paths: [
      {label:"Heatmap metrics query / mapping",nodes:[
        {type:"CONTROLLER",name:"ChallanHeatmapController",method:"showHeatmap"},
        {type:"SERVICE",name:"ChallanHeatmapFetchService",method:"processRequest"},
        {type:"DAO",name:"ChallanHeatmapMetricsViewJpaDao",method:"findHeatmapMetrics / findDistinctBookTypes / findDistinctBookCodes / findDistinctSeriesPrefixes"},
        {type:"VIEW_ENTITY",name:"ChallanHeatmapMetricsViewDo"},
        {type:"DATABASE_VIEW",name:"public.vw_challan_heatmap_metrics"},
        {type:"MAPPER",name:"ChallanHeatmapMetricsViewMapper",method:"mapDoToDto"}
      ]},
      {label:"Terminal view",nodes:[
        {type:"CONTROLLER",name:"ChallanHeatmapController",method:"showHeatmap"},
        {type:"TERMINAL_VIEW",name:"final-version-1/ChallanHeatmapDashboard"}
      ]}
    ],
    finalDependencies:["public.vw_challan_heatmap_metrics","final-version-1/ChallanHeatmapDashboard"],
    evidence:["logs/runs/PRODUCTION-FIRE-20260824-013336.md"]
  };

  const i = d.endpoints.findIndex(e => e.method === row.method && e.path === row.path);
  if (i >= 0) d.endpoints[i] = row; else d.endpoints.push(row);
})();
