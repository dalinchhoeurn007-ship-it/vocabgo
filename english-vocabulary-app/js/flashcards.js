// Flashcard deck state + rendering.
const FC = { cat: 'All', deck: [], i: 0, flip: false };

function fcBuild(shuf) {
  const w = S.words.filter(x => FC.cat === 'All' || x.category === FC.cat);
  FC.deck = shuf ? shuffle(w) : w; FC.i = 0; FC.flip = false;
}
function fcMove(d) {
  if (!FC.deck.length) return;
  FC.i = (FC.i + d + FC.deck.length) % FC.deck.length; FC.flip = false; render();
}
function mark(s) {
  const w = FC.deck[FC.i]; if (!w) return;
  S.status[w.id] = s;
  if (s === 'known') S.recent = [w.id, ...(S.recent || []).filter(x => x !== w.id)].slice(0, 6);
  Store.log();
  toast(s === 'known' ? 'Marked as known ✅' : 'Keep practicing 💪');
  fcMove(1);
}
function catOpts(sel) {
  return ['All', ...CATS.map(c => c[0])].map(c => `<option ${c === sel ? 'selected' : ''}>${c}</option>`).join('');
}
function fcHTML() {
  const w = FC.deck[FC.i];
  const head = `<h1>Flashcards</h1><div class="tools"><select data-ch="fccat">${catOpts(FC.cat)}</select><button class="btn ghost" data-act="shuffle"><i class="fa-solid fa-shuffle"></i> Shuffle</button><span class="sub">${w ? `Card ${FC.i + 1} of ${FC.deck.length}` : ''}</span></div>`;
  if (!w) return head + '<p class="empty">No cards in this category.</p>';
  const k = FC.deck.filter(x => S.status[x.id] === 'known').length;
  return head + `<div class="progress"><div style="width:${k / FC.deck.length * 100}%"></div></div>
  <p class="sub">${k} of ${FC.deck.length} known · ← → navigate · Space flip · K known · L learning · S speak</p>
  <div class="card ${FC.flip ? 'flipped' : ''}" data-act="flip"><div class="in">
    <div class="face">${pic(w, true)}<div class="word">${esc(w.word)}</div><span class="tag">${esc(w.category)}</span>
      <div class="row"><button data-speak="${esc(w.word)}" title="Pronounce"><i class="fa-solid fa-volume-high"></i></button><button data-act="fav" data-id="${w.id}" class="${S.fav.includes(w.id) ? 'on' : ''}"><i class="fa-solid fa-heart"></i></button></div></div>
    <div class="face back"><span class="tag">${esc(w.partOfSpeech)}</span><p class="km big">${esc(w.translation)}</p><p>${esc(w.definition)}</p><p><i>“${esc(w.example)}”</i></p>${w.synonyms ? `<p class="sub">Synonyms: ${esc(w.synonyms)}</p>` : ''}</div>
  </div></div>
  <div class="fc-ctl"><button class="btn ghost" data-act="prev"><i class="fa-solid fa-arrow-left"></i></button><button class="btn warn" data-act="learning">Still learning</button><button class="btn good" data-act="known">Known</button><button class="btn ghost" data-act="next"><i class="fa-solid fa-arrow-right"></i></button></div>`;
}
