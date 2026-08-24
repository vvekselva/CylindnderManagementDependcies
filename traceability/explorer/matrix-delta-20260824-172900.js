window.TRACEABILITY_DELTAS = window.TRACEABILITY_DELTAS || [];
window.TRACEABILITY_DELTAS.push({
  checkpoint: { invocation: "PRODUCTION-FIRE-20260824-172900", canonicalAcceptedExamined: 70, canonicalComplete: 70, canonicalUnresolved: 0, canonicalNotYetExamined: 64, materializedMatrixRows: 47 },
  endpoints: [{
    method: "POST", path: "/add-stop/challan-page-photo/delete-ajax", controller: "AddStopController", controllerMethod: "deleteChallanPagePhotoAjax", state: "COMPLETE", chainCompleteness: "FULL",
    paths: [
      {label:"Deactivate active challan photo",nodes:[{type:"CONTROLLER",name:"AddStopController",method:"deleteChallanPagePhotoAjax"},{type:"SERVICE",name:"ChallanPagePhotoUploadService",method:"deactivatePhoto"},{type:"DAO",name:"ChallanPagePhotoJpaDao",method:"findById / save"},{type:"ENTITY",name:"ChallanPagePhotoDo"},{type:"POSTGRES_TABLE",name:"public.tbl_challan_page_photo"}]},
      {label:"Success terminal",nodes:[{type:"CONTROLLER",name:"AddStopController",method:"deleteChallanPagePhotoAjax"},{type:"SERVICE",name:"ChallanPagePhotoUploadService",method:"deactivatePhoto"},{type:"TERMINAL_JSON",name:"HTTP 200 JSON success=true"}]},
      {label:"Application error terminal",nodes:[{type:"CONTROLLER",name:"AddStopController",method:"deleteChallanPagePhotoAjax"},{type:"SERVICE",name:"ChallanPagePhotoUploadService",method:"deactivatePhoto"},{type:"TERMINAL_JSON",name:"HTTP 400 JSON success=false"}]},
      {label:"Unexpected error terminal",nodes:[{type:"CONTROLLER",name:"AddStopController",method:"deleteChallanPagePhotoAjax"},{type:"SERVICE",name:"ChallanPagePhotoUploadService",method:"deactivatePhoto"},{type:"TERMINAL_JSON",name:"HTTP 500 JSON success=false"}]}
    ],
    finalDependencies: ["public.tbl_challan_page_photo","HTTP 200 JSON","HTTP 400 JSON","HTTP 500 JSON"],
    evidence: ["logs/runs/PRODUCTION-FIRE-20260824-172900.md"]
  }]
});