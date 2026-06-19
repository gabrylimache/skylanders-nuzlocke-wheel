// App State
const state = {
  currentGame: "Spyro's Adventure",
  settings: {
    includeMinis: false,
    includeReimagined: false
  },
  rolledSkylanders: [] // Array of Skylander names
};

// Game lists in chronological order to resolve backwards compatibility
const GAME_ORDER = [
  "Spyro's Adventure",
  "Giants",
  "Swap Force",
  "Trap Team",
  "SuperChargers",
  "Imaginators"
];

// Element Color palette matching style.css HSL values for Canvas drawing
const ELEMENT_COLORS = {
  "Magic": "#a855f7",
  "Earth": "#ca8a04",
  "Water": "#06b6d4",
  "Fire": "#ef4444",
  "Tech": "#f97316",
  "Undead": "#6b7280",
  "Life": "#22c55e",
  "Air": "#38bdf8",
  "Light": "#eab308",
  "Dark": "#4b5563",
  "Kaos": "#ec4899"
};

// DOM Elements
const gameGrid = document.getElementById("gameGrid");
const toggleMinis = document.getElementById("toggleMinis");
const toggleReimagined = document.getElementById("toggleReimagined");
const rowReimagined = document.getElementById("rowReimagined");

const statPoolSize = document.getElementById("statPoolSize");
const statRolled = document.getElementById("statRolled");
const statRemaining = document.getElementById("statRemaining");

const btnResetRun = document.getElementById("btnResetRun");
const btnMarkAllRolled = document.getElementById("btnMarkAllRolled");
const btnMarkAllAvailable = document.getElementById("btnMarkAllAvailable");

const btnExport = document.getElementById("btnExport");
const fileImport = document.getElementById("fileImport");
const mainDropZone = document.getElementById("mainDropZone");

const canvasWheel = document.getElementById("rouletteWheel");
const ctxWheel = canvasWheel.getContext("2d");
const btnSpin = document.getElementById("btnSpin");
const rouletteStatus = document.getElementById("rouletteStatus");
const wheelGlow = document.getElementById("wheelGlow");

const rosterExplorer = document.getElementById("rosterExplorer");

const winnerModalOverlay = document.getElementById("winnerModalOverlay");
const winnerModalCard = document.getElementById("winnerModalCard");
const winnerName = document.getElementById("winnerName");
const winnerElement = document.getElementById("winnerElement");
const winnerGame = document.getElementById("winnerGame");
const winnerType = document.getElementById("winnerType");
const btnModalClose = document.getElementById("btnModalClose");

const canvasConfetti = document.getElementById("confettiCanvas");
const ctxConfetti = canvasConfetti.getContext("2d");

// Audio Context for synthetic beeps
let audioCtx = null;

// Wheel Animation Variables
let isSpinning = false;
let currentWheelAngle = 0;
let wheelSpeed = 0;
let currentWheelPool = []; // Skylanders drawn on the wheel right now
let winningSkylander = null;
let lastTickSegmentIndex = -1;

// Confetti Particles
let confettiParticles = [];
let confettiAnimationId = null;

// 1. INITIALIZATION & STORAGE
function init() {
  loadState();
  setupEventListeners();
  resizeConfettiCanvas();
  syncUI();
}

function loadState() {
  const saved = localStorage.getItem("skylanders_nuzlocke_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.currentGame) state.currentGame = parsed.currentGame;
      if (parsed.settings) state.settings = { ...state.settings, ...parsed.settings };
      if (parsed.rolledSkylanders) state.rolledSkylanders = parsed.rolledSkylanders;
    } catch (e) {
      console.error("Errore nel caricamento del salvataggio locale:", e);
    }
  }
}

function saveState() {
  localStorage.setItem("skylanders_nuzlocke_state", JSON.stringify(state));
}

// 2. FILTERING LOGIC
// Get all Skylanders available based on game selection and settings
function getFilteredRoster() {
  const selectedGameIndex = GAME_ORDER.indexOf(state.currentGame);
  if (selectedGameIndex === -1) return [];

  return SKYLANDERS.filter(char => {
    // 1. Game Check: must be from current or previous games
    const charGameIndex = GAME_ORDER.indexOf(char.game);
    if (charGameIndex === -1 || charGameIndex > selectedGameIndex) return false;

    // 2. Minis Check: exclude unless toggle is enabled
    if (char.type === "Mini" && !state.settings.includeMinis) return false;

    // 3. SuperChargers Reimagined Check: exclude unless toggle is enabled
    if (char.isVariant && char.game === "SuperChargers" && !state.settings.includeReimagined) return false;

    // General fallback: ignore other variants (if any exist without toggle)
    if (char.isVariant && char.type !== "Mini" && char.game !== "SuperChargers") return false;

    return true;
  });
}

// Get the pool of Skylanders that are yet to be rolled
function getAvailablePool() {
  const filtered = getFilteredRoster();
  return filtered.filter(char => !state.rolledSkylanders.includes(char.name));
}

// 3. UI SYNCING & DRAWING
function syncUI() {
  // Sync Game buttons
  const buttons = gameGrid.querySelectorAll(".game-btn");
  buttons.forEach(btn => {
    if (btn.dataset.game === state.currentGame) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Sync settings toggles
  toggleMinis.checked = state.settings.includeMinis;
  toggleReimagined.checked = state.settings.includeReimagined;

  // Show/Hide SuperChargers toggle based on selected game
  const selectedGameIndex = GAME_ORDER.indexOf(state.currentGame);
  const superchargersIndex = GAME_ORDER.indexOf("SuperChargers");
  if (selectedGameIndex >= superchargersIndex) {
    rowReimagined.style.display = "flex";
  } else {
    rowReimagined.style.display = "none";
  }

  // Update statistics
  const totalRoster = getFilteredRoster();
  const availablePool = getAvailablePool();
  const rolledCount = totalRoster.length - availablePool.length;

  statPoolSize.textContent = totalRoster.length;
  statRolled.textContent = rolledCount;
  statRemaining.textContent = availablePool.length;

  // Render Roster Explorer
  renderRosterExplorer(totalRoster);

  // Initialize or redraw the wheel static state
  prepareWheelPool();
  drawWheel();
}

function renderRosterExplorer(roster) {
  rosterExplorer.innerHTML = "";

  if (roster.length === 0) {
    rosterExplorer.innerHTML = `<div class="empty-msg">Nessuno Skylander corrisponde ai criteri scelti.</div>`;
    return;
  }

  // Group by Element
  const grouped = {};
  roster.forEach(char => {
    if (!grouped[char.element]) {
      grouped[char.element] = [];
    }
    grouped[char.element].push(char);
  });

  // List of elements in custom render order
  const elementsOrder = ["Magic", "Earth", "Water", "Fire", "Tech", "Undead", "Life", "Air", "Light", "Dark", "Kaos"];

  elementsOrder.forEach(element => {
    const chars = grouped[element];
    if (!chars || chars.length === 0) return;

    // Create element section
    const section = document.createElement("div");
    section.className = `element-section ${element.toLowerCase()}`;

    // Section title
    const header = document.createElement("div");
    header.className = "element-title";
    header.innerHTML = `<span class="element-icon"></span>${element}`;
    section.appendChild(header);

    // Cards grid
    const grid = document.createElement("div");
    grid.className = "skylander-grid";

    chars.forEach(char => {
      const isRolled = state.rolledSkylanders.includes(char.name);
      
      const card = document.createElement("div");
      card.className = `skylander-card ${isRolled ? 'rolled' : ''}`;
      
      // Determine shorthand metadata
      let metaStr = char.game;
      if (char.type && char.type !== "Core") {
        metaStr += ` (${char.type})`;
      }

      card.innerHTML = `
        <div class="char-name">${char.name}</div>
        <div class="char-meta">${metaStr}</div>
      `;

      card.addEventListener("click", () => {
        toggleSkylanderRolled(char.name);
      });

      grid.appendChild(card);
    });

    section.appendChild(grid);
    rosterExplorer.appendChild(section);
  });
}

function toggleSkylanderRolled(name) {
  if (isSpinning) return; // Prevent edits during spin
  
  const index = state.rolledSkylanders.indexOf(name);
  if (index === -1) {
    state.rolledSkylanders.push(name);
  } else {
    state.rolledSkylanders.splice(index, 1);
  }
  
  saveState();
  syncUI();
}

// 4. WHEEL CONFIGURATION & DRAWING
function prepareWheelPool() {
  const available = getAvailablePool();
  
  if (available.length === 0) {
    currentWheelPool = [];
    btnSpin.classList.add("disabled");
    rouletteStatus.textContent = "Tutti gli Skylanders sono già usciti!";
    rouletteStatus.style.color = "var(--fire-color)";
    return;
  }
  
  btnSpin.classList.remove("disabled");
  rouletteStatus.style.color = "var(--text-main)";
  
  // If we already have a loaded pool or are spinning, don't re-shuffle
  if (isSpinning) return;

  // Visual Enhancement: Limit to a subset of max 12 characters to keep segments readable
  // Shuffle available list to select a random subset
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  currentWheelPool = shuffled.slice(0, Math.min(available.length, 12));
  
  if (available.length > 12) {
    rouletteStatus.textContent = `La roulette mostra 12 dei ${available.length} Skylanders rimanenti.`;
  } else {
    rouletteStatus.textContent = "Premi SPIN per estrarre!";
  }
}

function drawWheel() {
  const width = canvasWheel.width;
  const height = canvasWheel.height;
  const radius = width / 2;
  ctxWheel.clearRect(0, 0, width, height);

  const numSegments = currentWheelPool.length;

  if (numSegments === 0) {
    // Draw empty placeholder wheel
    ctxWheel.beginPath();
    ctxWheel.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctxWheel.fillStyle = "rgba(255,255,255,0.03)";
    ctxWheel.fill();
    ctxWheel.strokeStyle = "rgba(255,255,255,0.08)";
    ctxWheel.lineWidth = 4;
    ctxWheel.stroke();
    
    ctxWheel.fillStyle = "var(--text-muted)";
    ctxWheel.font = "bold 14px Orbitron, sans-serif";
    ctxWheel.textAlign = "center";
    ctxWheel.textBaseline = "middle";
    ctxWheel.fillText("NESSUN PERSONAGGIO", radius, radius);
    return;
  }

  const segmentAngle = (2 * Math.PI) / numSegments;

  ctxWheel.save();
  ctxWheel.translate(radius, radius);
  ctxWheel.rotate(currentWheelAngle);

  for (let i = 0; i < numSegments; i++) {
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;
    const skylander = currentWheelPool[i];
    const elementColor = ELEMENT_COLORS[skylander.element] || "#ffffff";

    // 1. Draw segment wedge
    ctxWheel.beginPath();
    ctxWheel.moveTo(0, 0);
    ctxWheel.arc(0, 0, radius - 8, startAngle, endAngle);
    ctxWheel.closePath();
    ctxWheel.fillStyle = elementColor;
    ctxWheel.fill();

    // 2. Draw subtle border to separate wedges
    ctxWheel.strokeStyle = "rgba(8, 10, 20, 0.4)";
    ctxWheel.lineWidth = 2;
    ctxWheel.stroke();

    // 3. Write Skylander Name (rotated radially)
    ctxWheel.save();
    ctxWheel.rotate(startAngle + segmentAngle / 2);
    ctxWheel.textAlign = "right";
    ctxWheel.textBaseline = "middle";
    ctxWheel.fillStyle = "#ffffff";
    ctxWheel.font = "bold 11px Outfit, sans-serif";
    
    // Drop shadow for readability
    ctxWheel.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctxWheel.shadowBlur = 4;
    ctxWheel.shadowOffsetX = 1;
    ctxWheel.shadowOffsetY = 1;

    // Truncate name if it's too long
    let displayName = skylander.name;
    if (displayName.length > 17) {
      displayName = displayName.substring(0, 15) + "..";
    }

    ctxWheel.fillText(displayName, radius - 24, 0);
    ctxWheel.restore();
  }

  ctxWheel.restore();

  // 4. Draw outer metal rim
  ctxWheel.beginPath();
  ctxWheel.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
  ctxWheel.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctxWheel.lineWidth = 8;
  ctxWheel.stroke();

  // 5. Draw center cap
  ctxWheel.beginPath();
  ctxWheel.arc(radius, radius, 42, 0, 2 * Math.PI);
  ctxWheel.fillStyle = "#0c0f20";
  ctxWheel.fill();
  ctxWheel.strokeStyle = "var(--text-gold)";
  ctxWheel.lineWidth = 3;
  ctxWheel.stroke();
}

// 5. ROULETTE AUDIO TICKS
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTickSound() {
  if (!audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = "sine";
    // Pitch depends slightly on current speed to sound dynamic
    osc.frequency.setValueAtTime(550, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.03);
    
    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch (e) {
    // Fallback if audio is blocked or fails
  }
}

// 6. ROULETTE SPIN PHYSICS ANIMATION
function spinWheel() {
  if (isSpinning || currentWheelPool.length === 0) return;

  initAudio();
  isSpinning = true;
  btnSpin.classList.add("disabled");
  
  // Choose winning index right now from the visual wheel pool
  const numSegments = currentWheelPool.length;
  const winningIndex = Math.floor(Math.random() * numSegments);
  winningSkylander = currentWheelPool[winningIndex];
  
  // Calculate Target Rotation Angle
  // The wheel pointer points to top center: -PI / 2 radians (270 degrees).
  // A rotation of angle R moves segment index I to the pointer.
  // The segment index I spans from: [I * segmentAngle, (I + 1) * segmentAngle]
  // Target position is: R = -PI/2 - (I + 0.5) * segmentAngle
  const segmentAngle = (2 * Math.PI) / numSegments;
  const targetSegmentCenter = winningIndex * segmentAngle + (segmentAngle / 2);
  
  // We want to do several full revolutions (e.g. 5 to 8) and land perfectly on target
  const numRevolutions = 6 + Math.floor(Math.random() * 3); 
  const startAngle = currentWheelAngle % (2 * Math.PI);
  
  // Calculate exact final absolute angle:
  // Pointer is at -PI/2. To bring targetSegmentCenter to -PI/2:
  // (currentWheelAngle + targetSegmentCenter) = -Math.PI/2 + numRevolutions * 2PI
  // Therefore, target absolute angle = -Math.PI/2 - targetSegmentCenter + numRevolutions * 2PI
  const finalAngle = -Math.PI / 2 - targetSegmentCenter + (numRevolutions * 2 * Math.PI);
  const deltaAngle = finalAngle - startAngle;

  const startTime = performance.now();
  const duration = 4000 + Math.random() * 1500; // 4 to 5.5 seconds spin

  rouletteStatus.textContent = "Estrazione in corso...";
  rouletteStatus.style.color = "var(--text-gold)";
  
  // Pulsing glow animation
  wheelGlow.style.animation = "spin-glow 1s infinite alternate ease-in-out";
  if (!document.getElementById("spinGlowStyle")) {
    const style = document.createElement("style");
    style.id = "spinGlowStyle";
    style.innerHTML = `
      @keyframes spin-glow {
        0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
        100% { box-shadow: 0 0 45px rgba(255, 215, 0, 0.7), 0 0 20px rgba(138, 43, 226, 0.4); }
      }
    `;
    document.head.appendChild(style);
  }

  lastTickSegmentIndex = -1;

  function animate(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing Out Cubic: starts very fast, slows down gradually
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    currentWheelAngle = startAngle + deltaAngle * easeOutCubic;

    // Check segment boundary crossings for audio ticks
    // Pointer is at -90 degrees relative to center.
    const pointerAngle = -Math.PI / 2;
    // Calculate which segment is currently aligned with the pointer
    const currentAngleNormalized = (currentWheelAngle) % (2 * Math.PI);
    const relativeAngle = (pointerAngle - currentAngleNormalized + 4 * Math.PI) % (2 * Math.PI);
    const currentSegmentIndex = Math.floor(relativeAngle / segmentAngle) % numSegments;

    if (currentSegmentIndex !== lastTickSegmentIndex) {
      if (lastTickSegmentIndex !== -1 && progress < 0.98) {
        playTickSound();
      }
      lastTickSegmentIndex = currentSegmentIndex;
    }

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Finished Spinning!
      isSpinning = false;
      wheelGlow.style.animation = "none";
      
      // Clean up modulo rotation so angle doesn't grow infinitely
      currentWheelAngle = currentWheelAngle % (2 * Math.PI);
      
      triggerCelebration();
    }
  }

  requestAnimationFrame(animate);
}

// 7. CELEBRATION & CONFETTI
function triggerCelebration() {
  rouletteStatus.textContent = `Estratto: ${winningSkylander.name}!`;
  rouletteStatus.style.color = "var(--text-gold)";

  // Pop up the modal
  winnerName.textContent = winningSkylander.name;
  winnerElement.textContent = winningSkylander.element;
  winnerGame.textContent = winningSkylander.game;
  winnerType.textContent = winningSkylander.type;
  
  // Set modal element color themes
  winnerModalCard.className = `modal-card ${winningSkylander.element.toLowerCase()}`;
  winnerModalOverlay.classList.add("active");

  // Fire Confetti!
  confettiParticles = [];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push(new ConfettiParticle(canvasConfetti.width, canvasConfetti.height));
  }
  
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
  }
  animateConfetti();
}

class ConfettiParticle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -100 - 20; // start above viewport
    this.size = Math.random() * 8 + 6;
    
    // Choose color matching the winner's element or rainbow colors
    const rColors = ["#ffd700", "#ff4500", "#eab308", "#a855f7", "#06b6d4", "#22c55e"];
    this.color = rColors[Math.floor(Math.random() * rColors.length)];
    
    this.speedY = Math.random() * 5 + 4;
    this.speedX = Math.random() * 6 - 3;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 8 - 4;
    this.opacity = 1;
    this.fadeSpeed = Math.random() * 0.005 + 0.002;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.opacity -= this.fadeSpeed;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function animateConfetti() {
  ctxConfetti.clearRect(0, 0, canvasConfetti.width, canvasConfetti.height);
  
  let activeParticles = false;
  confettiParticles.forEach(p => {
    p.update();
    p.draw(ctxConfetti);
    if (p.opacity > 0 && p.y < canvasConfetti.height) {
      activeParticles = true;
    }
  });

  if (activeParticles) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    ctxConfetti.clearRect(0, 0, canvasConfetti.width, canvasConfetti.height);
    confettiAnimationId = null;
  }
}

function resizeConfettiCanvas() {
  canvasConfetti.width = window.innerWidth;
  canvasConfetti.height = window.innerHeight;
}

// 8. IMPORT & EXPORT SAVES
function exportSave() {
  const saveData = {
    app: "SkylandersNuzlockeTracker",
    version: "1.0",
    currentGame: state.currentGame,
    settings: state.settings,
    rolledSkylanders: state.rolledSkylanders
  };

  const jsonString = JSON.stringify(saveData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  // Create virtual link to trigger download
  const link = document.createElement("a");
  const sanitisedGame = state.currentGame.toLowerCase().replace(/[^a-z0-9]/g, "_");
  link.download = `skylanders_nuzlocke_${sanitisedGame}.json`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handleImportFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      
      // Validation check
      if (parsed.app !== "SkylandersNuzlockeTracker") {
        alert("Errore: Il file non sembra essere un salvataggio valido di Skylanders Nuzlocke Tracker.");
        return;
      }

      if (parsed.currentGame) state.currentGame = parsed.currentGame;
      if (parsed.settings) state.settings = { ...state.settings, ...parsed.settings };
      if (parsed.rolledSkylanders) state.rolledSkylanders = parsed.rolledSkylanders;

      saveState();
      syncUI();
      alert("Salvataggio importato con successo!");
    } catch (err) {
      alert("Errore durante la lettura del file JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// 9. EVENT LISTENERS SETUP
function setupEventListeners() {
  // Game buttons selection
  gameGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".game-btn");
    if (!btn || isSpinning) return;

    state.currentGame = btn.dataset.game;
    saveState();
    syncUI();
  });

  // Settings Toggles
  toggleMinis.addEventListener("change", (e) => {
    if (isSpinning) {
      e.preventDefault();
      toggleMinis.checked = state.settings.includeMinis;
      return;
    }
    state.settings.includeMinis = toggleMinis.checked;
    saveState();
    syncUI();
  });

  toggleReimagined.addEventListener("change", (e) => {
    if (isSpinning) {
      e.preventDefault();
      toggleReimagined.checked = state.settings.includeReimagined;
      return;
    }
    state.settings.includeReimagined = toggleReimagined.checked;
    saveState();
    syncUI();
  });

  // Roster Bulk Operations
  btnMarkAllRolled.addEventListener("click", () => {
    if (isSpinning) return;
    const confirmAll = confirm("Sei sicuro di voler segnare TUTTI gli Skylanders di questa run come usciti?");
    if (!confirmAll) return;

    const filtered = getFilteredRoster();
    state.rolledSkylanders = filtered.map(c => c.name);
    saveState();
    syncUI();
  });

  btnMarkAllAvailable.addEventListener("click", () => {
    if (isSpinning) return;
    const confirmAll = confirm("Sei sicuro di voler ripristinare TUTTI gli Skylanders della run come disponibili?");
    if (!confirmAll) return;

    // Only clear rolled statuses for Skylanders belonging to the CURRENT active roster
    const activeRosterNames = getFilteredRoster().map(c => c.name);
    state.rolledSkylanders = state.rolledSkylanders.filter(name => !activeRosterNames.includes(name));
    
    saveState();
    syncUI();
  });

  // Reset Run entirely
  btnResetRun.addEventListener("click", () => {
    if (isSpinning) return;
    const confirmReset = confirm("Sei sicuro di voler resettare completamente la run? Tutti gli Skylanders contrassegnati diventeranno nuovamente disponibili.");
    if (!confirmReset) return;

    state.rolledSkylanders = [];
    saveState();
    syncUI();
  });

  // Export Save button
  btnExport.addEventListener("click", exportSave);

  // Import Save file picker
  fileImport.addEventListener("change", (e) => {
    const file = e.target.files[0];
    handleImportFile(file);
    // Reset file picker so the same file can be imported again if needed
    fileImport.value = "";
  });

  // Drag & Drop Save upload
  mainDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    mainDropZone.classList.add("drop-zone-active");
  });

  mainDropZone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    mainDropZone.classList.remove("drop-zone-active");
  });

  mainDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    mainDropZone.classList.remove("drop-zone-active");
    const file = e.dataTransfer.files[0];
    handleImportFile(file);
  });

  // Spin Button trigger
  btnSpin.addEventListener("click", spinWheel);

  // Modal Close / Confirmation
  btnModalClose.addEventListener("click", () => {
    if (winningSkylander) {
      // Mark as rolled
      if (!state.rolledSkylanders.includes(winningSkylander.name)) {
        state.rolledSkylanders.push(winningSkylander.name);
      }
      saveState();
      winningSkylander = null;
    }
    
    // Close modal
    winnerModalOverlay.classList.remove("active");
    
    // Refresh visual state
    syncUI();
  });

  // Canvas responsive confetti
  window.addEventListener("resize", () => {
    resizeConfettiCanvas();
  });
}

// Start
window.addEventListener("DOMContentLoaded", init);
