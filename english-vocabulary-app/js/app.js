// App shell: state, pages, navigation, events.
const S = Store.load();
if (!S.words) S.words = VOCAB.map(x => ({ ...x }));
const $ = s => document.querySelector(s);
let page = 'dashboard';
const UI = { q: '', cat: 'All' };
const NAV = [['dashboard','Dashboard','fa-gauge'],['learn','Learn Vocabulary','fa-book-open'],['categories','Categories','fa-layer-group'],['flashcards','Flashcards','fa-clone'],['quizzes','Quizzes','fa-circle-question'],['favorites','My Favorites','fa-heart'],['progress','My Progress','fa-chart-line'],['settings','Settings','fa-gear']];

const cnt = () => ({ k: S.words.filter(w => S.status[w.id] === 'known').length, l: S.words.filter(w => S.status[w.id] === 'learning').length });
const today = () => S.act[Store.today()] || 0;
function chart() {
  const a = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); a.push({ d: d.toLocaleDateString('en', { weekday: 'short' }), n: S.act[Store.dk(d)] || 0 }); }
  const m = Math.max(S.goal, ...a.map(x => x.n));
  return `<div class="chart">${a.map(x => `<div class="bar"><b>${x.n}</b><i style="height:${x.n / m * 100}%"></i><span>${x.d}</span></div>`).join('')}</div>`;
}
const wcard = w => `<div class="wc">${pic(w)}<div class="wb"><h3>${esc(w.word)}</h3><p class="km">${esc(w.translation)}</p><span class="tag">${esc(w.category)}</span>${S.status[w.id] === 'known' ? ' <span class="okt">✓ Known</span>' : ''}
<div class="row"><button data-speak="${esc(w.word)}" title="Pronounce"><i class="fa-solid fa-volume-high"></i></button><button data-act="fav" data-id="${w.id}" class="${S.fav.includes(w.id) ? 'on' : ''}" title="Favorite"><i class="fa-solid fa-heart"></i></button><button data-act="edit" data-id="${w.id}" title="Edit"><i class="fa-solid fa-pen"></i></button><button data-act="del" data-id="${w.id}" title="Delete"><i class="fa-solid fa-trash"></i></button></div></div></div>`;
function list(fav) {
  const q = UI.q.toLowerCase();
  return S.words.filter(w => (UI.cat === 'All' || w.category === UI.cat) && (!fav || S.fav.includes(w.id)) && (!q || (w.word + w.translation + w.definition).toLowerCase().includes(q)));
}
const grid = fav => { const l = list(fav); return l.length ? l.map(wcard).join('') : '<p class="empty">No words found.</p>'; };
const tools = add => `<div class="tools"><input id="lq" data-in="q" placeholder="Search words..." value="${esc(UI.q)}"><select data-ch="lcat">${catOpts(UI.cat)}</select>${add ? '<button class="btn" data-act="add"><i class="fa-solid fa-plus"></i> Add word</button>' : ''}</div>`;

const PAGES = {
  dashboard() {
    const { k } = cnt(), t = today(), g = S.goal;
    const rec = (S.recent || []).map(id => S.words.find(w => w.id === id)).filter(Boolean);
    return `<h1>Welcome back, ${esc(S.name)}! 👋</h1><p class="sub">Ready to learn some new words today?</p>
    <div class="stats"><div><span>Words learned</span><b>${k}</b></div><div><span>Daily goal</span><b>${Math.min(t, g)}/${g}</b><div class="progress"><div style="width:${Math.min(100, t / g * 100)}%"></div></div></div><div><span>Learning streak</span><b>🔥 ${Store.streak()} days</b></div><div><span>Total flashcards</span><b>${S.words.length}</b></div></div>
    <button class="btn" data-act="nav" data-p="flashcards"><i class="fa-solid fa-play"></i> Continue Learning</button>
    <div class="two"><div class="panel"><h3>Daily progress</h3>${chart()}</div><div class="panel"><h3>Recently learned</h3>${rec.length ? rec.map(w => `<div class="rec">${pic(w)}<div><b>${esc(w.word)}</b><br><small>${esc(w.translation)}</small></div></div>`).join('') : '<p class="empty">Mark flashcards as Known to see them here.</p>'}</div></div>`;
  },
  learn: () => `<h1>Learn Vocabulary</h1>${tools(true)}<div class="grid" id="grid">${grid()}</div>`,
  favorites: () => `<h1>My Favorites</h1>${tools(false)}<div class="grid" id="grid">${grid(true)}</div>`,
  categories: () => `<h1>Categories</h1><p class="sub">Choose a topic to explore.</p><div class="grid">${CATS.map(([n, ic]) => {
    const ws = S.words.filter(w => w.category === n), k = ws.filter(w => S.status[w.id] === 'known').length;
    return `<div class="panel cat"><i class="fa-solid ${ic}"></i><h3>${n}</h3><p class="sub">${ws.length} words · ${k} known</p><div class="progress"><div style="width:${ws.length ? k / ws.length * 100 : 0}%"></div></div><div class="row"><button class="btn sm" data-act="cat" data-c="${esc(n)}">Browse</button><button class="btn sm ghost" data-act="fccat" data-c="${esc(n)}">Flashcards</button></div></div>`;
  }).join('')}</div>`,
  flashcards: fcHTML,
  quizzes: qHTML,
  progress() {
    const { k, l } = cnt(), qs = S.quiz.slice(-8).reverse();
    const avg = S.quiz.length ? Math.round(S.quiz.reduce((a, x) => a + x.s / x.n, 0) / S.quiz.length * 100) : 0;
    return `<h1>My Progress</h1><div class="stats"><div><span>Words learned</span><b>${k}</b></div><div><span>Still learning</span><b>${l}</b></div><div><span>Streak</span><b>🔥 ${Store.streak()}</b></div><div><span>Favorites</span><b>${S.fav.length}</b></div><div><span>Avg quiz score</span><b>${avg}%</b></div></div>
    <div class="two"><div class="panel"><h3>Daily activity</h3>${chart()}</div><div class="panel"><h3>Quiz scores</h3>${qs.length ? qs.map(x => `<div class="rec"><b>${x.s}/${x.n}</b><span>${esc(x.t)}</span><small>${x.d}</small></div>`).join('') : '<p class="empty">No quizzes yet.</p>'}</div></div>`;
  },
  settings: () => `<h1>Settings</h1><div class="panel fm"><label>Your name<input id="sname" value="${esc(S.name)}"></label><label>Daily goal (words/activities)<input id="sgoal" type="number" min="1" max="200" value="${S.goal}"></label><div class="row"><button class="btn" data-act="savesettings">Save</button><button class="btn warn" data-act="reset">Reset all progress</button></div></div>`
};

function go(p) { page = p; if (p === 'flashcards') fcBuild(); document.body.classList.remove('nav-open'); render(); window.scrollTo(0, 0); }
function render() {
  $('#nav').innerHTML = NAV.map(n => `<button class="${page === n[0] ? 'on' : ''}" data-act="nav" data-p="${n[0]}"><i class="fa-solid ${n[2]}"></i>${n[1]}</button>`).join('');
  $('#streak').textContent = '🔥 ' + Store.streak();
  $('#view').innerHTML = PAGES[page]();
  if (page === 'quizzes' && Q.active) {
    const q = Q.qs[Q.i];
    if (q && q.listen && !Q.ans) setTimeout(() => speak(q.w.word, true), 300);
    const f = $('#fill'); if (f && !f.disabled) f.focus();
  }
}

function form(id) {
  const w = id ? S.words.find(x => x.id === id) : {};
  const f = (k, l, ph = '') => `<label>${l}<input name="${k}" value="${esc(w[k] || '')}" placeholder="${ph}"></label>`;
  $('#modal').innerHTML = `<form class="panel fm" id="wf"><h3>${id ? 'Edit' : 'Add'} vocabulary</h3>${f('word', 'English word')}${f('translation', 'Khmer translation')}${f('definition', 'Definition')}${f('example', 'Example sentence')}${f('partOfSpeech', 'Part of speech', 'Noun')}${f('image', 'Picture (emoji or image URL)', '🍎')}<label>Category<select name="category">${CATS.map(c => `<option ${w.category === c[0] ? 'selected' : ''}>${c[0]}</option>`).join('')}</select></label><div class="row"><button class="btn" type="submit">Save</button><button class="btn ghost" type="button" data-act="close">Cancel</button></div></form>`;
  $('#modal').classList.add('show');
  $('#wf').onsubmit = e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    if (!d.word.trim() || !d.translation.trim() || !d.definition.trim()) { toast('Word, translation and definition are required'); return; }
    d.word = d.word.trim(); d.pronunciation = d.word;
    if (id) Object.assign(w, d); else S.words.push({ id: S.nextId++, synonyms: '', ...d });
    Store.save(); ACT.close(); render(); toast('Saved ✓');
  };
}

const ACT = {
  nav: (i, el) => go(el.dataset.p),
  menu: () => document.body.classList.toggle('nav-open'),
  cat: (i, el) => { UI.cat = el.dataset.c; UI.q = ''; $('#gsearch').value = ''; go('learn'); },
  fccat: (i, el) => { FC.cat = el.dataset.c; go('flashcards'); },
  flip: () => { FC.flip = !FC.flip; $('.card').classList.toggle('flipped'); },
  next: () => fcMove(1), prev: () => fcMove(-1),
  shuffle: () => { fcBuild(true); render(); },
  known: () => mark('known'), learning: () => mark('learning'),
  fav: i => { const x = S.fav.indexOf(i); x < 0 ? S.fav.push(i) : S.fav.splice(x, 1); Store.save(); render(); },
  add: () => form(), edit: i => form(i),
  close: () => $('#modal').classList.remove('show'),
  del: i => { if (!confirm('Delete this word?')) return; S.words = S.words.filter(w => w.id !== i); S.fav = S.fav.filter(x => x !== i); delete S.status[i]; Store.save(); render(); },
  qstart: (i, el) => { if (qStart(el.dataset.t)) render(); },
  qquit: () => { Q.active = false; render(); },
  qans: (i, el) => qAnswer(el.dataset.v), qcheck: qCheck, qnext: qNext,
  qlisten: () => speak(Q.qs[Q.i].w.word, true),
  savesettings: () => { S.name = $('#sname').value.trim() || 'Learner'; S.goal = Math.max(1, +$('#sgoal').value || 10); Store.save(); toast('Settings saved ✓'); },
  reset: () => { if (confirm('Erase all progress and custom words?')) { Store.reset(); location.reload(); } }
};

document.addEventListener('click', e => {
  const s = e.target.closest('[data-speak]');
  if (s) { e.stopPropagation(); speak(s.dataset.speak); return; }
  const el = e.target.closest('[data-act]');
  if (el && ACT[el.dataset.act]) ACT[el.dataset.act](+el.dataset.id, el);
});
document.addEventListener('input', e => {
  const k = e.target.dataset.in; if (!k) return;
  UI.q = e.target.value;
  if (page !== 'learn' && page !== 'favorites') { page = 'learn'; render(); return; }
  $('#grid').innerHTML = grid(page === 'favorites');
  const a = $('#lq'), b = $('#gsearch');
  if (a && a !== e.target) a.value = UI.q;
  if (b !== e.target) b.value = UI.q;
});
document.addEventListener('change', e => {
  const c = e.target.dataset.ch;
  if (c === 'lcat') { UI.cat = e.target.value; $('#grid').innerHTML = grid(page === 'favorites'); }
  if (c === 'fccat') { FC.cat = e.target.value; fcBuild(); render(); }
});
document.addEventListener('keydown', e => {
  if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) { if (e.key === 'Enter' && e.target.id === 'fill') qCheck(); return; }
  if (page !== 'flashcards' || !FC.deck.length) return;
  const k = e.key.toLowerCase();
  if (k === 'arrowright') fcMove(1);
  else if (k === 'arrowleft') fcMove(-1);
  else if (k === ' ') { e.preventDefault(); ACT.flip(); }
  else if (k === 'k') mark('known');
  else if (k === 'l') mark('learning');
  else if (k === 's') speak(FC.deck[FC.i].word);
});

fcBuild();
render();
