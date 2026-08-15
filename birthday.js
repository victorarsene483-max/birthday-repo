document.getElementById('mock-name-text').textContent = "My Screen Soulmate";

const sparkColors = ['#ff5fa8', '#29e0e0', '#35e08a', '#9b6bff'];
const sparksEl = document.getElementById('sparks');

for (let i = 0; i < 18; i++) {
  const spark = document.createElement('div');
  spark.className = 'spark';
  spark.style.left = Math.random() * 100 + '%';
  spark.style.top = (20 + Math.random() * 70) + '%';

  const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
  spark.style.background = color;
  spark.style.color = color;
  spark.style.boxShadow = '0 0 8px currentColor';

  sparksEl.appendChild(spark);
}

const pageHome = document.getElementById('page-home');
const pageMessage = document.getElementById('page-message');

function showMessagePage() {
  pageHome.classList.remove('active');
  pageMessage.classList.add('active');
  window.scrollTo(0, 0);
}

function showHomePage() {
  pageMessage.classList.remove('active');
  pageHome.classList.add('active');
  window.scrollTo(0, 0);
}


const msgEls = Array.from(document.querySelectorAll('.msg-card p, .msg-card .msg-close'));
const msgTexts = msgEls.map(el => el.textContent);

const TYPE_SPEED = 22;   // ms per character
const LINE_PAUSE = 250;  // ms pause between lines

function typeMessage() {
  msgEls.forEach(el => { el.textContent = ''; });

  let elIndex = 0;

  function typeElement() {
    if (elIndex >= msgEls.length) return;

    const el = msgEls[elIndex];
    const text = msgTexts[elIndex];
    let charIndex = 0;

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);

    function typeChar() {
      if (charIndex < text.length) {
        cursor.insertAdjacentText('beforebegin', text[charIndex]);
        charIndex++;
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        cursor.remove();
        elIndex++;
        setTimeout(typeElement, LINE_PAUSE);
      }
    }

    typeChar();
  }

  typeElement();
}


document.getElementById('open-message-btn').addEventListener('click', () => {
  showMessagePage();
  typeMessage();
});

document.getElementById('back-btn').addEventListener('click', () => {
  showHomePage();
});
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const icon = document.getElementById('music-icon');

music.volume = 0.2; // low volume, adjust 0.0–1.0
let isPlaying = false;

// Try silent autoplay on load (browsers allow muted autoplay)
window.addEventListener('load', () => {
  music.muted = true;
  music.play().catch(() => {
    // even muted autoplay was blocked, that's fine — user can tap the button
  });
});

toggleBtn.addEventListener('click', () => {
  if (!isPlaying) {
    music.muted = false;
    music.play();
    icon.textContent = '🔊';
    isPlaying = true;
  } else {
    music.pause();
    icon.textContent = '🔇';
    isPlaying = false;
  }
});
