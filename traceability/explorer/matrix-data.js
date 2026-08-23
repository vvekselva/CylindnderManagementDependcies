window.TRACEABILITY_DATA = {
  metadata: {
    backlogItem: "BL-001",
    status: "INCREMENTAL_PARTIAL",
    sourceBaseline: "3ae6e61442132d94a307275b08dd65fcef228d89",
    canonicalEndpointInventory: 134,
    canonicalAcceptedExamined: 37,
    canonicalComplete: 35,
    canonicalUnresolved: 2,
    canonicalBlocked: 0,
    canonicalFailed: 0,
    canonicalNotYetExamined: 97,
    materializedMatrixRows: 10,
    historicalAcceptedRowsPendingBackfill: 27,
    latestMaterializedFromInvocation: "INVOCATION-20260823-160000"
  },
  endpoints: [
    {
      method: "GET",
      path: "/login",
      controller: "LoginController",
      controllerMethod: "showLoginPage",
      state: "COMPLETE",
      chainCompleteness: "FULL",
      paths: [{
        label: "Terminal view path",
        nodes: [
          {type:"CONTROLLER", name:"LoginController", method:"showLoginPage"},
          {type:"TERMINAL_VIEW", name:"LOGIN_FORM_VIEW", method:"ModelAndView return; no service/DAO/database dependency"}
        ]
      }],
      finalDependencies: ["LOGIN_FORM_VIEW"],
      evidence: ["logs/runs/INVOCATION-20260823-160000.md#LANE-01"]
    },
    {
      method: "GET", path: "/offline-map/status", controller: "OfflineMapController", controllerMethod: "status path", state: "COMPLETE", chainCompleteness: "FULL",
      paths: [{label:"Status path", nodes:[
        {type:"CONTROLLER", name:"OfflineMapController", method:"status path"},
        {type:"SERVICE", name:"OfflineVectorTileService", method:"fetchStatus()"},
        {type:"FILE", name:"Configured MBTiles filesystem path"},
        {type:"SQLITE_TABLE", name:"metadata"},
        {type:"CLASSPATH_RESOURCE", name:"MapLibre JS/CSS and glyph resources"}
      ]}], finalDependencies:["MBTiles file","SQLite metadata","MapLibre/glyph classpath resources"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-02"]
    },
    {
      method: "GET", path: "/offline-map/status-json", controller: "OfflineMapController", controllerMethod: "status-json path", state: "COMPLETE", chainCompleteness: "FULL",
      paths: [{label:"Status JSON path", nodes:[
        {type:"CONTROLLER", name:"OfflineMapController", method:"status-json path"},
        {type:"SERVICE", name:"OfflineVectorTileService", method:"fetchStatus()"},
        {type:"FILE", name:"Configured MBTiles filesystem path"},
        {type:"SQLITE_TABLE", name:"metadata"},
        {type:"CLASSPATH_RESOURCE", name:"Frontend classpath-resource checks"}
      ]}], finalDependencies:["MBTiles file","SQLite metadata","frontend classpath resources"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-02"]
    },
    {
      method: "GET", path: "/offline-map/style.json", controller: "OfflineMapController", controllerMethod: "style path", state: "COMPLETE", chainCompleteness: "FULL",
      paths: [{label:"Style generation path", nodes:[
        {type:"CONTROLLER", name:"OfflineMapController", method:"style path"},
        {type:"SERVICE", name:"OfflineMapStyleService", method:"buildStyleJson(...)"},
        {type:"CONFIGURATION", name:"OfflineMapProperties + request-derived application base URL"},
        {type:"TERMINAL_JSON", name:"Generated style JSON response"}
      ]}], finalDependencies:["OfflineMapProperties","generated JSON"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-02"]
    },
    {
      method: "GET", path: "/offline-map/vector-tiles/{z}/{x}/{y}.pbf", controller: "OfflineMapController", controllerMethod: "vector-tile path", state: "COMPLETE", chainCompleteness: "FULL",
      paths: [{label:"Vector tile path", nodes:[
        {type:"CONTROLLER", name:"OfflineMapController", method:"vector-tile path"},
        {type:"SERVICE", name:"OfflineVectorTileService", method:"fetchTile(...)"},
        {type:"FILE", name:"Configured MBTiles filesystem file"},
        {type:"SQLITE_TABLE", name:"tiles", method:"select tile_data from tiles ..."},
        {type:"SQLITE_TABLE", name:"metadata", method:"tile format lookup"}
      ]}], finalDependencies:["MBTiles file","SQLite tiles","SQLite metadata"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-02"]
    },
    {
      method:"GET", path:"/delivery-planning/predefined-trips", controller:"PredefinedDeliveryTripController", controllerMethod:"page path", state:"COMPLETE", chainCompleteness:"PARTIAL_INTERMEDIATE_HOPS",
      paths:[{label:"Source-proved service/dependency set", nodes:[
        {type:"CONTROLLER", name:"PredefinedDeliveryTripController", method:"page path"},
        {type:"SERVICE_GROUP", name:"PredefinedDeliveryTripService", method:"trips / metrics / stopRows"},
        {type:"SERVICE", name:"DeliveryPlanningStopService", method:"list"},
        {type:"DAO", name:"PredefinedDeliveryTripJpaDao", method:"findActiveTripMetrics() for metrics branch"},
        {type:"DATABASE_OBJECT_SET", name:"public.tbl_predefined_delivery_trip; public.tbl_predefined_delivery_trip_stop; public.tbl_delivery_planning_stop; public.vw_customer_address_location_status; public.vw_customer_delivery_planning_signal"}
      ]}], finalDependencies:["public.tbl_predefined_delivery_trip","public.tbl_predefined_delivery_trip_stop","public.tbl_delivery_planning_stop","public.vw_customer_address_location_status","public.vw_customer_delivery_planning_signal"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-03"]
    },
    {
      method:"POST", path:"/delivery-planning/predefined-trips/create", controller:"PredefinedDeliveryTripController", controllerMethod:"create path", state:"COMPLETE", chainCompleteness:"FULL",
      paths:[{label:"Create", nodes:[
        {type:"CONTROLLER", name:"PredefinedDeliveryTripController", method:"create path"},
        {type:"SERVICE", name:"PredefinedDeliveryTripService", method:"create"},
        {type:"DAO", name:"PredefinedDeliveryTripJpaDao"},
        {type:"ENTITY", name:"PredefinedDeliveryTripDo"},
        {type:"POSTGRES_TABLE", name:"public.tbl_predefined_delivery_trip"}
      ]}], finalDependencies:["public.tbl_predefined_delivery_trip"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-03"]
    },
    {
      method:"POST", path:"/delivery-planning/predefined-trips/add-stop", controller:"PredefinedDeliveryTripController", controllerMethod:"add-stop path", state:"COMPLETE", chainCompleteness:"FULL_BRANCHING",
      paths:[
        {label:"Predefined trip branch", nodes:[{type:"CONTROLLER",name:"PredefinedDeliveryTripController",method:"add-stop path"},{type:"SERVICE",name:"PredefinedDeliveryTripService",method:"addStop"},{type:"DAO",name:"PredefinedDeliveryTripJpaDao"},{type:"ENTITY",name:"PredefinedDeliveryTripDo"},{type:"POSTGRES_TABLE",name:"public.tbl_predefined_delivery_trip"}]},
        {label:"Delivery planning stop branch", nodes:[{type:"CONTROLLER",name:"PredefinedDeliveryTripController",method:"add-stop path"},{type:"SERVICE",name:"PredefinedDeliveryTripService",method:"addStop"},{type:"DAO",name:"DeliveryPlanningStopJpaDao"},{type:"ENTITY",name:"DeliveryPlanningStopDo"},{type:"POSTGRES_TABLE",name:"public.tbl_delivery_planning_stop"}]},
        {label:"Trip stop branch", nodes:[{type:"CONTROLLER",name:"PredefinedDeliveryTripController",method:"add-stop path"},{type:"SERVICE",name:"PredefinedDeliveryTripService",method:"addStop"},{type:"DAO",name:"PredefinedDeliveryTripStopJpaDao"},{type:"ENTITY",name:"PredefinedDeliveryTripStopDo"},{type:"POSTGRES_TABLE",name:"public.tbl_predefined_delivery_trip_stop"}]}
      ], finalDependencies:["public.tbl_predefined_delivery_trip","public.tbl_delivery_planning_stop","public.tbl_predefined_delivery_trip_stop"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-03"]
    },
    {
      method:"POST", path:"/delivery-planning/predefined-trips/remove-stop", controller:"PredefinedDeliveryTripController", controllerMethod:"remove-stop path", state:"COMPLETE", chainCompleteness:"FULL",
      paths:[{label:"Remove stop", nodes:[
        {type:"CONTROLLER",name:"PredefinedDeliveryTripController",method:"remove-stop path"},
        {type:"SERVICE",name:"PredefinedDeliveryTripService",method:"removeStop / resequence"},
        {type:"DAO",name:"PredefinedDeliveryTripStopJpaDao"},
        {type:"ENTITY",name:"PredefinedDeliveryTripStopDo"},
        {type:"POSTGRES_TABLE",name:"public.tbl_predefined_delivery_trip_stop"}
      ]}], finalDependencies:["public.tbl_predefined_delivery_trip_stop"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-03"]
    },
    {
      method:"POST", path:"/delivery-planning/predefined-trips/remove", controller:"PredefinedDeliveryTripController", controllerMethod:"remove path", state:"COMPLETE", chainCompleteness:"FULL",
      paths:[{label:"Deactivate trip", nodes:[
        {type:"CONTROLLER",name:"PredefinedDeliveryTripController",method:"remove path"},
        {type:"SERVICE",name:"PredefinedDeliveryTripService",method:"deactivate"},
        {type:"DAO",name:"PredefinedDeliveryTripJpaDao"},
        {type:"ENTITY",name:"PredefinedDeliveryTripDo"},
        {type:"POSTGRES_TABLE",name:"public.tbl_predefined_delivery_trip"}
      ]}], finalDependencies:["public.tbl_predefined_delivery_trip"], evidence:["logs/runs/INVOCATION-20260823-160000.md#LANE-03"]
    }
  ],
  unresolved: [
    {
      method:"POST", path:"/customer-spot-cylinder-check/submit", state:"UNRESOLVED",
      proved:["public.tbl_customer_spot_cylinder_check"],
      missingProof:"Complete database-object set for every submitSpotCheck branch is not yet source-proved.",
      nextAction:"Follow every conditional branch at the frozen source baseline and source-prove the final dependency set."
    },
    {
      method:"POST", path:"/walkin-sale", state:"UNRESOLVED",
      proved:["public.tbl_order","public.tbl_walk_in_sale","public.tbl_walk_in_pickup","public.tbl_walk_in_pickup_line","public.tbl_yard_entries"],
      missingProof:"Complete final dependency set across every conditional processRequest branch is not yet source-proved.",
      nextAction:"Resolve every branch and source-bound service/repository implementation at the frozen baseline."
    }
  ]
};
