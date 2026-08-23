(() => {
  'use strict';
  let data = normalizeData(window.TRACEABILITY_DATA || {metadata:{}, endpoints:[], unresolved:[]});
  let parsedLogs = [];
  let activeTab = 'endpoints';
  let sortDirection = 1;

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const uniq = (arr) => [...new Set(arr)];

  function normalizeData(input) {
    const d = input || {};
    d.metadata = d.metadata || {};
    d.endpoints = Array.isArray(d.endpoints) ? d.endpoints : [];
    d.unresolved = Array.isArray(d.unresolved) ? d.unresolved : [];
    d.endpoints.forEach(r => {
      r.paths = Array.isArray(r.paths) ? r.paths : [];
      r.finalDependencies = Array.isArray(r.finalDependencies) ? r.finalDependencies : [];
      r.evidence = Array.isArray(r.evidence) ? r.evidence : [];
    });
    return d;
  }

  function allNodes(row) { return row.paths.flatMap(p => p.nodes || []); }
  function hopCount(row) { return Math.max(0, ...row.paths.map(p => (p.nodes || []).length)); }
  function searchable(row) {
    return [row.method,row.path,row.controller,row.controllerMethod,row.state,row.chainCompleteness,...row.finalDependencies,...allNodes(row).flatMap(n=>[n.type,n.name,n.method])].join(' ').toLowerCase();
  }

  function renderSummary() {
    const m = data.metadata;
    const cards = [
      ['Matrix State', m.status || 'UNKNOWN', `Baseline ${m.sourceBaseline || 'n/a'}`],
      ['Endpoints', m.canonicalEndpointInventory ?? data.endpoints.length, 'Caller-visible inventory'],
      ['Examined', m.canonicalAcceptedExamined ?? data.endpoints.length, `${m.canonicalComplete ?? 0} COMPLETE`],
      ['Unresolved', m.canonicalUnresolved ?? data.unresolved.length, `${m.canonicalBlocked ?? 0} blocked / ${m.canonicalFailed ?? 0} failed`],
      ['Matrix Rows', m.materializedMatrixRows ?? data.endpoints.length, `${m.historicalAcceptedRowsPendingBackfill ?? 0} historical rows pending backfill`],
      ['Not Yet Examined', m.canonicalNotYetExamined ?? '?', 'Source check remaining']
    ];
    $('summary').innerHTML = cards.map(([l,v,n]) => `<div class="summary-card"><div class="label">${esc(l)}</div><div class="value">${esc(v)}</div><div class="note">${esc(n)}</div></div>`).join('');
  }

  function populateMethods() {
    const select = $('methodFilter');
    const current = select.value || 'ALL';
    const methods = uniq(data.endpoints.map(r=>r.method).filter(Boolean)).sort();
    select.innerHTML = '<option value="ALL">All methods</option>' + methods.map(m=>`<option>${esc(m)}</option>`).join('');
    if ([...select.options].some(o=>o.value===current)) select.value = current;
  }

  function filteredRows() {
    const q = $('search').value.trim().toLowerCase();
    const state = $('stateFilter').value;
    const method = $('methodFilter').value;
    const sort = $('sortBy').value;
    const rows = data.endpoints.filter(r => (!q || searchable(r).includes(q)) && (state==='ALL'||r.state===state) && (method==='ALL'||r.method===method));
    const key = r => ({controller:r.controller||'', path:r.path||'', method:r.method||'', state:r.state||'', hops:hopCount(r)}[sort]);
    rows.sort((a,b)=> typeof key(a)==='number' ? (key(a)-key(b))*sortDirection : String(key(a)).localeCompare(String(key(b)))*sortDirection);
    return rows;
  }

  function chainHtml(row) {
    if (!row.paths.length) return '<div class="empty">No structured chain is materialized for this row.</div>';
    return row.paths.map((p, idx)=>{
      const nodes = p.nodes || [];
      const chain = nodes.map((n,i)=>`${i?'<div class="chain-arrow">→</div>':''}<div class="chain-node"><div class="node-type">${esc(n.type)}</div><div class="node-name">${esc(n.name)}</div>${n.method?`<div class="node-method">${esc(n.method)}</div>`:''}</div>`).join('');
      return `<div class="branch"><div class="branch-label">${esc(p.label || `Path ${idx+1}`)}</div><div class="chain">${chain}</div></div>`;
    }).join('');
  }

  function renderEndpoints() {
    const rows = filteredRows();
    if (!rows.length) { $('endpoints').innerHTML = '<div class="empty">No endpoints match the current filters.</div>'; return; }
    const body = rows.map((r,i)=>{
      const id = `row-${i}`;
      return `<tr class="endpoint-row">
        <td><button class="expand-btn" data-expand="${id}">View chain</button></td>
        <td><span class="method">${esc(r.method)}</span></td><td><code>${esc(r.path)}</code></td><td>${esc(r.controller)}${r.controllerMethod?`<div class="small">${esc(r.controllerMethod)}</div>`:''}</td>
        <td><span class="state ${esc(r.state)}">${esc(r.state)}</span></td><td>${hopCount(r)}</td><td>${esc((r.finalDependencies||[]).join('; '))}</td>
      </tr>
      <tr class="detail-row" id="${id}" hidden><td colspan="7"><div class="detail">
        <div class="small">Chain completeness: <strong>${esc(r.chainCompleteness || 'UNKNOWN')}</strong></div>
        ${chainHtml(r)}
        <div class="evidence"><strong>Evidence:</strong> ${(r.evidence||[]).map(e=>`<code>${esc(e)}</code>`).join(' ') || 'not materialized'}</div>
      </div></td></tr>`;
    }).join('');
    $('endpoints').innerHTML = `<div class="card table-wrap"><table><thead><tr><th>Chain</th><th>HTTP</th><th>Path</th><th>Controller</th><th>State</th><th>Max hops</th><th>Final dependency</th></tr></thead><tbody>${body}</tbody></table></div>`;
    document.querySelectorAll('[data-expand]').forEach(btn => btn.addEventListener('click', () => {
      const row = $(btn.dataset.expand); row.hidden = !row.hidden; btn.textContent = row.hidden ? 'View chain' : 'Hide chain';
    }));
  }

  function componentIndex() {
    const map = new Map();
    data.endpoints.forEach(row => allNodes(row).forEach(node => {
      const k = `${node.type}|${node.name}`;
      if (!map.has(k)) map.set(k, {type:node.type,name:node.name,endpoints:new Set(),states:new Set()});
      const c = map.get(k); c.endpoints.add(`${row.method} ${row.path}`); c.states.add(row.state);
    }));
    return [...map.values()].sort((a,b)=>a.type.localeCompare(b.type)||a.name.localeCompare(b.name));
  }

  function renderComponents() {
    const q = $('search').value.trim().toLowerCase();
    const list = componentIndex().filter(c => !q || `${c.type} ${c.name} ${[...c.endpoints].join(' ')}`.toLowerCase().includes(q));
    $('components').innerHTML = list.length ? `<div class="component-grid">${list.map(c=>`<article class="component-card"><div class="type-tag">${esc(c.type)}</div><h3>${esc(c.name)}</h3><div class="metric-line"><span>Endpoint references</span><strong>${c.endpoints.size}</strong></div><div class="metric-line"><span>States</span><strong>${esc([...c.states].join(', '))}</strong></div><div class="endpoint-links">${[...c.endpoints].map(x=>esc(x)).join('<br>')}</div></article>`).join('')}</div>` : '<div class="empty">No components match the current search.</div>';
  }

  const FINAL_TYPES = new Set(['POSTGRES_TABLE','DATABASE_OBJECT_SET','SQLITE_TABLE','FILE','CLASSPATH_RESOURCE','CONFIGURATION','TERMINAL_VIEW','TERMINAL_JSON','EXTERNAL_API','DATABASE_VIEW']);
  function dependencyIndex() {
    const map = new Map();
    data.endpoints.forEach(row => allNodes(row).filter(n=>FINAL_TYPES.has(n.type)).forEach(n=>{
      const k = `${n.type}|${n.name}`;
      if (!map.has(k)) map.set(k,{type:n.type,name:n.name,endpoints:new Set(),controllers:new Set()});
      map.get(k).endpoints.add(`${row.method} ${row.path}`); map.get(k).controllers.add(row.controller);
    }));
    return [...map.values()].sort((a,b)=>b.endpoints.size-a.endpoints.size || a.name.localeCompare(b.name));
  }
  function renderDependencies() {
    const q = $('search').value.trim().toLowerCase();
    const list = dependencyIndex().filter(d=>!q||`${d.type} ${d.name} ${[...d.endpoints]} ${[...d.controllers]}`.toLowerCase().includes(q));
    $('dependencies').innerHTML = list.length ? `<div class="dependency-grid">${list.map(d=>`<article class="component-card"><div class="type-tag">${esc(d.type)}</div><h3>${esc(d.name)}</h3><div class="metric-line"><span>Endpoints</span><strong>${d.endpoints.size}</strong></div><div class="metric-line"><span>Controllers</span><strong>${d.controllers.size}</strong></div><div class="endpoint-links">${[...d.endpoints].map(x=>esc(x)).join('<br>')}</div></article>`).join('')}</div>` : '<div class="empty">No final dependencies match the current search.</div>';
  }

  function renderUnresolved() {
    const q = $('search').value.trim().toLowerCase();
    const list = data.unresolved.filter(u=>!q||JSON.stringify(u).toLowerCase().includes(q));
    $('unresolved').innerHTML = list.length ? list.map(u=>`<article class="unresolved-card"><h3><span class="method">${esc(u.method)}</span> <code>${esc(u.path)}</code></h3><div><span class="state ${esc(u.state)}">${esc(u.state)}</span></div><p><strong>Proved so far:</strong> ${esc((u.proved||[]).join('; '))}</p><p><strong>Missing proof:</strong> ${esc(u.missingProof)}</p><p><strong>Next action:</strong> ${esc(u.nextAction)}</p></article>`).join('') : '<div class="empty">No unresolved entries match the current search.</div>';
  }

  function parseInvocationLog(text, filename) {
    const invocation = (text.match(/Invocation ID:\s*([^\n\r]+)/i)||[])[1]?.trim() || filename;
    const segments = text.split(/# Aggregated Lane Evidence - /);
    const lanes = [];
    if (segments.length > 1) {
      segments.slice(1).forEach(seg=>{
        const lane = (seg.match(/^(LANE-\d+)/)||[])[1] || 'LANE-?';
        const task = (seg.match(/\nTask:\s*([^\n\r]+)/i)||[])[1]?.trim() || '';
        const runId = (seg.match(/\nRun ID:\s*([^\n\r]+)/i)||[])[1]?.trim() || '';
        const result = (seg.match(/Service Result:\s*([^\n\r]+)/i)||[])[1]?.trim() || '';
        const findings = (seg.match(/### Findings\s*\n([\s\S]*?)(?=\n### Evidence|\n### Work not completed|\n## LANE_CLOSE_END|$)/i)||[])[1]?.trim() || '';
        const evidence = (seg.match(/### Evidence\s*\n([\s\S]*?)(?=\n### Work not completed|\n### Blocker|\n## LANE_CLOSE_END|$)/i)||[])[1]?.trim() || '';
        lanes.push({lane,task,runId,result,findings,evidence});
      });
    } else {
      const task = (text.match(/\nTask:\s*([^\n\r]+)/i)||[])[1]?.trim() || '';
      lanes.push({lane:'LOG',task,runId:'',result:'',findings:text.slice(0,12000),evidence:''});
    }
    return {invocation,filename,lanes};
  }

  function renderLogs() {
    if (!parsedLogs.length) { $('logs').innerHTML = '<div class="log-empty">Load one or more durable <code>.md</code> invocation logs to render lane/task/findings/evidence here.</div>'; return; }
    $('logs').innerHTML = parsedLogs.map(log=>`<div class="card"><div class="detail"><h2>${esc(log.invocation)}</h2><div class="small">${esc(log.filename)}</div></div></div>${log.lanes.map(l=>`<article class="log-card"><header><div><strong>${esc(l.lane)}</strong><div class="small">${esc(l.task)}</div></div><div><span class="state ${esc(l.result||'COMPLETE')}">${esc(l.result||'LOG')}</span></div></header><div class="body">${l.runId?`<div class="small">Run ID: ${esc(l.runId)}</div>`:''}<h4>Findings</h4><div class="log-section">${esc(l.findings || 'No Findings section parsed.')}</div><h4>Evidence</h4><div class="log-section">${esc(l.evidence || 'No Evidence section parsed.')}</div></div></article>`).join('')}`).join('');
  }

  function parseLegacyMatrixMarkdown(text) {
    const lines = text.split(/\r?\n/).filter(l=>l.trim().startsWith('|'));
    const headerIdx = lines.findIndex(l=>/HTTP method/i.test(l) && /Path/i.test(l));
    if (headerIdx < 0) throw new Error('No traceability Markdown table found.');
    const rows = lines.slice(headerIdx+2).map(line=>line.split('|').slice(1,-1).map(x=>x.trim())).filter(c=>c.length>=7);
    const endpoints = rows.map(c=>({
      method: stripMd(c[0]), path: stripMd(c[1]), controller: stripMd(c[2]), controllerMethod:'', state:stripMd(c[3]), chainCompleteness:'LEGACY_COMPRESSED',
      paths:[{label:'Legacy compressed row',nodes:[{type:'CONTROLLER',name:stripMd(c[2])},{type:stripMd(c[4])||'FINAL_DEPENDENCY',name:stripMd(c[5])}]}],
      finalDependencies:[stripMd(c[5])], evidence:[stripMd(c[6])]
    }));
    return normalizeData({metadata:{status:'IMPORTED_LEGACY_MARKDOWN',materializedMatrixRows:endpoints.length,canonicalAcceptedExamined:endpoints.length},endpoints,unresolved:[]});
  }
  function stripMd(s){ return String(s||'').replace(/`/g,'').replace(/\*\*/g,'').trim(); }

  function renderAll() {
    renderSummary(); populateMethods(); renderEndpoints(); renderComponents(); renderDependencies(); renderUnresolved(); renderLogs();
  }

  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
    activeTab = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b===btn));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id===activeTab));
  }));
  ['search','stateFilter','methodFilter','sortBy'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',renderAll));
  $('resetBtn').addEventListener('click',()=>{ $('search').value=''; $('stateFilter').value='ALL'; $('methodFilter').value='ALL'; $('sortBy').value='controller'; sortDirection=1; renderAll(); });
  $('matrixFile').addEventListener('change', async e=>{
    const f=e.target.files[0]; if(!f) return;
    try { const text=await f.text(); data=f.name.toLowerCase().endsWith('.json')?normalizeData(JSON.parse(text)):parseLegacyMatrixMarkdown(text); renderAll(); }
    catch(err){ alert(`Could not load matrix: ${err.message}`); }
  });
  $('logFiles').addEventListener('change', async e=>{
    parsedLogs=[];
    for (const f of [...e.target.files]) parsedLogs.push(parseInvocationLog(await f.text(), f.name));
    renderLogs(); document.querySelector('[data-tab="logs"]').click();
  });

  renderAll();
})();
