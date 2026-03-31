const weddingDate = new Date("2026-06-06T20:00:00");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

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

const petalsContainer = document.getElementById("petals");

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

function setMusicButtonState(isPlaying) {
  musicToggle.classList.toggle("paused", !isPlaying);
  musicToggle.textContent = isPlaying ? "♫ Музыка: ON" : "♫ Музыка: OFF";
}

async function tryPlayMusic() {
  try {
    await bgMusic.play();
    setMusicButtonState(true);
    return true;
  } catch (error) {
    setMusicButtonState(false);
    return false;
  }
}

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) {
    await tryPlayMusic();
  } else {
    bgMusic.pause();
    setMusicButtonState(false);
  }
});

document.addEventListener(
  "click",
  async () => {
    if (bgMusic.paused) {
      await tryPlayMusic();
    }
  },
  { once: true }
);

document.addEventListener(
  "touchstart",
  async () => {
    if (bgMusic.paused) {
      await tryPlayMusic();
    }
  },
  { once: true }
);

window.addEventListener("load", async () => {
  await tryPlayMusic();
});