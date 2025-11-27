/* SoulMV Multi-Abas - versão GitHub
   Barra flutuante: CONFIGURAÇÕES + seletor CO/NIR/MATE + ABRIR ABAS + SALVAR + X
*/

(function () {
  try {
    if (!location.href.includes('/soul-mv')) {
      console.warn('[MV-MULTI-ABAS] Fora do SoulMV, não faz nada.');
      return;
    }

    // Se já existir, só alterna mostrar/ocultar
    var existing = document.getElementById('mv-multi-painel');
    if (existing) {
      existing.style.display = (existing.style.display === 'none' ? 'flex' : 'none');
      console.log('[MV-MULTI-ABAS] Toggled barra multi-abas.');
      return;
    }

    console.log('[MV-MULTI-ABAS] Criando barra multi-abas...');

    const d = ms => new Promise(r => setTimeout(r, ms));

    function f(s, t) {
      const a = Array.from(s.querySelectorAll('li.menu-node > a[role="menuitem"]'));
      return a.find(x => (x.title || x.textContent.trim()) === t) || null;
    }

    async function ex(s, t) {
      const l = f(s, t);
      if (!l) return null;
      const li = l.closest('li.menu-node');
      if (!li) return null;
      if (!li.classList.contains('open')) {
        l.click();
        await d(600);
      }
      return li.querySelector('ul') || li;
    }

    function hasTab(k) {
      const tabs = Array.from(document.querySelectorAll('.workspace-tab-bar .tab-item-text'));
      return tabs.some(t => {
        const txt = (t.title || t.textContent || '');
        return txt.includes(k);
      });
    }

    async function waitTabReady(k) {
      if (!k) return;
      for (let i = 0; i < 25; i++) {
        if (hasTab(k)) return;
        await d(200);
      }
    }

    async function ensureLoaded(target, openFn) {
      let sawLoading = false;
      for (let i = 0; i < 25; i++) {
        const tabs = Array.from(document.querySelectorAll('.workspace-tab-bar .tab-item-text'));
        const targetTab = tabs.find(t => (t.title || t.textContent || '').includes(target));
        if (targetTab) return;

        const loadingTab = tabs.find(t => /Carregando/i.test(t.textContent || ''));
        if (loadingTab) sawLoading = true;

        await d(200);
      }
      if (sawLoading && typeof openFn === 'function') openFn();
    }

    const state = {
      painel: true,
      transf: true,
      aviso: true,
      atend: true,
      ficha: true,
      desc: true,
      conf: true,
      transfCC: true,
      movAtend: true,
      altaHosp: true
    };

    const searchKeys = {
      painel: 'Painel da Internação',
      transf: 'Transferência de Paciente',
      aviso: 'Aviso de Cirurgia',
      atend: 'Atendimentos',
      ficha: 'Ficha Obstétrica',
      desc: 'Descrição Cirúrgica',
      conf: 'Confirmação de Cirurgia',
      transfCC: 'Transferência para Centro Cirúrgico',
      movAtend: 'Movimentação do Atendimento',
      altaHosp: 'Alta Hospitalar'
    };

    // ==== Funções para abrir cada aba ====

    async function oPainel() {
      if (!state.painel || hasTab(searchKeys.painel)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento'); if (!s) return;
      s = await ex(s, 'Internação');  if (!s) return;
      s = await ex(s, 'Atendimento'); if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Painel da Internação');
      if (l) l.click();
    }

    async function oTransf() {
      if (!state.transf || hasTab(searchKeys.transf)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento'); if (!s) return;
      s = await ex(s, 'Internação');  if (!s) return;
      s = await ex(s, 'Atendimento'); if (!s) return;
      s = await ex(s, 'Transferência de Paciente'); if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Transferência de Leito');
      if (l) l.click();
    }

    async function oAviso() {
      if (!state.aviso || hasTab(searchKeys.aviso)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento');                  if (!s) return;
      s = await ex(s, 'Centro Cirúrgico e Obstétrico'); if (!s) return;
      s = await ex(s, 'Centro Cirúrgico');             if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Aviso de Cirurgia');
      if (l) l.click();
    }

    async function oAtend() {
      if (!state.atend || hasTab(searchKeys.atend)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento'); if (!s) return;
      s = await ex(s, 'Internação');  if (!s) return;
      s = await ex(s, 'Consultas');   if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Atendimentos');
      if (l) l.click();
    }

    async function oFicha() {
      if (!state.ficha || hasTab(searchKeys.ficha)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento');                  if (!s) return;
      s = await ex(s, 'Centro Cirúrgico e Obstétrico'); if (!s) return;
      s = await ex(s, 'Centro Cirúrgico');             if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Ficha Obstétrica');
      if (l) l.click();
    }

    async function oDesc() {
      if (!state.desc || hasTab(searchKeys.desc)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento');                  if (!s) return;
      s = await ex(s, 'Centro Cirúrgico e Obstétrico'); if (!s) return;
      s = await ex(s, 'Centro Cirúrgico');             if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Descrição Cirúrgica');
      if (l) l.click();
    }

    async function oConf() {
      if (!state.conf || hasTab(searchKeys.conf)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento');                  if (!s) return;
      s = await ex(s, 'Centro Cirúrgico e Obstétrico'); if (!s) return;
      s = await ex(s, 'Centro Cirúrgico');             if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Confirmação da Cirurgia');
      if (l) l.click();
    }

    async function oTransfCC() {
      if (!state.transfCC || hasTab(searchKeys.transfCC)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento');                  if (!s) return;
      s = await ex(s, 'Centro Cirúrgico e Obstétrico'); if (!s) return;
      s = await ex(s, 'Centro Cirúrgico');             if (!s) return;
      s = await ex(s, 'Transferência de Paciente');    if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Transferência para Centro Cirúrgico');
      if (l) l.click();
    }

    async function oMovAtend() {
      if (!state.movAtend || hasTab(searchKeys.movAtend)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento'); if (!s) return;
      s = await ex(s, 'Internação');  if (!s) return;
      s = await ex(s, 'Consultas');   if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Movimentação do Atendimento');
      if (l) l.click();
    }

    async function oAltaHosp() {
      if (!state.altaHosp || hasTab(searchKeys.altaHosp)) return;
      let s = document.querySelector('#workspace-menubar ul.nav') || document;
      s = await ex(s, 'Atendimento'); if (!s) return;
      s = await ex(s, 'Internação');  if (!s) return;
      s = await ex(s, 'Atendimento'); if (!s) return;
      s = await ex(s, 'Alta');        if (!s) return;
      s = await ex(s, 'Efetivação');  if (!s) return;
      const l = Array.from(s.querySelectorAll('a[role="menuitem"]'))
        .find(a => (a.title || a.textContent.trim()) === 'Alta Hospitalar');
      if (l) l.click();
    }

    async function oAll() {
      const seq = [
        ['painel',   searchKeys.painel,   oPainel],
        ['transf',   searchKeys.transf,   oTransf],
        ['aviso',    searchKeys.aviso,    oAviso],
        ['atend',    searchKeys.atend,    oAtend],
        ['ficha',    searchKeys.ficha,    oFicha],
        ['desc',     searchKeys.desc,     oDesc],
        ['conf',     searchKeys.conf,     oConf],
        ['transfCC', searchKeys.transfCC, oTransfCC],
        ['movAtend', searchKeys.movAtend, oMovAtend],
        ['altaHosp', searchKeys.altaHosp, oAltaHosp]
      ];
      let lastTitle = null;
      for (const [key, search, fn] of seq) {
        if (!state[key]) continue;
        await waitTabReady(lastTitle);
        await fn();
        await ensureLoaded(search, fn);
        lastTitle = search;
      }
    }

    // ===== Barra flutuante =====

    const box = document.createElement('div');
    box.id = 'mv-multi-painel';
    box.style.position = 'fixed';
    box.style.top = '4px';
    box.style.left = '50%';
    box.style.transform = 'translateX(-50%)';
    box.style.background = '#fff';
    box.style.padding = '6px 12px';
    box.style.borderRadius = '999px';
    box.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';
    box.style.zIndex = '99999';
    box.style.display = 'flex';
    box.style.gap = '8px';
    box.style.alignItems = 'center';
    box.style.fontFamily = 'Segoe UI,Arial,sans-serif';

    const gear = document.createElement('button');
    gear.textContent = 'CONFIGURAÇÕES';
    gear.title = 'Configurar abas';
    gear.style.height = '30px';
    gear.style.display = 'flex';
    gear.style.alignItems = 'center';
    gear.style.justifyContent = 'center';
    gear.style.padding = '0 10px';
    gear.style.border = 'none';
    gear.style.background = '#1e3a5f';
    gear.style.color = '#fff';
    gear.style.borderRadius = '6px';
    gear.style.cursor = 'pointer';

    const floorSelect = document.createElement('select');
    floorSelect.style.fontSize = '12px';
    floorSelect.style.padding = '4px 6px';
    floorSelect.style.borderRadius = '6px';
    floorSelect.style.border = '1px solid #1e3a5f';
    floorSelect.style.height = '30px';

    ['CO', 'NIR', 'MATE'].forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      floorSelect.appendChild(opt);
    });

    const btn = document.createElement('button');
    btn.textContent = 'ABRIR ABAS';
    btn.style.padding = '6px 10px';
    btn.style.border = 'none';
    btn.style.background = '#2d3f63';
    btn.style.color = '#fff';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'SALVAR';
    saveBtn.style.padding = '6px 10px';
    saveBtn.style.border = 'none';
    saveBtn.style.background = '#1e3a5f';
    saveBtn.style.color = '#fff';
    saveBtn.style.borderRadius = '6px';
    saveBtn.style.cursor = 'pointer';
    saveBtn.style.fontSize = '12px';

    const close = document.createElement('button');
    close.textContent = 'X';
    close.style.padding = '4px 8px';
    close.style.border = 'none';
    close.style.background = '#c0392b';
    close.style.color = '#fff';
    close.style.borderRadius = '6px';
    close.style.cursor = 'pointer';
    close.onclick = () => { box.style.display = 'none'; };

    const cfg = document.createElement('div');
    cfg.id = 'mv-multi-config';
    cfg.style.position = 'absolute';
    cfg.style.top = '40px';
    cfg.style.left = '0';
    cfg.style.background = '#fff';
    cfg.style.border = '1px solid #ccc';
    cfg.style.borderRadius = '6px';
    cfg.style.padding = '6px 8px';
    cfg.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
    cfg.style.fontSize = '12px';
    cfg.style.display = 'none';
    cfg.style.minWidth = '260px';

    const title = document.createElement('div');
    title.textContent = 'Configurar abas';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '4px';
    cfg.appendChild(title);

    const labels = {
      painel: 'Painel da Internação',
      transf: 'Transferência de Leito',
      aviso: 'Aviso de Cirurgia',
      atend: 'Atendimentos',
      ficha: 'Ficha Obstétrica',
      desc: 'Descrição Cirúrgica',
      conf: 'Confirmação da Cirurgia',
      transfCC: 'Transferência para Centro Cirúrgico',
      movAtend: 'Movimentação do Atendimento',
      altaHosp: 'Alta Hospitalar'
    };

    const checkboxes = {};
    for (const k in labels) {
      const row = document.createElement('label');
      row.style.display = 'block';
      row.style.cursor = 'pointer';
      row.style.whiteSpace = 'nowrap';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = true;
      cb.onchange = () => state[k] = cb.checked;
      checkboxes[k] = cb;

      const span = document.createElement('span');
      span.textContent = ' ' + labels[k];

      row.appendChild(cb);
      row.appendChild(span);
      cfg.appendChild(row);
    }

    const templates = {
      CO: ['painel', 'transf', 'aviso', 'atend', 'ficha', 'desc', 'conf'],
      NIR: ['painel', 'transf', 'atend', 'transfCC', 'movAtend', 'altaHosp'],
      MATE: ['painel', 'transf', 'atend']
    };

    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('mv-multi-painel-config') || 'null');
    } catch (e) {
      saved = null;
    }

    if (!saved || typeof saved !== 'object') {
      saved = { lastFloor: '', floors: {} };
    }

    function applySelection(list) {
      const active = new Set(list || []);
      for (const k in labels) {
        const val = list ? active.has(k) : true;
        state[k] = val;
        if (checkboxes[k]) checkboxes[k].checked = val;
      }
    }

    function applyFloorTemplate(code) {
      if (!code) return;
      const key = code.toUpperCase().trim();
      let list = (saved.floors && saved.floors[key]) || templates[key] || null;
      applySelection(list);
    }

    floorSelect.onchange = () => {
      const v = floorSelect.value;
      applyFloorTemplate(v);
      saved.lastFloor = v;
      localStorage.setItem('mv-multi-painel-config', JSON.stringify(saved));
    };

    saveBtn.onclick = () => {
      const code = floorSelect.value.toUpperCase().trim();
      const list = [];
      for (const k in labels) if (state[k]) list.push(k);

      if (!saved.floors) saved.floors = {};
      saved.floors[code] = list;
      saved.lastFloor = code;

      try {
        localStorage.setItem('mv-multi-painel-config', JSON.stringify(saved));
        alert('Configuração salva para o andar: ' + code);
      } catch (e) {
        alert('Erro ao salvar configuração');
      }
    };

    if (saved.lastFloor && ['CO', 'NIR', 'MATE'].includes(saved.lastFloor)) {
      floorSelect.value = saved.lastFloor;
      applyFloorTemplate(saved.lastFloor);
    } else {
      floorSelect.value = 'CO';
      applyFloorTemplate('CO');
    }

    btn.onclick = () => oAll();
    gear.onclick = () => {
      cfg.style.display = (cfg.style.display === 'none' ? 'block' : 'none');
    };

    box.appendChild(gear);
    box.appendChild(floorSelect);
    box.appendChild(btn);
    box.appendChild(saveBtn);
    box.appendChild(close);
    box.appendChild(cfg);
    document.body.appendChild(box);

    console.log('[MV-MULTI-ABAS] Barra criada com sucesso.');
  } catch (err) {
    console.error('[MV-MULTI-ABAS] Erro: ', err);
    alert('Erro MV-MULTI-ABAS: ' + err.message);
  }
})();
