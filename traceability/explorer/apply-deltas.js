(() => {
  'use strict';
  const data = window.TRACEABILITY_DATA || { metadata: {}, endpoints: [], unresolved: [] };
  data.metadata = data.metadata || {};
  data.endpoints = Array.isArray(data.endpoints) ? data.endpoints : [];
  data.unresolved = Array.isArray(data.unresolved) ? data.unresolved : [];

  const endpointKey = row => `${String(row.method || '').toUpperCase()} ${row.path || ''}`;
  const deltas = Array.isArray(window.TRACEABILITY_DELTAS) ? window.TRACEABILITY_DELTAS : [];

  for (const delta of deltas) {
    // Two durable delta schemas exist in the repository:
    //   legacy: { checkpoint: "INVOCATION", metadata: {...}, upserts: [...] }
    //   current: { checkpoint: {...}, endpoints: [...] }
    // Both represent accepted canonical evidence and must assemble identically.
    const checkpoint = (delta && typeof delta.checkpoint === 'object' && delta.checkpoint !== null)
      ? delta.checkpoint
      : ((delta && delta.metadata && typeof delta.metadata === 'object') ? delta.metadata : {});

    const metadataMap = {
      canonicalEndpointInventory: 'canonicalEndpointInventory',
      canonicalAcceptedExamined: 'canonicalAcceptedExamined',
      canonicalComplete: 'canonicalComplete',
      canonicalUnresolved: 'canonicalUnresolved',
      canonicalBlocked: 'canonicalBlocked',
      canonicalFailed: 'canonicalFailed',
      canonicalNotYetExamined: 'canonicalNotYetExamined',
      materializedMatrixRows: 'materializedMatrixRows',
      historicalAcceptedRowsPendingBackfill: 'historicalAcceptedRowsPendingBackfill',
      sourceBaseline: 'sourceBaseline'
    };
    for (const [sourceKey, targetKey] of Object.entries(metadataMap)) {
      if (checkpoint[sourceKey] !== undefined) data.metadata[targetKey] = checkpoint[sourceKey];
    }

    if (checkpoint.invocation) {
      data.metadata.latestInvocation = checkpoint.invocation;
    } else if (delta && typeof delta.checkpoint === 'string' && delta.checkpoint) {
      data.metadata.latestInvocation = delta.checkpoint;
    }

    data.metadata.status = 'INCREMENTAL_PARTIAL';
    data.metadata.projectionState = 'BASE_PLUS_ORDERED_DELTAS_CURRENT';

    const rows = Array.isArray(delta && delta.endpoints)
      ? delta.endpoints
      : (Array.isArray(delta && delta.upserts) ? delta.upserts : []);

    for (const row of rows) {
      const key = endpointKey(row);
      const index = data.endpoints.findIndex(existing => endpointKey(existing) === key);
      if (index >= 0) data.endpoints[index] = row;
      else data.endpoints.push(row);
    }
  }

  window.TRACEABILITY_DATA = data;
})();
