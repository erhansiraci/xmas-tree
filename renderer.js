// Canvas setup
const treeCanvas = document.getElementById('tree-canvas');
const snowCanvas = document.getElementById('snow-canvas');
const treeCtx = treeCanvas.getContext('2d');
const snowCtx = snowCanvas.getContext('2d');

// Set canvas dimensions - responsive to window size
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
treeCanvas.width = snowCanvas.width = WIDTH;
treeCanvas.height = snowCanvas.height = HEIGHT;

// Base design dimensions
const BASE_WIDTH = 400;
const BASE_HEIGHT = 500;

// Calculate scale and offset for centering horizontally, align to bottom
function updateScale() {
  SCALE = Math.min(WIDTH / BASE_WIDTH, HEIGHT / BASE_HEIGHT);
  OFFSET_X = (WIDTH - BASE_WIDTH * SCALE) / 2;
  OFFSET_Y = HEIGHT - BASE_HEIGHT * SCALE;
}

let SCALE, OFFSET_X, OFFSET_Y;
updateScale();

// Handle window resize
window.addEventListener('resize', () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  treeCanvas.width = snowCanvas.width = WIDTH;
  treeCanvas.height = snowCanvas.height = HEIGHT;
  updateScale();
  initSnow();
});

// State
let lightsOn = true;
let snowOn = true;
let deleteMode = false;
let selectedOrnamentType = null;  // Which ornament is selected for adding
let ornaments = [];
let gifts = [];
let snowflakes = [];
let sparkles = [];
let tinselStrands = [];
let frame = 0;

// Asset paths
const ASSET_PATH = 'assets/PNG/';

// Load all images
const images = {};
const imageNames = [
  'agac', 'beyaztop', 'kirmizitop', 'mavitop', 'saritop',
  'hediye1', 'hediye2', 'hediye3', 'hediye4', 'hediye5', 'hediye6',
  'kozalak', 'zil'
];

let imagesLoaded = 0;
const totalImages = imageNames.length;

// Handle both development and production paths
const path = require('path');
const isPackaged = process.mainModule && process.mainModule.filename.includes('app.asar');

function getAssetPath(name) {
  if (isPackaged && process.resourcesPath) {
    return path.join(process.resourcesPath, 'app.asar.unpacked', ASSET_PATH, name + '.png');
  }
  return ASSET_PATH + name + '.png';
}

imageNames.forEach(name => {
  images[name] = new Image();
  images[name].onload = () => {
    imagesLoaded++;
    console.log(`Loaded ${name} (${imagesLoaded}/${totalImages})`);
    if (imagesLoaded === totalImages) {
      console.log('🎄 All assets loaded!');
      initTinsel();
      initOrnaments();
      initGifts();
    }
  };
  images[name].onerror = (e) => {
    console.error(`Failed to load ${name}`, e);
  };
  images[name].src = getAssetPath(name);
});

// Check if a point is within the tree boundaries (triangular shape)
function isInsideTree(x, y) {
  // Tree approximate boundaries (triangular shape)
  // Top point around (200, 70), bottom-left (50, 400), bottom-right (350, 400)
  const topX = 200, topY = 70;
  const bottomLeftX = 50, bottomLeftY = 400;
  const bottomRightX = 350, bottomRightY = 400;

  // Check if point is inside the triangle using barycentric coordinates
  function sign(p1x, p1y, p2x, p2y, p3x, p3y) {
    return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
  }

  const d1 = sign(x, y, topX, topY, bottomLeftX, bottomLeftY);
  const d2 = sign(x, y, bottomLeftX, bottomLeftY, bottomRightX, bottomRightY);
  const d3 = sign(x, y, bottomRightX, bottomRightY, topX, topY);

  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(hasNeg && hasPos);
}

// Initialize tinsel garlands
function initTinsel() {
  tinselStrands = [];

  // Tinsel colors - silver and gold
  const colors = [
    { main: '#C0C0C0', shine: '#FFFFFF' },  // Silver
    { main: '#FFD700', shine: '#FFFACD' },  // Gold
    { main: '#C0C0C0', shine: '#FFFFFF' },  // Silver
    { main: '#FFD700', shine: '#FFFACD' },  // Gold
  ];

  // Define tinsel paths across the tree (draping curves)
  const tinselPaths = [
    { y: 130, leftX: 165, rightX: 235, sag: 15 },
    { y: 190, leftX: 130, rightX: 270, sag: 20 },
    { y: 260, leftX: 100, rightX: 300, sag: 25 },
    { y: 340, leftX: 70, rightX: 330, sag: 30 },
  ];

  tinselPaths.forEach((path, i) => {
    tinselStrands.push({
      ...path,
      color: colors[i % colors.length],
      phase: Math.random() * Math.PI * 2
    });
  });
}

// Initialize snowflakes
function initSnow() {
  snowflakes = [];
  for (let i = 0; i < 60; i++) {
    snowflakes.push({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      size: 2 + Math.random() * 4,
      speed: 0.5 + Math.random() * 1.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
      opacity: 0.5 + Math.random() * 0.5
    });
  }
}

// Initialize ornaments on the tree
function initOrnaments() {
  ornaments = [];

  // Ornament types with their images
  const ornamentTypes = [
    'beyaztop', 'kirmizitop', 'mavitop', 'saritop', 'kozalak', 'zil'
  ];

  // Predefined positions on the tree (in base coordinates) - spread evenly
  const positions = [
    // Top tier (narrow)
    { x: 200, y: 95, size: 28 },
    // Second tier
    { x: 170, y: 140, size: 32 },
    { x: 230, y: 145, size: 30 },
    // Third tier
    { x: 140, y: 185, size: 34 },
    { x: 200, y: 180, size: 32 },
    { x: 260, y: 190, size: 34 },
    // Fourth tier
    { x: 115, y: 235, size: 36 },
    { x: 175, y: 230, size: 34 },
    { x: 235, y: 228, size: 34 },
    { x: 290, y: 240, size: 36 },
    // Fifth tier
    { x: 90, y: 290, size: 38 },
    { x: 150, y: 285, size: 36 },
    { x: 210, y: 280, size: 36 },
    { x: 270, y: 288, size: 36 },
    { x: 325, y: 295, size: 38 },
    // Bottom tier (widest)
    { x: 70, y: 350, size: 40 },
    { x: 135, y: 345, size: 38 },
    { x: 200, y: 340, size: 38 },
    { x: 265, y: 348, size: 38 },
    { x: 330, y: 355, size: 40 },
  ];

  // Shuffle and select positions
  const shuffled = positions.sort(() => Math.random() - 0.5);
  const count = 12 + Math.floor(Math.random() * 5); // 12-16 ornaments

  for (let i = 0; i < count && i < shuffled.length; i++) {
    const pos = shuffled[i];
    const type = ornamentTypes[Math.floor(Math.random() * ornamentTypes.length)];

    ornaments.push({
      x: pos.x + (Math.random() - 0.5) * 15,
      y: pos.y + (Math.random() - 0.5) * 10,
      size: pos.size + (Math.random() - 0.5) * 10,
      type: type,
      rotation: (Math.random() - 0.5) * 0.3,
      swingPhase: Math.random() * Math.PI * 2
    });
  }
}

// Initialize gifts at the bottom
function initGifts() {
  gifts = [];
  const giftTypes = ['hediye1', 'hediye2', 'hediye3', 'hediye4', 'hediye5', 'hediye6'];

  // Place 3-4 gifts at the bottom of the tree
  const giftPositions = [
    { x: 95, y: 420, size: 55 },
    { x: 165, y: 425, size: 60 },
    { x: 245, y: 422, size: 58 },
    { x: 315, y: 428, size: 52 },
  ];

  const count = 3 + Math.floor(Math.random() * 2);
  const shuffled = giftPositions.sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const pos = shuffled[i];
    gifts.push({
      x: pos.x + (Math.random() - 0.5) * 20,
      y: pos.y,
      size: pos.size + Math.random() * 15,
      type: giftTypes[Math.floor(Math.random() * giftTypes.length)]
    });
  }
}

// Draw the tree and all decorations
function drawTree() {
  treeCtx.clearRect(0, 0, WIDTH, HEIGHT);

  if (imagesLoaded < totalImages) {
    // Show loading text
    treeCtx.fillStyle = '#ffffff';
    treeCtx.font = '20px Arial';
    treeCtx.textAlign = 'center';
    treeCtx.fillText('Loading...', WIDTH / 2, HEIGHT / 2);
    return;
  }

  // Apply scale transform
  treeCtx.save();
  treeCtx.translate(OFFSET_X, OFFSET_Y);
  treeCtx.scale(SCALE, SCALE);

  // Draw the tree first
  const treeImg = images['agac'];
  if (treeImg.complete) {
    const treeWidth = 380;
    const treeHeight = treeWidth * (treeImg.height / treeImg.width);
    const treeX = BASE_WIDTH / 2 - treeWidth / 2;
    const treeY = BASE_HEIGHT - treeHeight - 20;
    treeCtx.drawImage(treeImg, treeX, treeY, treeWidth, treeHeight);
  }

  // Draw tinsel garlands on the tree
  drawTinsel();

  // Draw ornaments on the tree
  ornaments.forEach(ornament => {
    drawOrnament(ornament);
  });

  // Draw gifts in front of tree (at the base)
  gifts.forEach(gift => {
    drawImage(gift.type, gift.x, gift.y, gift.size);
  });

  // Draw sparkles
  drawSparkles();

  // Draw lights effect if enabled
  if (lightsOn) {
    drawLights();
  }

  treeCtx.restore();
}

// Draw a single image
function drawImage(name, x, y, size) {
  const img = images[name];
  if (img && img.complete) {
    const aspectRatio = img.height / img.width;
    const width = size;
    const height = size * aspectRatio;
    treeCtx.drawImage(img, x - width / 2, y - height / 2, width, height);
  }
}

// Draw ornament with swing animation
function drawOrnament(ornament) {
  const { x, y, size, type, rotation, swingPhase } = ornament;

  // Gentle swing animation
  const swing = Math.sin(frame * 0.02 + swingPhase) * 0.05;

  treeCtx.save();
  treeCtx.translate(x, y);
  treeCtx.rotate(rotation + swing);

  const img = images[type];
  if (img && img.complete) {
    const aspectRatio = img.height / img.width;
    const width = size;
    const height = size * aspectRatio;
    treeCtx.drawImage(img, -width / 2, -height / 2, width, height);
  }

  treeCtx.restore();
}

// Draw tinsel garlands
function drawTinsel() {
  tinselStrands.forEach((strand, index) => {
    const { y, leftX, rightX, sag, color, phase } = strand;

    // Draw the main tinsel curve
    treeCtx.beginPath();
    treeCtx.moveTo(leftX, y);

    // Create a sagging curve using quadratic bezier
    const midX = (leftX + rightX) / 2;
    const midY = y + sag;
    treeCtx.quadraticCurveTo(midX, midY, rightX, y);

    // Main tinsel line with gradient
    const gradient = treeCtx.createLinearGradient(leftX, y, rightX, y);
    gradient.addColorStop(0, color.main + '80');
    gradient.addColorStop(0.5, color.shine);
    gradient.addColorStop(1, color.main + '80');

    treeCtx.strokeStyle = gradient;
    treeCtx.lineWidth = 3;
    treeCtx.lineCap = 'round';
    treeCtx.stroke();

    // Add sparkle points along the tinsel
    const numSparkles = 12;
    for (let i = 0; i <= numSparkles; i++) {
      const t = i / numSparkles;
      // Calculate point on quadratic bezier curve
      const px = (1 - t) * (1 - t) * leftX + 2 * (1 - t) * t * midX + t * t * rightX;
      const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * midY + t * t * y;

      // Animated sparkle intensity
      const sparkleIntensity = Math.sin(frame * 0.15 + phase + i * 0.8) * 0.5 + 0.5;

      if (sparkleIntensity > 0.3) {
        const sparkleSize = 2 + sparkleIntensity * 3;

        // Sparkle glow
        const glow = treeCtx.createRadialGradient(px, py, 0, px, py, sparkleSize);
        glow.addColorStop(0, color.shine);
        glow.addColorStop(0.5, color.main + '80');
        glow.addColorStop(1, 'transparent');

        treeCtx.fillStyle = glow;
        treeCtx.beginPath();
        treeCtx.arc(px, py, sparkleSize, 0, Math.PI * 2);
        treeCtx.fill();
      }
    }
  });
}

// Draw twinkling lights effect
function drawLights() {
  const lightPositions = [
    { x: 180, y: 140 }, { x: 220, y: 145 },
    { x: 150, y: 190 }, { x: 250, y: 185 },
    { x: 130, y: 240 }, { x: 200, y: 235 }, { x: 270, y: 245 },
    { x: 110, y: 300 }, { x: 180, y: 290 }, { x: 250, y: 295 }, { x: 300, y: 305 },
    { x: 95, y: 360 }, { x: 160, y: 350 }, { x: 230, y: 355 }, { x: 300, y: 360 }, { x: 330, y: 370 },
  ];

  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];

  lightPositions.forEach((pos, i) => {
    const twinkle = Math.sin(frame * 0.1 + i * 0.5) * 0.5 + 0.5;
    const color = colors[i % colors.length];
    const glowSize = 8 + twinkle * 12;

    // Glow
    const glow = treeCtx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowSize);
    glow.addColorStop(0, color);
    glow.addColorStop(0.5, color + '80');
    glow.addColorStop(1, 'transparent');

    treeCtx.fillStyle = glow;
    treeCtx.beginPath();
    treeCtx.arc(pos.x, pos.y, glowSize, 0, Math.PI * 2);
    treeCtx.fill();
  });
}

// Draw sparkles
function drawSparkles() {
  sparkles = sparkles.filter(s => s.life > 0);
  sparkles.forEach(sparkle => {
    const alpha = sparkle.life / sparkle.maxLife;

    treeCtx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
    treeCtx.beginPath();
    treeCtx.arc(sparkle.x, sparkle.y, sparkle.size * alpha, 0, Math.PI * 2);
    treeCtx.fill();

    sparkle.x += sparkle.vx;
    sparkle.y += sparkle.vy;
    sparkle.vy += 0.1;
    sparkle.life--;
  });
}

// Create sparkle effect
function createSparkles(x, y, count = 15) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    sparkles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 3 + Math.random() * 4,
      life: 30,
      maxLife: 30
    });
  }
}

// Draw snow
function drawSnow() {
  snowCtx.clearRect(0, 0, WIDTH, HEIGHT);

  if (!snowOn) return;

  snowflakes.forEach(flake => {
    flake.y += flake.speed;
    flake.wobble += flake.wobbleSpeed;
    flake.x += Math.sin(flake.wobble) * 0.8;

    if (flake.y > HEIGHT) {
      flake.y = -10;
      flake.x = Math.random() * WIDTH;
    }
    if (flake.x > WIDTH) flake.x = 0;
    if (flake.x < 0) flake.x = WIDTH;

    const gradient = snowCtx.createRadialGradient(
      flake.x, flake.y, 0,
      flake.x, flake.y, flake.size
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${flake.opacity})`);
    gradient.addColorStop(1, 'transparent');

    snowCtx.fillStyle = gradient;
    snowCtx.beginPath();
    snowCtx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
    snowCtx.fill();
  });
}

// Click handler
treeCanvas.addEventListener('click', (e) => {
  const rect = treeCanvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Convert to base coordinates
  const x = (clickX - OFFSET_X) / SCALE;
  const y = (clickY - OFFSET_Y) / SCALE;

  // Delete mode (shift+click or delete mode toggle) - only ornaments, not gifts
  if (deleteMode || e.shiftKey) {
    for (let i = ornaments.length - 1; i >= 0; i--) {
      const orn = ornaments[i];
      const dx = orn.x - x;
      const dy = orn.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < orn.size) {
        createSparkles(orn.x, orn.y, 20);
        ornaments.splice(i, 1);
        return;
      }
    }
    return;
  }

  // Add ornament mode - add selected ornament where clicked
  if (selectedOrnamentType) {
    if (isInsideTree(x, y)) {
      ornaments.push({
        x,
        y,
        size: 30 + Math.random() * 10,
        type: selectedOrnamentType,
        rotation: (Math.random() - 0.5) * 0.3,
        swingPhase: Math.random() * Math.PI * 2
      });
      createSparkles(x, y, 20);
    }
    return;
  }

  // Normal click - create sparkles on ornaments
  ornaments.forEach(orn => {
    const dx = orn.x - x;
    const dy = orn.y - y;
    if (Math.sqrt(dx * dx + dy * dy) < orn.size) {
      createSparkles(orn.x, orn.y, 25);
    }
  });
});

// Control buttons
document.getElementById('toggle-snow').addEventListener('click', () => {
  snowOn = !snowOn;
  document.getElementById('toggle-snow').classList.toggle('active', snowOn);
});

document.getElementById('toggle-lights').addEventListener('click', () => {
  lightsOn = !lightsOn;
  document.getElementById('toggle-lights').classList.toggle('active', lightsOn);
});

// Clear all ornaments (empty tree)
document.getElementById('clear-ornaments').addEventListener('click', () => {
  ornaments = [];
  // Clear any selected ornament
  selectedOrnamentType = null;
  document.querySelectorAll('.ornament-btn').forEach(btn => btn.classList.remove('selected'));
  treeCanvas.style.cursor = 'grab';
});

// Randomize tree (regenerate random ornaments)
document.getElementById('reset-tree').addEventListener('click', () => {
  initTinsel();
  initOrnaments();
  initGifts();
  // Clear any selected ornament
  selectedOrnamentType = null;
  document.querySelectorAll('.ornament-btn').forEach(btn => btn.classList.remove('selected'));
  treeCanvas.style.cursor = 'grab';
});

// Delete mode toggle
document.getElementById('delete-mode').addEventListener('click', () => {
  deleteMode = !deleteMode;
  // Turn off ornament selection if delete mode is enabled
  if (deleteMode) {
    selectedOrnamentType = null;
    document.querySelectorAll('.ornament-btn').forEach(btn => btn.classList.remove('selected'));
  }
  document.getElementById('delete-mode').classList.toggle('active', deleteMode);
  treeCanvas.style.cursor = deleteMode ? 'crosshair' : 'grab';
});

// Ornament palette buttons
document.querySelectorAll('.ornament-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;

    // Toggle selection
    if (selectedOrnamentType === type) {
      // Deselect
      selectedOrnamentType = null;
      btn.classList.remove('selected');
      treeCanvas.style.cursor = 'grab';
    } else {
      // Select this ornament
      selectedOrnamentType = type;
      // Turn off delete mode
      deleteMode = false;
      document.getElementById('delete-mode').classList.remove('active');
      // Update UI
      document.querySelectorAll('.ornament-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      treeCanvas.style.cursor = 'cell';
    }
  });
});

document.getElementById('close-widget').addEventListener('click', () => {
  window.close();
});

// Animation loop
function animate() {
  frame++;
  drawTree();
  drawSnow();
  requestAnimationFrame(animate);
}

// Initialize
initSnow();
animate();

// Make buttons active by default
document.getElementById('toggle-snow').classList.add('active');
document.getElementById('toggle-lights').classList.add('active');

console.log('🎄 Xmas Tree - Loading assets...');
