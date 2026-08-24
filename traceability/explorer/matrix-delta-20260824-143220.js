window.TRACEABILITY_DELTAS = window.TRACEABILITY_DELTAS || [];
window.TRACEABILITY_DELTAS.push({
  checkpoint: { invocation: "PRODUCTION-FIRE-20260824-143220", canonicalAcceptedExamined: 67, canonicalComplete: 67, canonicalUnresolved: 0, canonicalNotYetExamined: 67, materializedMatrixRows: 44 },
  endpoints: [{
    method: "GET", path: "/fetchCustomerByPage", controller: "CustomerFetchByPageController", controllerMethod: "doGet", state: "COMPLETE", chainCompleteness: "FULL_BRANCHING",
    paths: [
      {label:"Customer root and success view",nodes:[{type:"CONTROLLER",name:"CustomerFetchByPageController",method:"doGet"},{type:"SERVICE",name:"CustomerFetchByPageService",method:"processRequest"},{type:"DAO",name:"CustomerJpaDao",method:"page query selected by activeOnly/searchTerm"},{type:"ENTITY",name:"CustomerDo"},{type:"POSTGRES_TABLE",name:"public.tbl_customer"},{type:"TERMINAL_VIEW",name:"final-version-1/CustomerListPage"}]},
      {label:"Phone summary expansion",nodes:[{type:"CONTROLLER",name:"CustomerFetchByPageController",method:"doGet"},{type:"SERVICE",name:"CustomerFetchByPageService",method:"processRequest / toSummary"},{type:"DAO",name:"CustomerJpaDao"},{type:"ENTITY",name:"CustomerDo"},{type:"ENTITY",name:"CustomerPhoneNumberDo",method:"getCustomerPhoneNumbers"},{type:"POSTGRES_TABLE",name:"public.tbl_customer_phone_number"},{type:"ENTITY",name:"PhoneNumberDo",method:"getPhoneNumber"},{type:"POSTGRES_TABLE",name:"public.tbl_phone_number"},{type:"TERMINAL_VIEW",name:"final-version-1/CustomerListPage"}]},
      {label:"Address and city summary expansion",nodes:[{type:"CONTROLLER",name:"CustomerFetchByPageController",method:"doGet"},{type:"SERVICE",name:"CustomerFetchByPageService",method:"processRequest / toSummary"},{type:"DAO",name:"CustomerJpaDao"},{type:"ENTITY",name:"CustomerDo"},{type:"ENTITY",name:"CustomerAddressDo",method:"getCustomerAddresses"},{type:"POSTGRES_TABLE",name:"public.tbl_customer_address"},{type:"ENTITY",name:"AddressDo",method:"getAddress"},{type:"POSTGRES_TABLE",name:"public.tbl_address"},{type:"ENTITY",name:"CityDo",method:"getCity / getCityName"},{type:"POSTGRES_TABLE",name:"public.tbl_city"},{type:"TERMINAL_VIEW",name:"final-version-1/CustomerListPage"}]},
      {label:"Handled error redirect",nodes:[{type:"CONTROLLER",name:"CustomerFetchByPageController",method:"doGet"},{type:"SERVICE",name:"CustomerFetchByPageService",method:"processRequest"},{type:"TERMINAL_REDIRECT",name:"redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=<itemsPerPage>"}]}
    ],
    finalDependencies: ["public.tbl_customer","public.tbl_customer_phone_number","public.tbl_phone_number","public.tbl_customer_address","public.tbl_address","public.tbl_city","final-version-1/CustomerListPage","redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=<itemsPerPage>"],
    evidence: ["logs/runs/PRODUCTION-FIRE-20260824-143220.md"]
  }]
});
