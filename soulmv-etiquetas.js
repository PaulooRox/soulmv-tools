// SoulMV Etiquetas - versão GitHub
// - Botão flutuante com atalhos para relatórios de etiquetas
// - Sempre pede / usa o ATENDIMENTO e abre em nova aba

(function () {
  if (!/1801prd(hosp|report)\.cloudmv\.com\.br/.test(location.hostname)) {
    alert('Este botão de ETIQUETAS só funciona no ambiente 1801prd.');
    return;
  }
  if (document.getElementById('mv-etiq-panel')) return;

  // -------- CONFIG DOS RELATÓRIOS --------
  const BASE = 'https://1801prdreport.cloudmv.com.br/report-executor/mvreport?cdMultiEmpresa=2&cdAtendimento=';

  const REPORTS = [
    {
      id: 'cc_log',
      label: 'CC LOG',
      name: 'USR_ETIQ_C_C_LOGIST' // etiqueta centro cirúrgico logística
    },
    {
      id: 'internados',
      label: 'Pacientes Internados',
      name: 'USR_ETIQUETA_C_LOGIST' // ajuste se for outro nome
    },
    {
      id: 'pulseira_rn',
      label: 'Pulseira RN',
      name: 'USR_ETIQ_PULSEIRA_RN'
    },
    {
      id: 'pulseira_simples',
      label: 'Pulseira simples',
      name: 'USR_ETIQ_PULSEIRA'
    },
    {
      id: 'etiqueta2',
      label: 'Etiqueta 2',
      name: 'USR_ETIQUETA_2_NEW'
    }
  ];

  // -------- FUNÇÃO PARA PEGAR ATENDIMENTO --------
  async function getAtendimento() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clip = (await navigator.clipboard.readText()).trim();
        if (clip && /^\d+$/.test(clip)) {
          const ok = confirm('Usar atendimento do CTRL+C?\n\n' + clip);
          if (ok) return clip;
        }
      }
    } catch (e) {
      // ignore erro de permissão
    }

    const atual = sessionStorage.getItem('mv-last-at') || '';
    const v = prompt('Informe o ATENDIMENTO:', atual);
    if (!v) return null;
    const limpo = v.trim();
    if (!/^\d+$/.test(limpo)) {
      alert('Atendimento inválido: ' + limpo);
      return null;
    }
    sessionStorage.setItem('mv-last-at', limpo);
    return limpo;
  }

  function abrirRelatorio(repId) {
    const rep = REPORTS.find(r => r.id === repId);
    if (!rep) return;

    (async () => {
      const at = await getAtendimento();
      if (!at) return;
      const url = BASE + encodeURIComponent(at) + '&name=' + encodeURIComponent(rep.name);
      window.open(url, '_blank');
    })();
  }

  // -------- UI DO BOTÃO FLUTUANTE --------
  const box = document.createElement('div');
  box.id = 'mv-etiq-panel';
  box.style.position = 'fixed';
  box.style.bottom = '20px';
  box.style.right = '20px';
  box.style.background = '#ffffff';
  box.style.borderRadius = '12px';
  box.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
  box.style.padding = '8px 10px';
  box.style.zIndex = '99999';
  box.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  box.style.minWidth = '160px';

  const header = document.createElement('div');
  header.textContent = 'Etiquetas';
  header.style.fontWeight = 'bold';
  header.style.fontSize = '13px';
  header.style.marginBottom = '4px';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const close = document.createElement('span');
  close.textContent = '×';
  close.style.cursor = 'pointer';
  close.style.color = '#c0392b';
  close.style.fontWeight = 'bold';
  close.onclick = () => box.remove();
  header.appendChild(close);

  box.appendChild(header);

  REPORTS.forEach(rep => {
    const btn = document.createElement('button');
    btn.textContent = rep.label;
    btn.style.display = 'block';
    btn.style.width = '100%';
    btn.style.margin = '3px 0';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.padding = '6px 4px';
    btn.style.fontSize = '12px';
    btn.style.cursor = 'pointer';
    btn.style.background = '#2d3f63';
    btn.style.color = '#fff';
    btn.onclick = () => abrirRelatorio(rep.id);
    box.appendChild(btn);
  });

  document.body.appendChild(box);
})();
