const PASTA_TYPES = {
  spaghetti: { label: "Spaghetti", minutes: 11 },
  penne:     { label: "Penne",     minutes: 13 },
  fusilli:   { label: "Fusilli",   minutes: 12 },
  macaroni:  { label: "Macaroni",  minutes: 9 },
};


// HTML elemanları
const pastaCards        = document.querySelectorAll(".pasta-card");
const selectedPastaText = document.getElementById("selectedPastaText");
const timeDisplay       = document.getElementById("timeDisplay");
const statusText        = document.getElementById("statusText");
const startBtn          = document.getElementById("startBtn");
const pauseBtn          = document.getElementById("pauseBtn");
const resetBtn          = document.getElementById("resetBtn");
const readySection      = document.getElementById("readySection");
const doneBtn           = document.getElementById("doneBtn");

let selectedKey = null;
let totalSeconds = 0;
let remainingSeconds = 0;
let timerId = null;
let isRunning = false;

// Süreyi mm:ss formatında yaz
function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  timeDisplay.textContent = `${mm}:${ss}`;
}

// Pasta seçildiğinde
function selectPasta(key) {
  selectedKey = key;
  const pasta = PASTA_TYPES[key];

  // Tüm kartlardan selected class'ını kaldır
  pastaCards.forEach(card => card.classList.remove("selected"));

  // Seçilen karta ekle
  const selectedCard = document.querySelector(`.pasta-card[data-pasta="${key}"]`);
  if (selectedCard) {
    selectedCard.classList.add("selected");
  }

  // Süre ayarla
  totalSeconds = pasta.minutes * 60;
  remainingSeconds = totalSeconds;
  updateDisplay();

  selectedPastaText.textContent = `${pasta.label} selected • ${pasta.minutes} min`;
  statusText.textContent = "Ready to cook 💫";
  readySection.style.display = "none"; // önceki ready mesajını gizle
}

// Pasta kartlarına tıklama
pastaCards.forEach(card => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-pasta");
    // Timer çalışıyorsa seçimi değiştirmeden önce durdur
    if (isRunning) {
      clearInterval(timerId);
      isRunning = false;
    }
    selectPasta(key);
  });
});

// Timer başlat
startBtn.addEventListener("click", () => {
  if (!selectedKey) {
    statusText.textContent = "Please choose a pasta first 💕";
    return;
  }

  if (isRunning) return;

  if (remainingSeconds <= 0) {
    remainingSeconds = totalSeconds;
    updateDisplay();
  }

  isRunning = true;
  statusText.textContent = "Cooking... 🍝";
  readySection.style.display = "none";

  timerId = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      updateDisplay();
      clearInterval(timerId);
      isRunning = false;

      statusText.textContent = "Pasta is ready! 🍽️";
      readySection.style.display = "block";
    } else {
      updateDisplay();
    }
  }, 1000);
});

// Duraklat
pauseBtn.addEventListener("click", () => {
  if (!isRunning) return;
  clearInterval(timerId);
  isRunning = false;
  statusText.textContent = "Paused ⏸️";
});

// Reset
resetBtn.addEventListener("click", () => {
  clearInterval(timerId);
  isRunning = false;

  if (selectedKey) {
    const pasta = PASTA_TYPES[selectedKey];
    remainingSeconds = pasta.minutes * 60;
    updateDisplay();
    statusText.textContent = "Reset 🔁";
  } else {
    remainingSeconds = 0;
    updateDisplay();
    statusText.textContent = "Choose a pasta to begin 💗";
  }

  readySection.style.display = "none";
});

// Done (hazır mesajından sonra)
doneBtn.addEventListener("click", () => {
  readySection.style.display = "none";
  statusText.textContent = "Enjoy your meal ✨";
});

// İlk görüntü
remainingSeconds = 0;
updateDisplay();
