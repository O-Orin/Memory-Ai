const navItems = [
  ["home", "Intro"],
  ["cards", "Cards"],
  ["reveal", "Reveal"],
  ["games", "Games"],
  ["quiz", "Quiz"],
  ["rate", "Rate"]
];

const content = document.getElementById("content");
let currentPage = "home";

/* ---------------- NAV ---------------- */
function renderNav() {
  const nav = document.getElementById("mainNav");
  nav.innerHTML = "";

  navItems.forEach(([id, label]) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    if (id === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      navigateTo(id);
    };
    nav.appendChild(btn);
  });
}

function navigateTo(page) {
  currentPage = page;
  renderPage();
  document.getElementById("mainNav").classList.remove("open"); // close on mobile
}

/* ---------------- PAGE RENDER ---------------- */
function renderPage() {
  renderNav();

  if (currentPage === "home") {
    content.innerHTML =
      "<h1>Memory in the Age of AI</h1><p>Explore memory with interactive pages and games!</p>";
  } else if (currentPage === "cards") {
    let html = "<h2>Interactive Cards</h2><div class='cards-grid'>";
    for (let i = 0; i < 5; i++) {
      if (i < 3) {
        html += `
        <div class="card" onclick="this.classList.toggle('flipped')">
          <div class="card-inner">
            <div class="card-front">Tap to Flip</div>
            <div class="card-back">Content ${i + 1}</div>
          </div>
        </div>`;
      } else {
        html += `
        <div class="card">
          <div class="card-inner flipped">
            <div class="card-front">Static</div>
            <div class="card-back">Static Box</div>
          </div>
        </div>`;
      }
    }
    html += "</div>";
    content.innerHTML = html;
  } else if (currentPage === "reveal") {
    const points = [1, 2, 3, 4, 5, 6];
    let html = "<h2>Tap to unblur</h2><div class='reveal-grid'>";
    points.forEach((p) => {
      html += `<div class="reveal-box blur" onclick="this.classList.remove('blur')">
        <h3>Point ${p}</h3><p>Details for point ${p}</p>
      </div>`;
    });
    html += "</div>";
    content.innerHTML = html;
  } else if (currentPage === "games") {
    content.innerHTML =
      "<h2>Games</h2><div id='memory'></div><div id='simon'></div>";
    renderMemory();
    renderSimon();
  } else if (currentPage === "quiz") {
    content.innerHTML = `<h2>Quiz</h2>
    <iframe src="https://near.tl/sm/tqnePQO28" width="100%" height="600"></iframe>`;
  } else if (currentPage === "rate") {
    content.innerHTML = `<h2>Rate This Website</h2>
    <p>⭐ ⭐ ⭐ ⭐ ⭐</p>`;
  }
}

/* ---------------- MEMORY GAME ---------------- */
function renderMemory() {
  const emojis = ["🌸", "🍕", "🐱", "⚽", "🎵", "🚗", "🌍", "🔥", "🍎", "🐶"];
  const pairs = emojis.slice(0, 10).flatMap((e) => [e, e]);
  const deck = shuffle(pairs);
  let html =
    "<div class='memory-grid' style='grid-template-columns:repeat(5,1fr)'>";
  deck.forEach((em) => {
    html += `
      <div class="memory-card" data-emoji="${em}" onclick="flipCard(this)">
        <div class="front"></div>
        <div class="back">${em}</div>
      </div>`;
  });
  html += "</div><div id='memory-stats'></div>";
  document.getElementById("memory").innerHTML = html;

  first = null;
  lock = false;
  turns = 0;
  matches = 0;
  document.getElementById("memory-stats").textContent =
    "Turns: 0 | Matches: 0";
}

let first = null,
  lock = false,
  turns = 0,
  matches = 0;

function flipCard(card) {
  if (lock || card.classList.contains("flipped")) return;
  card.classList.add("flipped");
  if (!first) {
    first = card;
  } else {
    turns++;
    if (first.dataset.emoji === card.dataset.emoji) {
      matches++;
      first = null;
    } else {
      lock = true;
      setTimeout(() => {
        card.classList.remove("flipped");
        first.classList.remove("flipped");
        first = null;
        lock = false;
      }, 800);
    }
  }
  document.getElementById(
    "memory-stats"
  ).textContent = `Turns: ${turns} | Matches: ${matches}`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------------- SIMON SAYS ---------------- */
let sequence = [],
  userSeq = [],
  playing = false,
  round = 0;

function renderSimon() {
  const colors = ["red", "green", "blue", "yellow"];
  let html = "<h3>Simon Says</h3><div class='simon-grid'>";
  colors.forEach((c, i) => {
    html += `<div class="simon-btn" style="background:${c}" onclick="pressSimon(${i})"></div>`;
  });
  html += "</div>";
  html += `<div style="margin-top:10px">
    <button onclick="startSimon()">Start / Next</button>
    <button onclick="resetSimon()">Replay</button>
    <span style="margin-left:10px">Rounds: <span id="roundCount">0</span></span>
    <div id="simonMsg" style="margin-top:6px;color:#ff8080"></div>
  </div>`;
  document.getElementById("simon").innerHTML = html;
}

async function startSimon() {
  userSeq = [];
  document.getElementById("simonMsg").textContent = "";

  // ensure next color is different from the last
  let next;
  do {
    next = Math.floor(Math.random() * 4);
  } while (sequence.length && next === sequence[sequence.length - 1]);
  sequence.push(next);

  round = sequence.length;
  document.getElementById("roundCount").textContent = round;
  playing = true;

  for (let i = 0; i < sequence.length; i++) {
    const idx = sequence[i];
    const pad = document.querySelectorAll(".simon-btn")[idx];
    pad.style.filter = "brightness(1.5)";
    await new Promise((res) => setTimeout(res, 400));
    pad.style.filter = "brightness(1)";
    await new Promise((res) => setTimeout(res, 200));
  }
  playing = false;
}

function pressSimon(i) {
  if (playing) return;
  userSeq.push(i);
  if (userSeq[userSeq.length - 1] !== sequence[userSeq.length - 1]) {
    document.getElementById(
      "simonMsg"
    ).textContent = `You lost! Rounds passed: ${round - 1}`;
    sequence = [];
    userSeq = [];
    round = 0;
    document.getElementById("roundCount").textContent = 0;
  } else if (userSeq.length === sequence.length) {
    setTimeout(() => startSimon(), 600);
  }
}

function resetSimon() {
  sequence = [];
  userSeq = [];
  round = 0;
  document.getElementById("roundCount").textContent = 0;
  document.getElementById("simonMsg").textContent = "";
}

/* ---------------- MOBILE NAV TOGGLE ---------------- */
function toggleMenu() {
  document.getElementById("mainNav").classList.toggle("open");
}

/* Init */
renderPage();
