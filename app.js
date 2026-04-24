'use strict';

// ── State ──────────────────────────────────────────────────────────────────

const state = {
  questions: [],      // all questions in current test
  index: 0,           // current question index
  selected: null,     // selected option key ('a','b','c','d')
  checked: false,     // has user clicked "Comprobar"?
  correct: 0,         // correct answers so far
  section: null,      // 'comun' | 'especifico' | 'mixto'
  qty: null,          // number (or Infinity for all)
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
}

// ── Data loading ───────────────────────────────────────────────────────────

async function loadData(section) {
  if (state.data[section]) return state.data[section];
  const res  = await fetch(`data/${section}.json`);
  const json = await res.json();
  state.data[section] = json.questions;
  return json.questions;
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

// ── Start screen ───────────────────────────────────────────────────────────

function initPickers() {
  ['section-picker', 'qty-picker'].forEach(groupId => {
    $( groupId).querySelectorAll('.btn-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        $(groupId).querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (groupId === 'section-picker') state.section = btn.dataset.value;
        else state.qty = btn.dataset.value === 'all' ? Infinity : parseInt(btn.dataset.value);
        updateStartBtn();
      });
    });
  });
}

function updateStartBtn() {
  $('btn-start').disabled = !(state.section && state.qty);
}

$('btn-start').addEventListener('click', startTest);

async function startTest() {
  $('btn-start').disabled = true;
  $('btn-start').textContent = 'Cargando…';

  let pool = [];
  if (state.section === 'comun' || state.section === 'mixto') {
    const d = await loadData('comun');
    pool = pool.concat(d);
  }
  if (state.section === 'especifico' || state.section === 'mixto') {
    const d = await loadData('especifico');
    pool = pool.concat(d);
  }

  const shuffled = shuffle(pool);
  state.questions = state.qty === Infinity ? shuffled : shuffled.slice(0, state.qty);
  state.index   = 0;
  state.correct = 0;

  $('btn-start').textContent = 'Empezar test';
  $('btn-start').disabled = false;

  showScreen('quiz');
  renderQuestion();
}

// ── Quiz rendering ─────────────────────────────────────────────────────────

function renderQuestion() {
  const q = state.questions[state.index];
  state.selected = null;
  state.checked  = false;

  // Progress
  const pct = Math.round((state.index / state.questions.length) * 100);
  $('progress-fill').style.width = pct + '%';
  $('progress-label').textContent = `${state.index + 1} / ${state.questions.length}`;

  // Question header
  $('question-number').textContent = `Pregunta ${q.id}`;
  $('question-text').textContent   = q.text;

  // Disputed
  $('disputed-badge').style.display = q.disputed ? 'inline-flex' : 'none';

  // Options
  const list = $('options-list');
  list.innerHTML = '';
  const letters = ['a', 'b', 'c', 'd'];
  letters.forEach(letter => {
    if (!q.options[letter]) return;
    const li  = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.letter = letter;
    btn.innerHTML = `<span class="option-letter">${letter})</span> <span>${q.options[letter]}</span>`;
    btn.addEventListener('click', () => selectOption(letter));
    li.appendChild(btn);
    list.appendChild(li);
  });

  // Reveal panel hidden
  $('reveal-panel').classList.remove('visible');
  $('discrepancy-banner').style.display = 'none';
  $('note-text').textContent = '';

  // Buttons
  $('btn-check').style.display = '';
  $('btn-check').disabled = true;
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

// ── Check answer ───────────────────────────────────────────────────────────

$('btn-check').addEventListener('click', checkAnswer);

function checkAnswer() {
  if (!state.selected || state.checked) return;
  state.checked = true;

  const q          = state.questions[state.index];
  const official   = q.answers.osakidetza;
  const userPicked = state.selected;
  const isCorrect  = userPicked === official;

  if (isCorrect) state.correct++;

  // Colour options
  $('options-list').querySelectorAll('.option-btn').forEach(btn => {
    const l = btn.dataset.letter;
    btn.disabled = true;
    if (l === official)   btn.classList.add('revealed-correct');
    if (l === userPicked && !isCorrect) btn.classList.add('incorrect');
  });

  // Sources panel
  renderSources(q, userPicked);

  $('btn-check').style.display = 'none';
  $('btn-next').style.display  = '';
}

function renderSources(q, userPicked) {
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
    const ans = q.answers[src.key];
    const row = document.createElement('div');
    row.className = 'source-row' + (src.official ? ' official' : '');

    const differs = ans && ans !== official;

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

  // Discrepancy banner
  if (q.has_discrepancy) {
    $('discrepancy-banner').style.display = '';
  }

  // Note
  if (q.note) {
    $('note-text').textContent = q.note;
  }

  $('reveal-panel').classList.add('visible');
}

// ── Next / finish ──────────────────────────────────────────────────────────

$('btn-next').addEventListener('click', () => {
  state.index++;
  if (state.index >= state.questions.length) {
    showSummary();
  } else {
    renderQuestion();
  }
});

// ── Summary ────────────────────────────────────────────────────────────────

function showSummary() {
  const total = state.questions.length;
  const pct   = Math.round((state.correct / total) * 100);
  $('score-pct').textContent    = pct + '%';
  $('score-detail').textContent = `${state.correct} correctas de ${total} preguntas`;
  showScreen('summary');
}

$('btn-repeat').addEventListener('click', () => {
  state.index   = 0;
  state.correct = 0;
  state.questions = shuffle(state.questions);
  showScreen('quiz');
  renderQuestion();
});

$('btn-home').addEventListener('click', () => {
  state.section = null;
  state.qty     = null;
  ['section-picker', 'qty-picker'].forEach(groupId => {
    $(groupId).querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('selected'));
  });
  updateStartBtn();
  showScreen('start');
});

// ── Init ───────────────────────────────────────────────────────────────────

initPickers();
