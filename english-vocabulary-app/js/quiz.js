// Quiz engine: 5 quiz types, 10 questions each, scoring + review.
const Q = { active: false, type: '', qs: [], i: 0, score: 0, wrong: [], ans: null };
const QT = {
  mcq: ['Multiple Choice', 'fa-list-check', 'Pick the correct meaning'],
  pic: ['Guess from Picture', 'fa-image', 'Which word matches the picture?'],
  match: ['Match Meanings', 'fa-arrows-left-right', 'Match words with Khmer meanings'],
  fill: ['Fill in the Blank', 'fa-pen-to-square', 'Complete the sentence'],
  listen: ['Listen & Choose', 'fa-headphones', 'Hear a word, pick the right one']
};
const rx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function qStart(t) {
  if (S.words.length < 4) { toast('Add at least 4 words first'); return false; }
  Q.active = true; Q.type = t; Q.i = 0; Q.score = 0; Q.wrong = []; Q.ans = null;
  Q.qs = shuffle(S.words).slice(0, 10).map(w => qMake(t, w));
  return true;
}
function qMake(t, w) {
  const d = () => shuffle([w, ...shuffle(S.words.filter(x => x.id !== w.id)).slice(0, 3)]);
  if (t === 'mcq') return { w, prompt: `What does <b>${esc(w.word)}</b> mean?`, opts: d().map(x => x.definition), ans: w.definition };
  if (t === 'match') return { w, prompt: `Match <b>${esc(w.word)}</b> with its Khmer meaning`, opts: d().map(x => x.translation), ans: w.translation };
  if (t === 'pic') return { w, pic: true, prompt: 'Which word matches the picture?', opts: d().map(x => x.word), ans: w.word };
  if (t === 'listen') return { w, listen: true, prompt: 'Listen and choose the correct word', opts: d().map(x => x.word), ans: w.word };
  const re = new RegExp(rx(esc(w.word)), 'i');
  const ex = esc(w.example);
  return { w, input: true, prompt: re.test(ex) ? ex.replace(re, '_____') : 'Definition: ' + esc(w.definition), ans: w.word };
}
function qAnswer(v) {
  if (Q.ans) return;
  const q = Q.qs[Q.i], ok = v.trim().toLowerCase() === q.ans.toLowerCase();
  Q.ans = { val: v, ok };
  if (ok) Q.score++; else Q.wrong.push({ w: q.w.word, you: v || '—', ans: q.ans });
  Store.log(); render();
}
function qCheck() { const f = document.getElementById('fill'); if (f && f.value.trim()) qAnswer(f.value); }
function qNext() {
  Q.i++; Q.ans = null;
  if (Q.i >= Q.qs.length) { S.quiz.push({ d: Store.today(), t: QT[Q.type][0], s: Q.score, n: Q.qs.length }); Store.save(); }
  render();
}
function qHTML() {
  if (!Q.active) return `<h1>Quizzes</h1><p class="sub">Pick a quiz type — 10 questions each.</p><div class="grid">${Object.entries(QT).map(([k, v]) => `<div class="panel qcard" data-act="qstart" data-t="${k}"><i class="fa-solid ${v[1]}"></i><h3>${v[0]}</h3><p class="sub">${v[2]}</p></div>`).join('')}</div>`;
  if (Q.i >= Q.qs.length) {
    const n = Q.qs.length, p = Math.round(Q.score / n * 100);
    return `<h1>Quiz Results</h1><div class="panel center"><div class="ring">${p}%</div>
    <div class="stats"><div><span>Total questions</span><b>${n}</b></div><div><span>Correct</span><b>${Q.score}</b></div><div><span>Wrong</span><b>${n - Q.score}</b></div><div><span>Score</span><b>${p}%</b></div></div>
    <h3>Review incorrect answers</h3>${Q.wrong.length ? Q.wrong.map(x => `<div class="rev"><b>${esc(x.w)}</b><span>Your answer: ${esc(x.you)}</span><span class="okt">Correct: ${esc(x.ans)}</span></div>`).join('') : '<p class="empty">Perfect score! 🎉</p>'}
    <div class="row"><button class="btn" data-act="qstart" data-t="${Q.type}">Try again</button><button class="btn ghost" data-act="qquit">All quizzes</button></div></div>`;
  }
  const q = Q.qs[Q.i], a = Q.ans;
  const opts = q.input
    ? `<div class="row"><input id="fill" autocomplete="off" placeholder="Type the missing word" ${a ? 'disabled' : ''} value="${a ? esc(a.val) : ''}"><button class="btn" data-act="qcheck" ${a ? 'disabled' : ''}>Check</button></div><p class="sub">Hint: ${esc(q.w.translation)}</p>`
    : q.opts.map(o => `<button class="opt ${a ? (o === q.ans ? 'good' : o === a.val ? 'bad' : '') : ''}" data-act="qans" data-v="${esc(o)}" ${a ? 'disabled' : ''}>${esc(o)}</button>`).join('');
  return `<h1>${QT[Q.type][0]}</h1><div class="panel qbox"><div class="progress"><div style="width:${Q.i / Q.qs.length * 100}%"></div></div>
  <p class="sub">Question ${Q.i + 1} of ${Q.qs.length} · Score ${Q.score}</p>
  ${q.pic ? pic(q.w, true) : ''}${q.listen ? '<button class="btn" data-act="qlisten"><i class="fa-solid fa-volume-high"></i> Play word</button>' : ''}
  <h2>${q.prompt}</h2>${opts}
  ${a ? `<p class="fb ${a.ok ? 'okt' : 'badt'}">${a.ok ? '✓ Correct!' : '✗ Correct answer: ' + esc(q.ans)}</p><button class="btn" data-act="qnext">${Q.i + 1 >= Q.qs.length ? 'Finish' : 'Next'} <i class="fa-solid fa-arrow-right"></i></button>` : ''}
  <button class="link" data-act="qquit">Quit quiz</button></div>`;
}
