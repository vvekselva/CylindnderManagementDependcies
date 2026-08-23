(function () {
  const d = window.TRACEABILITY_DATA;
  if (!d || !Array.isArray(d.endpoints)) return;
  d.metadata.canonicalAcceptedExamined = 43;
  d.metadata.canonicalComplete = 41;
  d.metadata.canonicalUnresolved = 2;
  d.metadata.canonicalNotYetExamined = 91;
  d.metadata.materializedMatrixRows = 16;
  d.metadata.historicalAcceptedRowsPendingBackfill = 27;
  d.metadata.latestMaterializedFromInvocation = "PRODUCTION-FIRE-20260824-013546";

  const row = {
    method: "GET",
    path: "/customer-address-location/planning-map",
    controller: "CustomerAddressLocationController",
    controllerMethod: "showPlanningMap",
    state: "COMPLETE",
    chainCompleteness: "FULL",
    paths: [{label:"Terminal view",nodes:[
      {type:"CONTROLLER",name:"CustomerAddressLocationController",method:"showPlanningMap"},
      {type:"TERMINAL_VIEW",name:"with-menu/CustomerAddressPlanningMap"}
    ]}],
    finalDependencies:["with-menu/CustomerAddressPlanningMap"],
    evidence:["logs/runs/PRODUCTION-FIRE-20260824-013546.md"]
  };

  const i = d.endpoints.findIndex(e => e.method === row.method && e.path === row.path);
  if (i >= 0) d.endpoints[i] = row; else d.endpoints.push(row);
})();
