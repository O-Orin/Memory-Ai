/* ---------------- NAV ITEMS ---------------- */
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
    btn.onclick = () => navigateTo(id);
    nav.appendChild(btn);
  });
}

function navigateTo(page) {
  currentPage = page;
  renderPage();
  document.getElementById("mainNav").classList.remove("open");
}

/* ---------------- PAGE RENDER ---------------- */
function renderPage() {
  renderNav();

  if (currentPage === "home") {
    content.innerHTML =
      "<h1>Memory in the Age of AI</h1><p>A concise, research-informed walkthrough of how our memory works, how AI and technology change it, and practical ways to use those same tools to strengthen—not weaken—your mind.</p> <h2>What is Memory & How It Works</h2><p>Memory is learning that persists over time information that is encoded, stored, andretrieved. It links our experiences, skills, and knowledge into a coherent identity.<br><br>There are three types of memories. Let’s take a look at those:<br><br>1) Sensory Memory<br><br>2) Short-Term / Working<br><br>3) Long-Term Memory";
  } else if (currentPage === "cards") {
  // Keep your original intro paragraph
  let html = "<h2>Technology & AI: Benefits — and the Bigger Risks </h2><p>Digital tools can help—but overreliance can erode focus and recall. Reminder apps & calendars reminds us about our chores, searching something online gives us access to quick information. Recently, addition of AI has helped us with remembering tasks. AI tools can take notes, give reminder, answer any question, even do our tasks for us. This all may seem like heaven but there are many hidden negative effects of the blessings of AI & technology.</p><p>Ready to see them?</p><div class='cards-grid'>";

  const cardData = [
    { front: "Cognitive Offloading", back: "We remember less because devices remember for us." },
    { front: "The Google Effect", back: "We recall where to find info, not the info itself." },
    { front: "Distraction Overload", back: "Attention splits → weaker working memory, poorer transfer to long-term." },
    { front: "Algorithmic Bias", back: "Feeds reinforce certain items, shaping—or distorting—what we recall." },
    { front: "Practice Loss", back: "Less self-driven recall → weaker memory skills over time." }
  ];

  cardData.forEach(card => {
    html += `
      <div class="card" onclick="this.classList.toggle('flipped')">
        <div class="card-inner">
          <div class="card-front">${card.front}</div>
          <div class="card-back">${card.back}</div>
        </div>
      </div>`;
  });

  html += "</div>";
  content.innerHTML = html;
} else if (currentPage === "reveal") {
  // Define your 6 boxes with custom texts
  const revealBoxes = [
    { title: "Active Learning Tools", text: "Use spaced-repetition and digital flashcards to force active recall and counter forgetting." },
    { title: "Train Working Memory", text: "Short, regular exercises and games that hold/manipulate items can sharpen attention and capacity." },
    { title: "Personalized AI Tutors", text: "Adaptive guidance organizes material for deeper processing and prompts recall instead of just giving answers." },
    { title: "Reduce Passive Dependence", text: "Turn off non-essential notifications. Convert reminders into quick self-tests rather than auto surfacing." },
    { title: "Support Habits", text: "Track sleep, breaks, and stress. Sleep consolidates memories; calm focus improves encoding." },
    { title: "  Organize for Meaning", text: "Create hierarchies and chunk concepts. Link new ideas to prior knowledge to boost retrieval routes." }
  ];

  let html = "<h2>Use Technology to Strengthen Memory</h2><p>AI & technology does not need to be a threat for our memory. We can balance and use AI & tech or even use them to strengthen our own memory.</p> <p> Here are some tips on how you can do it!</p><div class='reveal-grid'>";
  
  // Loop through each box and add it
  revealBoxes.forEach(box => {
    html += `
      <div class="reveal-box blur" onclick="this.classList.remove('blur')">
        <h3>${box.title}</h3>
        <p>${box.text}</p>
      </div>
    `;
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
    content.innerHTML = `
      <h2>Rate This Website</h2>
      <div class="rating" id="stars"></div>
      <div id="ratingText"></div>
    `;
    const starsContainer = document.getElementById("stars");
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.textContent = "★";
      star.dataset.value = i;
      starsContainer.appendChild(star);
    }
    renderRating();
  }
}

/* ---------------- MEMORY GAME ---------------- */
let first = null, lock = false, turns = 0, matches = 0;

function renderMemory() {
  const emojis = ["🌸", "🍕", "🐱", "⚽", "🎵", "🚗", "🌍", "🔥", "🍎", "👾"];
  const pairs = emojis.slice(0, 10).flatMap((e) => [e, e]);
  const deck = shuffle(pairs);
  let html = "<div class='memory-grid' style='grid-template-columns:repeat(5,1fr)'>";
  deck.forEach((em) => {
    html += `
      <div class="memory-card" data-emoji="${em}" onclick="flipCard(this)">
        <div class="front"></div>
        <div class="back">${em}</div>
      </div>`;
  });
  html += "</div><div id='memory-stats'></div>";
  document.getElementById("memory").innerHTML = html;

  first = null; lock = false; turns = 0; matches = 0;
  document.getElementById("memory-stats").textContent =
    "Turns: 0 | Matches: 0";
}

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
let simonSequence = [];
let userSequence = [];
let simonPlaying = false;
let simonRound = 0;

function renderSimon() {
  const colors = ["green", "red", "yellow", "blue"];
  let html = "<h3>Simon Says</h3><div class='simon-grid'>";
  
  colors.forEach(c => {
    html += `<div class="simon-btn ${c}" data-color="${c}"></div>`;
  });
  
  html += "</div>";
  html += `<div style="margin-top:10px">
    <button onclick="startSimon()">Start / Next</button>
    <button onclick="resetSimon()">Replay</button>
    <span style="margin-left:10px">Rounds: <span id="roundCount">0</span></span>
    <div id="simonMsg" style="margin-top:6px;color:#ff8080"></div>
  </div>`;
  
  document.getElementById("simon").innerHTML = html;

  // Set click handlers
  document.querySelectorAll(".simon-btn").forEach(btn => {
    btn.onclick = () => pressSimon(btn.dataset.color);
  });
}

async function startSimon() {
  userSequence = [];
  document.getElementById("simonMsg").textContent = "";

  // Add a new random color
  const colors = ["green", "red", "yellow", "blue"];
  let next;
  do {
    next = Math.floor(Math.random() * 4);
  } while (simonSequence.length && next === simonSequence[simonSequence.length - 1]);
  simonSequence.push(next);

  simonRound = simonSequence.length;
  document.getElementById("roundCount").textContent = simonRound;
  simonPlaying = true;

  const buttons = document.querySelectorAll(".simon-btn");

  // Play the sequence
  for (let i = 0; i < simonSequence.length; i++) {
    const idx = simonSequence[i];
    const btn = buttons[idx];

    // Glow effect: background + border
    btn.classList.add("active");
    btn.style.boxShadow = `0 0 20px ${colors[idx]}, 0 0 40px ${colors[idx]}`;
    
    await new Promise(r => setTimeout(r, 500));
    
    btn.classList.remove("active");
    btn.style.boxShadow = "none";

    await new Promise(r => setTimeout(r, 200));
  }

  simonPlaying = false;
}

function pressSimon(color) {
  if (simonPlaying) return;

  const colors = ["green", "red", "yellow", "blue"];
  const idx = colors.indexOf(color);
  userSequence.push(idx);

  // Glow feedback on click
  const btn = document.querySelector(`.simon-btn.${color}`);
  btn.classList.add("active");
  btn.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
  setTimeout(() => {
    btn.classList.remove("active");
    btn.style.boxShadow = "none";
  }, 400);

  // Check user input
  if (userSequence[userSequence.length - 1] !== simonSequence[userSequence.length - 1]) {
    document.getElementById("simonMsg").textContent = `You lost! Rounds passed: ${simonRound - 1}`;
    resetSimon();
  } else if (userSequence.length === simonSequence.length) {
    setTimeout(startSimon, 1000);
  }
}

function resetSimon() {
  simonSequence = [];
  userSequence = [];
  simonRound = 0;
  document.getElementById("roundCount").textContent = 0;
  document.getElementById("simonMsg").textContent = "";
}
/* ---------------- RATING ---------------- */
function renderRating() {
  const ratingText = {
    5: "Thanks Top-G! Really appreciate it!",
    4: "Great to know that you like it!",
    3: "Neutral? Playing safe huh!",
    2: "I will try to improve & thanks for the feedback!",
    1: 'So you hate the website or hate me in general? :"('
  };

  const stars = document.querySelectorAll("#stars span");
  let selectedRating = 0;

  stars.forEach(star => {
    star.addEventListener("mouseover", () => {
      const val = Number(star.dataset.value);
      stars.forEach(s => s.classList.toggle("hover", Number(s.dataset.value) <= val));
    });
    star.addEventListener("mouseout", () => {
      stars.forEach(s => s.classList.remove("hover"));
    });
    star.addEventListener("click", () => {
      selectedRating = Number(star.dataset.value);
      stars.forEach(s => s.classList.toggle("selected", Number(s.dataset.value) <= selectedRating));
      document.getElementById("ratingText").textContent = ratingText[selectedRating];
    });
  });
}

/* ---------------- MOBILE NAV TOGGLE ---------------- */
function toggleMenu() {
  document.getElementById("mainNav").classList.toggle("open");
}

/* ---------------- INIT ---------------- */
renderPage();

