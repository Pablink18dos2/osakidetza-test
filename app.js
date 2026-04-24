'use strict';

// ── Constantes ─────────────────────────────────────────────────────────────

const TOTAL_QS   = 609;   // 174 comun + 435 especifico
const LS_Q       = 'osk_q_';
const LS_META    = 'osk_meta';
const LS_DARK    = 'osk_dark';

// ── State ──────────────────────────────────────────────────────────────────

const state = {
  questions: [],
  index:     0,
  selected:  null,
  checked:   false,
  correct:   0,
  section:   null,
  qty:       null,
  topN:      null,
  data: { comun: null, especifico: null },
};

// ── DOM refs ───────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const screens = {
  start:   $('screen-start'),
  quiz:    $('screen-quiz'),
  summary: $('screen-summary'),
};

// ── Screen helpers ─────────────────────────────────────────────────────────

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  if (name === 'start') renderStats();
}

// ── localStorage: historial por pregunta ───────────────────────────────────

function getQKey(section, id) {
  return `${LS_Q}${section}_${id}`;
}

function getQStats(section, id) {
  const raw = localStorage.getItem(getQKey(section, id));
  return raw ? JSON.parse(raw) : { attempts: 0, wrong: 0 };
}

function saveQResult(section, id, isCorrect) {
  const s = getQStats(section, id);
  s.attempts++;
  if (!isCorrect) s.wrong++;
  localStorage.setItem(getQKey(section, id), JSON.stringify(s));
}

function getMeta() {
  const raw = localStorage.getItem(LS_META);
  return raw ? JSON.parse(raw) : { bestSession: 0 };
}

function saveMeta(sessionPct) {
  const m = getMeta();
  if (sessionPct > m.bestSession) {
    m.bestSession = sessionPct;
    localStorage.setItem(LS_META, JSON.stringify(m));
  }
}

// ── Estadísticas de inicio ─────────────────────────────────────────────────

function renderStats() {
  let uniqueAnswered = 0;
  let totalAttempts  = 0;
  let totalWrong     = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith(LS_Q)) continue;
    const s = JSON.parse(localStorage.getItem(key));
    if (s.attempts > 0) {
      uniqueAnswered++;
      totalAttempts += s.attempts;
      totalWrong    += s.wrong;
    }
  }

  if (uniqueAnswered === 0) {
    $('stats-block').style.display = 'none';
    return;
  }

  const aciertoPct = Math.round(((totalAttempts - totalWrong) / totalAttempts) * 100);
  const meta       = getMeta();

  $('stat-cobertura').textContent = `${uniqueAnswered} / ${TOTAL_QS}`;
  $('stat-acierto').textContent   = `${aciertoPct}%`;
  $('stat-mejor').textContent     = meta.bestSession > 0 ? `${meta.bestSession}%` : '—';
  $('stats-block').style.display  = '';

  // Actualizar estado del botón refuerzo
  updateRefuerzoBtn();
}

// ── Dark mode ──────────────────────────────────────────────────────────────

function initDarkMode() {
  const saved  = localStorage.getItem(LS_DARK);
  const isDark = saved === null ? true : saved === '1';   // dark por defecto
  if (isDark) {
    document.documentElement.classList.add('dark');
    $('btn-dark').textContent = '☀️';
  } else {
    $('btn-dark').textContent = '🌙';
  }
  if (saved === null) localStorage.setItem(LS_DARK, '1');
}

$('btn-dark').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(LS_DARK, isDark ? '1' : '0');
  $('btn-dark').textContent = isDark ? '☀️' : '🌙';
});

// ── Data loading ───────────────────────────────────────────────────────────

async function loadData(section) {
  if (state.data[section]) return state.data[section];
  const res  = await fetch(`data/${section}.json`);
  const json = await res.json();
  // Añadir _section a cada pregunta para poder guardar stats después
  state.data[section] = json.questions.map(q => ({ ...q, _section: section }));
  return state.data[section];
}

// ── Shuffle ────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Start screen: pickers ─────────────────────────────────────────────────

function initPickers() {
  // Pickers de sección y cantidad (test normal)
  ['section-picker', 'qty-picker'].forEach(groupId => {
    $(groupId).querySelectorAll('.btn-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        $(groupId).querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (groupId === 'section-picker') state.section = btn.dataset.value;
        else state.qty = btn.dataset.value === 'all' ? Infinity : parseInt(btn.dataset.value);
        updateStartBtn();
      });
    });
  });

  // Picker de TOP fallos
  $('top-picker').querySelectorAll('.btn-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      $('top-picker').querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.topN = parseInt(btn.dataset.value);
      updateRefuerzoBtn();
    });
  });
}

function updateStartBtn() {
  $('btn-start').disabled = !(state.section && state.qty);
}

function updateRefuerzoBtn() {
  if (!state.topN) { $('btn-refuerzo').disabled = true; return; }

  // Contar preguntas con al menos 1 intento
  let attempted = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(LS_Q)) {
      const s = JSON.parse(localStorage.getItem(key));
      if (s.attempts > 0) attempted++;
    }
  }
  $('btn-refuerzo').disabled = attempted === 0;
}

// ── Test normal ────────────────────────────────────────────────────────────

$('btn-start').addEventListener('click', startTest);

async function startTest() {
  $('btn-start').disabled = true;
  $('btn-start').textContent = 'Cargando…';

  let pool = [];
  if (state.section === 'comun' || state.section === 'mixto') {
    pool = pool.concat(await loadData('comun'));
  }
  if (state.section === 'especifico' || state.section === 'mixto') {
    pool = pool.concat(await loadData('especifico'));
  }

  const shuffled    = shuffle(pool);
  state.questions   = state.qty === Infinity ? shuffled : shuffled.slice(0, state.qty);
  state.index       = 0;
  state.correct     = 0;

  $('btn-start').textContent = 'Empezar test';
  $('btn-start').disabled    = !(state.section && state.qty);

  showScreen('quiz');
  renderQuestion();
}

// ── TOP fallos ─────────────────────────────────────────────────────────────

$('btn-refuerzo').addEventListener('click', startTopFallos);

async function startTopFallos() {
  $('btn-refuerzo').disabled = true;
  $('btn-refuerzo').textContent = 'Cargando…';

  // Asegurar datos cargados
  await Promise.all([loadData('comun'), loadData('especifico')]);

  // Construir mapa id→question para búsqueda rápida
  const qMap = {};
  ['comun', 'especifico'].forEach(sec => {
    state.data[sec].forEach(q => { qMap[`${sec}_${q.id}`] = q; });
  });

  // Recoger stats y calcular % fallo
  const scored = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith(LS_Q)) continue;
    const s = JSON.parse(localStorage.getItem(key));
    if (s.attempts === 0) continue;

    const qid = key.slice(LS_Q.length);  // "comun_1" o "especifico_23"
    const q   = qMap[qid];
    if (!q) continue;

    const failPct = (s.wrong / s.attempts) * 100;
    if (failPct > 0) scored.push({ q, failPct });
  }

  // Ordenar por % fallo desc, tomar top N
  scored.sort((a, b) => b.failPct - a.failPct);
  const pool = scored.slice(0, state.topN).map(x => x.q);

  $('btn-refuerzo').textContent = 'Empezar refuerzo';
  $('btn-refuerzo').disabled    = false;

  if (pool.length === 0) {
    alert('Aún no tienes preguntas falladas guardadas. Haz primero algún test.');
    return;
  }

  state.questions = shuffle(pool);
  state.index     = 0;
  state.correct   = 0;

  showScreen('quiz');
  renderQuestion();
}

// ── Quiz rendering ─────────────────────────────────────────────────────────

function renderQuestion() {
  const q = state.questions[state.index];
  state.selected = null;
  state.checked  = false;

  // Progreso
  const pct = Math.round((state.index / state.questions.length) * 100);
  $('progress-fill').style.width  = pct + '%';
  $('progress-label').textContent = `${state.index + 1} / ${state.questions.length}`;

  // Pregunta
  $('question-number').textContent = `Pregunta ${q.id}`;
  $('question-text').textContent   = q.text;
  $('disputed-badge').style.display = q.disputed ? 'inline-flex' : 'none';

  // Opciones
  const list = $('options-list');
  list.innerHTML = '';
  ['a', 'b', 'c', 'd'].forEach(letter => {
    if (!q.options[letter]) return;
    const li  = document.createElement('li');
    const btn = document.createElement('button');
    btn.className       = 'option-btn';
    btn.dataset.letter  = letter;
    btn.innerHTML       = `<span class="option-letter">${letter})</span> <span>${q.options[letter]}</span>`;
    btn.addEventListener('click', () => selectOption(letter));
    li.appendChild(btn);
    list.appendChild(li);
  });

  // Panel oculto
  $('reveal-panel').classList.remove('visible');
  $('discrepancy-banner').style.display = 'none';
  $('note-text').textContent = '';

  // Botones
  $('btn-check').style.display = '';
  $('btn-check').disabled      = true;
  $('btn-next').style.display  = 'none';
}

function selectOption(letter) {
  if (state.checked) return;
  state.selected = letter;
  $('options-list').querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.letter === letter);
  });
  $('btn-check').disabled = false;
}

// ── Comprobar ──────────────────────────────────────────────────────────────

$('btn-check').addEventListener('click', checkAnswer);

function checkAnswer() {
  if (!state.selected || state.checked) return;
  state.checked = true;

  const q          = state.questions[state.index];
  const official   = q.answers.osakidetza;
  const userPicked = state.selected;
  const isCorrect  = userPicked === official;

  if (isCorrect) state.correct++;

  // Guardar en historial
  saveQResult(q._section, q.id, isCorrect);

  // Colorear opciones
  $('options-list').querySelectorAll('.option-btn').forEach(btn => {
    const l = btn.dataset.letter;
    btn.disabled = true;
    if (l === official)              btn.classList.add('revealed-correct');
    if (l === userPicked && !isCorrect) btn.classList.add('incorrect');
  });

  renderSources(q);

  $('btn-check').style.display = 'none';
  $('btn-next').style.display  = '';
}

function renderSources(q) {
  const official = q.answers.osakidetza;

  const sources = [
    { key: 'osakidetza', label: 'Osakidetza', official: true },
    { key: 'esk',        label: 'ESK',         official: false },
    { key: 'ccoo',       label: 'CCOO/UTESSE',  official: false },
    { key: 'ugt',        label: 'UGT',          official: false },
  ];

  const grid = $('sources-grid');
  grid.innerHTML = '';

  sources.forEach(src => {
    const ans    = q.answers[src.key];
    const differs = ans && ans !== official;
    const row    = document.createElement('div');
    row.className = 'source-row' + (src.official ? ' official' : '');
    row.innerHTML = `
      <span class="source-name">
        ${src.label}
        ${src.official ? '<span class="official-badge">OFICIAL</span>' : ''}
      </span>
      <span class="source-answer ${!ans ? 'no-data' : ''} ${differs ? 'differs' : ''}">
        ${ans ? ans.toUpperCase() : '—'}
      </span>`;
    grid.appendChild(row);
  });

  if (q.has_discrepancy) $('discrepancy-banner').style.display = '';
  if (q.note)            $('note-text').textContent = q.note;

  $('reveal-panel').classList.add('visible');
}

// ── Siguiente / fin ────────────────────────────────────────────────────────

$('btn-next').addEventListener('click', () => {
  state.index++;
  if (state.index >= state.questions.length) showSummary();
  else renderQuestion();
});

// ── Resumen ────────────────────────────────────────────────────────────────

function showSummary() {
  const total = state.questions.length;
  const pct   = Math.round((state.correct / total) * 100);
  saveMeta(pct);

  $('score-pct').textContent    = pct + '%';
  $('score-detail').textContent = `${state.correct} correctas de ${total} preguntas`;

  // GIF aleatorio
  const n = Math.floor(Math.random() * 5) + 1;
  $('gif-container').innerHTML =
    `<img src="Images/gif_fin_test/${n}gifEnf.gif" class="result-gif" alt="¡Ánimo!" />`;

  showScreen('summary');
}

$('btn-repeat').addEventListener('click', () => {
  state.index     = 0;
  state.correct   = 0;
  state.questions = shuffle(state.questions);
  showScreen('quiz');
  renderQuestion();
});

$('btn-home').addEventListener('click', () => {
  state.section = null;
  state.qty     = null;
  state.topN    = null;
  ['section-picker', 'qty-picker', 'top-picker'].forEach(groupId => {
    $(groupId).querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('selected'));
  });
  updateStartBtn();
  showScreen('start');
});

// ── Salir del test ─────────────────────────────────────────────────────────

$('btn-exit-quiz').addEventListener('click', () => {
  if (!confirm('¿Salir del test? Las preguntas ya respondidas quedan guardadas.')) return;
  state.section = null;
  state.qty     = null;
  state.topN    = null;
  ['section-picker', 'qty-picker', 'top-picker'].forEach(groupId => {
    $(groupId).querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('selected'));
  });
  updateStartBtn();
  showScreen('start');
});

// ── Reiniciar estadísticas ─────────────────────────────────────────────────

$('btn-reset-stats').addEventListener('click', () => {
  if (!confirm('¿Seguro que quieres borrar todas las estadísticas?\nEsta acción no se puede deshacer.')) return;
  if (!confirm('Segunda confirmación: ¿borrar definitivamente todos los datos guardados?')) return;

  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith(LS_Q) || k === LS_META) toRemove.push(k);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
  renderStats();
});

// ── Init ───────────────────────────────────────────────────────────────────

initDarkMode();
initPickers();
renderStats();
