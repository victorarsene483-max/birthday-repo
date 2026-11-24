const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('mock-name-text').textContent = "My Screen Soulmate";

/* ---------- hero title: letters rise in a wave ---------- */
let li = 0;
document.querySelectorAll('.hero-title .ln').forEach(line => {
  const t = line.textContent; line.textContent = '';
  [...t].forEach(ch => {
    const s = document.createElement('span');
    s.className = 'l'; s.style.setProperty('--i', li++); s.textContent = ch; s.setAttribute('aria-hidden', 'true');
    line.appendChild(s);
  });
});

/* ---------- light that follows the pointer ---------- */
addEventListener('pointermove', e => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

/* ---------- sparks & sparkles ---------- */
const sparkColors = ['#ff5fa8', '#29e0e0', '#35e08a', '#9b6bff'];
const sparksEl = $('#sparks');
for (let i = 0; i < 18; i++) {
  const spark = document.createElement('div');
  spark.className = 'spark';
  spark.style.left = Math.random() * 100 + '%';
  spark.style.top = (20 + Math.random() * 70) + '%';
  spark.style.animationDelay = (Math.random() * -3) + 's';
  const color = sparkColors[i % sparkColors.length];
  spark.style.background = color; spark.style.color = color; spark.style.boxShadow = '0 0 8px currentColor';
  sparksEl.appendChild(spark);
}

function sparkle(x, y, n = 12) {
  const cols = ['#ffd84d', '#ff5fa8', '#9b6bff', '#35e08a', '#ffffff'];
  for (let k = 0; k < n; k++) {
    const s = document.createElement('i'); s.className = 'sparkle';
    const d = 6 + Math.random() * 8, a = Math.random() * 6.28, dist = 40 + Math.random() * 110;
    s.style.cssText = `left:${x}px;top:${y}px;width:${d}px;height:${d}px;background:${cols[k % 5]};--bx:${Math.cos(a) * dist}px;--by:${Math.sin(a) * dist}px`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 1250);
  }
}
const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

/* ---------- drifting bubbles (tap to pop) ---------- */
const layer = $('#bubbles');
function bubble(size, x, dur) {
  const b = document.createElement('div');
  b.className = 'b';
  size = size || 16 + Math.random() * 80;
  b.style.cssText = `width:${size}px;height:${size}px;left:${x ?? Math.random() * 100}%;--dx:${(Math.random() - .5) * 160}px;animation-duration:${dur || 12 + Math.random() * 14}s`;
  b.addEventListener('pointerdown', () => { sparkle(...centerOf(b), 6); b.classList.add('pop'); setTimeout(() => b.remove(), 260); });
  b.addEventListener('animationend', () => b.remove());
  layer.appendChild(b);
}
if (!reduce) {
  for (let k = 0; k < 10; k++) setTimeout(() => bubble(), k * 450);
  setInterval(() => layer.childElementCount < 22 && bubble(), 1400);
}

/* ---------- trait cards: staggered reveal on scroll ---------- */
const cards = document.querySelectorAll('.trait-card');
cards.forEach((c, i) => c.style.setProperty('--d', (i % 2) * 0.12 + 's'));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
cards.forEach(c => io.observe(c));


const pageHome = $('#page-home');
const pageMessage = $('#page-message');
function showMessagePage() { pageHome.classList.remove('active'); pageMessage.classList.add('active'); window.scrollTo(0, 0); }
function showHomePage() { pageMessage.classList.remove('active'); pageHome.classList.add('active'); window.scrollTo(0, 0); }


const msgEls = Array.from(document.querySelectorAll('.msg-card p, .msg-card .msg-close'));
const msgTexts = msgEls.map(el => el.textContent);
const afterMsg = $('#after-msg');
const TYPE_SPEED = 22, LINE_PAUSE = 250;
let runId = 0;

function finishTyping() {
  runId++; // cancels any running typing loop
  msgEls.forEach((el, i) => { el.textContent = msgTexts[i]; });
  afterMsg.classList.add('show');
}

function typeMessage() {
  const myRun = ++runId;
  afterMsg.classList.remove('show');
  msgEls.forEach(el => { el.textContent = ''; });
  if (reduce) return finishTyping();
  let elIndex = 0;

  function typeElement() {
    if (myRun !== runId) return;
    if (elIndex >= msgEls.length) { afterMsg.classList.add('show'); return; }
    const el = msgEls[elIndex], text = msgTexts[elIndex];
    let charIndex = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);
    (function typeChar() {
      if (myRun !== runId) return;
      if (charIndex < text.length) {
        cursor.insertAdjacentText('beforebegin', text[charIndex++]);
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        cursor.remove(); elIndex++;
        setTimeout(typeElement, LINE_PAUSE);
      }
    })();
  }
  typeElement();
}

$('#open-message-btn').addEventListener('click', e => { sparkle(...centerOf(e.currentTarget), 14); showMessagePage(); typeMessage(); });
$('#back-btn').addEventListener('click', () => { runId++; showHomePage(); });
$('#msg-card').addEventListener('click', finishTyping);


const music = $('#bg-music'), toggleBtn = $('#music-toggle'), icon = $('#music-icon');
music.volume = 0.2;
let isPlaying = false;
window.addEventListener('load', () => { music.muted = true; music.play().catch(() => {}); });
toggleBtn.addEventListener('click', () => {
  if (!isPlaying) { music.muted = false; music.play(); icon.textContent = '🔊'; isPlaying = true; }
  else { music.pause(); icon.textContent = '🔇'; isPlaying = false; }
});


const dlg = $('#wish-dialog'), input = $('#wish-input'), sendBtn = $('#wish-send'), count = $('#wish-count');
const wishLog = $('#wish-log'), wishList = $('#wish-list'), toast = $('#toast');
const KEY = 'birthday-wishes';
let wishes = [];
try { wishes = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(wishes)); } catch (e) {} };

function say(msg) {
  toast.textContent = msg; toast.classList.add('show');
  clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 3200);
}

function renderWishes() {
  wishList.textContent = '';
  wishes.forEach(w => { const li = document.createElement('li'); li.textContent = w; wishList.appendChild(li); });
  wishLog.hidden = wishes.length === 0;
}

function updateForm() {
  const n = input.value.trim().length;
  count.textContent = input.value.length + '/140';
  sendBtn.disabled = n === 0;
}

document.querySelectorAll('.open-wish').forEach(b => b.addEventListener('click', () => {
  input.value = ''; updateForm(); dlg.showModal(); input.focus();
}));
$('#wish-close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
input.addEventListener('input', updateForm);
$('#chips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  input.value = c.textContent.trim(); updateForm(); input.focus();
});
input.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !sendBtn.disabled) sendBtn.click(); });

sendBtn.addEventListener('click', () => {
  const text = input.value.trim(); if (!text) return;
  dlg.close();


  const wb = document.createElement('div');
  wb.className = 'wish-bubble'; wb.textContent = text;
  document.body.appendChild(wb);
  wb.addEventListener('animationend', () => {
    sparkle(...centerOf(wb), 36);
    for (let k = 0; k < 14; k++) setTimeout(() => bubble(20 + Math.random() * 60, Math.random() * 100, 6 + Math.random() * 5), k * 80);
    wb.remove();
    say('Wish sent up ✨ I hope it comes true');
  });
  if (reduce) wb.dispatchEvent(new Event('animationend'));

  wishes.push(text); save(); renderWishes();
});

$('#clear-wishes').addEventListener('click', () => { wishes = []; save(); renderWishes(); });


$('#share-wishes').addEventListener('click', async () => {
  const msg = 'My birthday wishes 🎂\n' + wishes.map((w, i) => `${i + 1}. ${w}`).join('\n');
  try {
    if (navigator.share) await navigator.share({ text: msg });
    else { await navigator.clipboard.writeText(msg); say('Copied. Paste it in a chat to Arsene 💌'); }
  } catch (e) { /* share cancelled */ }
});

renderWishes();


$('#enter').addEventListener('click', e => {
  const [x, y] = centerOf(e.currentTarget);
  sparkle(x, y, 24);
  document.body.classList.add('ready');
  $('#splash').classList.add('leaving');
  setTimeout(() => $('#splash').remove(), 1000);
  if (!reduce) for (let k = 0; k < 12; k++) setTimeout(() => bubble(24 + Math.random() * 60, Math.random() * 100, 5 + Math.random() * 4), k * 70);
  music.muted = false;
  music.play().then(() => { icon.textContent = '🔊'; isPlaying = true; }).catch(() => {});
});
