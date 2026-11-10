// Categories, 50 starter words, and shared helpers.
// Pictures use emoji illustrations (never break, work offline). In "Add word" you can also paste an image URL.
const CATS = [['Daily Life','fa-house'],['Food and Drinks','fa-utensils'],['Education','fa-graduation-cap'],['Technology','fa-laptop'],['Business and Finance','fa-briefcase'],['Travel','fa-plane'],['Health','fa-heart-pulse'],['Emotions and Feelings','fa-face-smile'],['Nature and Environment','fa-leaf'],['Work and Career','fa-building']];

// word|Khmer|definition|example|part of speech|picture|synonyms
const RAW = [
['Home|ផ្ទះ|The place where you live.|I go home after school.|Noun|🏠|house','Family|គ្រួសារ|A group of people who are related.|My family eats dinner together.|Noun|👨‍👩‍👧|','Friend|មិត្តភក្តិ|A person you like and know well.|She is my best friend.|Noun|🤝|buddy, pal','Clock|នាឡិកា|A device that shows the time.|The clock is on the wall.|Noun|🕒|','Beautiful|ស្រស់ស្អាត|Having a pleasing appearance.|The flowers are beautiful.|Adjective|🌈|pretty, lovely'],
['Apple|ផ្លែប៉ោម|A round fruit with red or green skin.|I eat an apple every day.|Noun|🍎|','Rice|បាយ|Small white grains cooked as food.|We eat rice for lunch.|Noun|🍚|','Water|ទឹក|A clear liquid that we drink.|Please drink more water.|Noun|💧|','Coffee|កាហ្វេ|A hot drink made from roasted beans.|He drinks coffee in the morning.|Noun|☕|','Bread|នំប៉័ង|A baked food made from flour.|I want bread with butter.|Noun|🍞|'],
['Teacher|គ្រូបង្រៀន|A person who helps students learn.|The teacher is very kind.|Noun|👩‍🏫|instructor','Book|សៀវភៅ|Pages with writing, bound together.|I read a book every week.|Noun|📖|','School|សាលារៀន|A place where children study.|My school is near my house.|Noun|🏫|','Pencil|ខ្មៅដៃ|A tool for writing or drawing.|Please give me a pencil.|Noun|✏️|','Student|សិស្ស|A person who studies at a school.|Every student has a bag.|Noun|🎒|pupil'],
['Computer|កុំព្យូទ័រ|A machine that stores and processes data.|I use a computer for homework.|Noun|💻|','Phone|ទូរស័ព្ទ|A device used to call people.|My phone is on the table.|Noun|📱|','Internet|អ៊ីនធឺណិត|A global network of computers.|The internet is very fast here.|Noun|🌐|web','Camera|កាមេរ៉ា|A device that takes photos.|She bought a new camera.|Noun|📷|','Robot|មនុស្សយន្ត|A machine that can do tasks automatically.|The robot can clean the floor.|Noun|🤖|'],
['Money|លុយ|Coins and notes used to buy things.|I save money every month.|Noun|💰|cash','Bank|ធនាគារ|A place that keeps and lends money.|The bank opens at eight.|Noun|🏦|','Market|ផ្សារ|A place where people buy and sell goods.|We buy fruit at the market.|Noun|🛒|','Price|តម្លៃ|The amount of money something costs.|The price is too high.|Noun|🏷️|cost','Contract|កិច្ចសន្យា|A written agreement between people.|Please sign the contract.|Noun|📝|agreement'],
['Airplane|យន្តហោះ|A vehicle that flies in the sky.|The airplane lands at noon.|Noun|✈️|plane','Ticket|សំបុត្រ|A paper that lets you enter or travel.|I bought a ticket online.|Noun|🎫|','Hotel|សណ្ឋាគារ|A place where travelers stay.|The hotel has a pool.|Noun|🏨|','Map|ផែនទី|A drawing that shows places.|Look at the map.|Noun|🗺️|','Passport|លិខិតឆ្លងដែន|A document for travel to other countries.|Do not forget your passport.|Noun|🛂|'],
['Doctor|វេជ្ជបណ្ឌិត|A person who treats sick people.|The doctor checks my health.|Noun|👨‍⚕️|physician','Medicine|ថ្នាំ|Something you take to get better.|Take the medicine twice a day.|Noun|💊|','Hospital|មន្ទីរពេទ្យ|A place where sick people get care.|He is in the hospital.|Noun|🏥|','Healthy|មានសុខភាពល្អ|Strong and not sick.|Fruit is healthy food.|Adjective|🥗|fit, well','Running|ការរត់|Moving fast on foot.|Running is good exercise.|Noun|🏃|jogging'],
['Happy|សប្បាយរីករាយ|Feeling joy.|I am happy today.|Adjective|😊|glad, joyful','Sad|ក្រៀមក្រំ|Feeling unhappy.|She is sad about the news.|Adjective|😢|unhappy, upset','Angry|ខឹង|Feeling strong displeasure.|He is angry with me.|Adjective|😠|mad, furious','Love|ស្រឡាញ់|To feel deep care for someone.|I love my mother.|Verb|❤️|adore','Afraid|ភ័យខ្លាច|Feeling fear.|The child is afraid of dogs.|Adjective|😨|scared'],
['Tree|ដើមឈើ|A tall plant with a trunk and leaves.|The tree gives shade.|Noun|🌳|','River|ទន្លេ|A large stream of flowing water.|The river is wide.|Noun|🏞️|','Mountain|ភ្នំ|A very high hill.|We climbed the mountain.|Noun|⛰️|','Sun|ព្រះអាទិត្យ|The star that gives us light.|The sun is bright today.|Noun|☀️|','Flower|ផ្កា|The colorful part of a plant.|She picked a flower.|Noun|🌻|bloom'],
['Office|ការិយាល័យ|A room where people work.|My office is on the third floor.|Noun|🏢|','Meeting|កិច្ចប្រជុំ|A gathering to discuss something.|The meeting starts at nine.|Noun|👥|','Manager|អ្នកគ្រប់គ្រង|A person who leads a team.|The manager is friendly.|Noun|👔|boss','Salary|ប្រាក់ខែ|Money paid for work each month.|His salary is good.|Noun|💵|pay','Job|ការងារ|Work that you do to earn money.|She found a new job.|Noun|💼|work, career']
];
const VOCAB = [];
RAW.forEach((rows, ci) => rows.forEach(r => {
  const [word, translation, definition, example, partOfSpeech, image, synonyms] = r.split('|');
  VOCAB.push({ id: VOCAB.length + 1, word, translation, definition, example, category: CATS[ci][0], partOfSpeech, image, pronunciation: word, synonyms: synonyms || '' });
}));

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Picture tile: emoji on a coloured background, or an <img> if the word has an image URL.
function pic(w, big) {
  const i = w.image || '', c = big ? 'pic big' : 'pic';
  if (/^(https?:|data:)/.test(i)) return `<div class="${c}"><img src="${esc(i)}" alt="${esc(w.word)}" onerror="this.replaceWith(document.createTextNode('🖼️'))"></div>`;
  return `<div class="${c}" style="--h:${(w.id * 47) % 360}"><span>${esc(i || '📘')}</span></div>`;
}

function toast(m, html) {
  const t = document.getElementById('toast');
  t[html ? 'innerHTML' : 'textContent'] = m;
  t.classList.add('show'); clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), html ? 4000 : 2000);
}

// Web Speech API pronunciation. Shows the word + a Repeat button while speaking.
function speak(word, quiet) {
  if (!('speechSynthesis' in window)) { toast('Speech is not supported in this browser'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word); u.lang = 'en-US'; u.rate = 0.85;
  speechSynthesis.speak(u);
  if (!quiet) toast(`<i class="fa-solid fa-volume-high"></i> <b>${esc(word)}</b> <button data-speak="${esc(word)}">Repeat</button>`, true);
}
