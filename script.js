const weddingDate = new Date("2026-06-06T20:00:00");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const introOverlay = document.getElementById("introOverlay");
const openInvitationBtn = document.getElementById("openInvitationBtn");
const petalsContainer = document.getElementById("petals");
const sparklesContainer = document.getElementById("sparkles");

let musicManuallyPaused = false;

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "0";
    document.getElementById("hours").textContent = "0";
    document.getElementById("minutes").textContent = "0";
    document.getElementById("seconds").textContent = "0";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days);
  document.getElementById("hours").textContent = String(hours);
  document.getElementById("minutes").textContent = String(minutes);
  document.getElementById("seconds").textContent = String(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

function createPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = 7 + Math.random() * 7 + "s";
  petal.style.opacity = String(0.35 + Math.random() * 0.45);
  petal.style.transform = `scale(${0.7 + Math.random() * 0.8}) rotate(${Math.random() * 90}deg)`;

  petalsContainer.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, 14000);
}

setInterval(createPetal, 520);

for (let i = 0; i < 12; i++) {
  setTimeout(createPetal, i * 260);
}

function createSparkle(x = null, y = null) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = (x ?? Math.random() * window.innerWidth) + "px";
  sparkle.style.top = (y ?? Math.random() * window.innerHeight) + "px";

  sparklesContainer.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 2400);
}

setInterval(() => {
  createSparkle();
}, 900);

document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.92) {
    createSparkle(e.clientX, e.clientY);
  }
});

function setMusicButtonState(isPlaying) {
  musicToggle.classList.toggle("paused", !isPlaying);
  musicToggle.textContent = isPlaying ? "♫ Музыка: ON" : "♫ Музыка: OFF";
}

async function tryPlayMusic(force = false) {
  if (musicManuallyPaused && !force) {
    setMusicButtonState(false);
    return false;
  }

  try {
    await bgMusic.play();
    setMusicButtonState(true);
    return true;
  } catch (error) {
    setMusicButtonState(false);
    return false;
  }
}

function pauseMusic() {
  bgMusic.pause();
  setMusicButtonState(false);
}

musicToggle.addEventListener("click", async (event) => {
  event.stopPropagation();

  if (bgMusic.paused) {
    musicManuallyPaused = false;
    await tryPlayMusic(true);
  } else {
    musicManuallyPaused = true;
    pauseMusic();
  }
});

async function openInvitation() {
  introOverlay.classList.add("opening");

  createBurstSparkles();

  musicManuallyPaused = false;
  await tryPlayMusic();

  setTimeout(() => {
    introOverlay.classList.add("hidden");
    document.body.classList.add("site-ready");
  }, 1900);
}

openInvitationBtn.addEventListener("click", openInvitation);

function createBurstSparkles() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 28; i++) {
    const offsetX = (Math.random() - 0.5) * 320;
    const offsetY = (Math.random() - 0.5) * 220;

    setTimeout(() => {
      createSparkle(centerX + offsetX, centerY + offsetY);
    }, i * 35);
  }
}

document.addEventListener(
  "click",
  async () => {
    if (
      document.body.classList.contains("site-ready") &&
      bgMusic.paused &&
      !musicManuallyPaused
    ) {
      await tryPlayMusic();
    }
  },
  { passive: true }
);

document.addEventListener(
  "touchstart",
  async () => {
    if (
      document.body.classList.contains("site-ready") &&
      bgMusic.paused &&
      !musicManuallyPaused
    ) {
      await tryPlayMusic();
    }
  },
  { passive: true }
);

window.addEventListener("load", () => {
  document.querySelectorAll(".hero-card, .card").forEach((el, index) => {
    el.style.animationDelay = `${index * 0.08}s`;
  });
});

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const heroCard = document.querySelector(".hero-card");

  if (heroCard) {
    heroCard.style.transform = `translateY(${scrollY * 0.05}px)`;
  }
});
