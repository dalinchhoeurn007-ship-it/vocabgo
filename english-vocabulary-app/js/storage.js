// LocalStorage wrapper: all user progress lives in one object.
const Store = {
  key: 'vocabgo_v1', d: null,
  load() {
    try { this.d = JSON.parse(localStorage.getItem(this.key)); } catch (e) { this.d = null; }
    if (!this.d) this.d = { words: null, status: {}, fav: [], recent: [], act: {}, quiz: [], goal: 10, name: 'Learner', nextId: 1000 };
    return this.d;
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) {} },
  dk(d = new Date()) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  today() { return this.dk(); },
  log() { const t = this.today(); this.d.act[t] = (this.d.act[t] || 0) + 1; this.save(); },
  streak() {
    let n = 0; const dt = new Date();
    if (!this.d.act[this.dk(dt)]) dt.setDate(dt.getDate() - 1);
    while (this.d.act[this.dk(dt)]) { n++; dt.setDate(dt.getDate() - 1); }
    return n;
  },
  reset() { try { localStorage.removeItem(this.key); } catch (e) {} }
};
