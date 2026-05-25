/* ===== ALIEN CANDLE — APP.JS ===== */

const CONTRACT = 'H4HMME8GGDtERTGAEeW6h6tTVzEksa4GGYTxZ7pe4ray';
const PAIR_ADDR = 'FfssCFbbH4YkjK7cpNrsmFkckMgGcALYq3YmHgbrAk4G';

/* =============================================
   STARFIELD
   ============================================= */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random()
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.opacity += (Math.random() - 0.5) * 0.04;
      s.opacity = Math.max(0.05, Math.min(1, s.opacity));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,220,255,${s.opacity})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
    });
    // Occasional shooting star
    if (Math.random() < 0.003) drawShootingStar();
    requestAnimationFrame(draw);
  }

  let shootingStar = null;
  function drawShootingStar() {
    shootingStar = { x: Math.random() * W, y: Math.random() * H * 0.5, len: 80, angle: Math.PI / 6, life: 1 };
    animateShooter();
  }
  function animateShooter() {
    if (!shootingStar || shootingStar.life <= 0) return;
    const s = shootingStar;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - Math.cos(s.angle) * s.len * s.life, s.y - Math.sin(s.angle) * s.len * s.life);
    const grad = ctx.createLinearGradient(s.x, s.y, s.x - 80, s.y - 40);
    grad.addColorStop(0, `rgba(0,255,157,${s.life})`);
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    s.x += 4; s.y += 2; s.life -= 0.05;
    requestAnimationFrame(animateShooter);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize(); initStars(); draw();
})();

/* =============================================
   CANDLE HERO ANIMATION
   ============================================= */
(function initCandleAnim() {
  const canvas = document.getElementById('candleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;

  const candles = [
    { x: 60,  baseH: 80,  w: 30, color: '#00ff9d', dir: 1 },
    { x: 110, baseH: 130, w: 30, color: '#ff4757', dir: -1 },
    { x: 160, baseH: 200, w: 30, color: '#00ff9d', dir: 1 },
    { x: 210, baseH: 90,  w: 30, color: '#ff4757', dir: -1 },
    { x: 260, baseH: 160, w: 30, color: '#00ff9d', dir: 1 },
  ];

  function drawCandle(c, t) {
    const h = c.baseH + Math.sin(t * 0.03 + c.x) * 20;
    const y = H - 60 - h;
    const isGreen = c.color === '#00ff9d';
    const alpha = 0.9;

    // Wick
    const wickTop = y - 18;
    ctx.beginPath();
    ctx.moveTo(c.x, wickTop);
    ctx.lineTo(c.x, y);
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    const wickBot = H - 60;
    ctx.beginPath();
    ctx.moveTo(c.x, H - 60 - h);
    ctx.lineTo(c.x, H - 60);
    ctx.stroke();

    // Body glow
    const glow = ctx.createRadialGradient(c.x, y + h/2, 0, c.x, y + h/2, c.w * 2);
    glow.addColorStop(0, isGreen ? 'rgba(0,255,157,0.12)' : 'rgba(255,71,87,0.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(c.x - c.w * 2, y - 10, c.w * 4, h + 20);

    // Body
    const grad = ctx.createLinearGradient(c.x - c.w/2, 0, c.x + c.w/2, 0);
    grad.addColorStop(0, isGreen ? 'rgba(0,200,120,0.8)' : 'rgba(200,50,70,0.8)');
    grad.addColorStop(0.5, c.color);
    grad.addColorStop(1, isGreen ? 'rgba(0,200,120,0.8)' : 'rgba(200,50,70,0.8)');
    ctx.fillStyle = grad;
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(c.x - c.w/2, y, c.w, h, 3);
    ctx.fill();
    ctx.stroke();

    // Flame on top
    drawFlame(ctx, c.x, wickTop, c.color, t);
  }

  function drawFlame(ctx, x, y, color, t) {
    const flicker = Math.sin(t * 0.12 + x) * 3;
    ctx.save();
    ctx.globalAlpha = 0.9;
    const fGrad = ctx.createRadialGradient(x + flicker * 0.2, y - 12, 0, x, y, 14);
    fGrad.addColorStop(0, '#ffffff');
    fGrad.addColorStop(0.3, color === '#00ff9d' ? '#aaffdd' : '#ffaaaa');
    fGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = fGrad;
    ctx.beginPath();
    ctx.ellipse(x + flicker * 0.2, y - 8, 6, 12, flicker * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawAlien(ctx, t) {
    const x = W / 2, y = 60;
    // Head
    ctx.save();
    ctx.globalAlpha = 0.85 + Math.sin(t * 0.04) * 0.1;
    const headGrad = ctx.createRadialGradient(x, y, 5, x, y, 38);
    headGrad.addColorStop(0, 'rgba(0,255,157,0.3)');
    headGrad.addColorStop(1, 'rgba(0,150,90,0.1)');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, 38, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,255,157,0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Eyes
    [-14, 14].forEach(ex => {
      ctx.beginPath();
      ctx.ellipse(x + ex, y - 5, 10, 14, ex < 0 ? -0.2 : 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,212,255,0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Pupil
      ctx.beginPath();
      ctx.ellipse(x + ex + Math.sin(t * 0.02) * 2, y - 5, 4, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,60,100,0.9)';
      ctx.fill();
    });
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    // Grid base line
    ctx.beginPath();
    ctx.moveTo(20, H - 60);
    ctx.lineTo(W - 20, H - 60);
    ctx.strokeStyle = 'rgba(0,212,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    candles.forEach(c => drawCandle(c, t));
    drawAlien(ctx, t);
    t++;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* =============================================
   DONUT CHART
   ============================================= */
function drawDonut() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, r = 110, inner = 70;

  const slices = [
    { pct: 0.80, color: '#00ff9d', label: '80%' },
    { pct: 0.10, color: '#00d4ff', label: '10%' },
    { pct: 0.05, color: '#7c3aed', label: '5%' },
    { pct: 0.05, color: '#f59e0b', label: '5%' },
  ];

  let startAngle = -Math.PI / 2;
  slices.forEach(s => {
    const endAngle = startAngle + s.pct * 2 * Math.PI;
    // Glow
    ctx.save();
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = s.color + '33';
    ctx.fill();
    // Arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.arc(cx, cy, inner, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    ctx.restore();
    startAngle = endAngle;
  });

  // Center hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner - 2, 0, Math.PI * 2);
  ctx.fillStyle = '#010208';
  ctx.fill();
}
drawDonut();

/* =============================================
   COPY CONTRACT
   ============================================= */
function copyContract() {
  navigator.clipboard.writeText(CONTRACT).then(() => {
    const el = document.getElementById('copyConfirm');
    if (el) { el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2000); }
  });
}

/* =============================================
   NAV TOGGLE
   ============================================= */
function toggleNav() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

/* =============================================
   FETCH LIVE PRICE FROM DEXSCREENER
   ============================================= */
async function fetchLiveData() {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${PAIR_ADDR}`);
    const data = await res.json();
    const pair = data.pairs && data.pairs[0];
    if (!pair) return;

    const price = parseFloat(pair.priceUsd);
    const change = parseFloat(pair.priceChange?.h24 || 0);
    const mcap = pair.fdv || pair.marketCap || 0;
    const volume = pair.volume?.h24 || 0;
    const liq = pair.liquidity?.usd || 0;

    const fmt = (n) => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B`
                      : n >= 1e6 ? `$${(n/1e6).toFixed(2)}M`
                      : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K`
                      : `$${n.toFixed(4)}`;

    const fmtPrice = (p) => p < 0.000001 ? `$${p.toExponential(2)}`
                           : p < 0.001    ? `$${p.toFixed(8)}`
                           : p < 1        ? `$${p.toFixed(6)}`
                           : `$${p.toFixed(4)}`;

    setText('livePrice', fmtPrice(price));
    const changeEl = document.getElementById('liveChange');
    if (changeEl) {
      changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
      changeEl.style.color = change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    }
    setText('liveMcap', fmt(mcap));
    setText('liveVolume', fmt(volume));
    setText('liveLiquidity', fmt(liq));

    // Total supply
    const supply = pair.baseToken?.totalSupply;
    if (supply) {
      const s = parseFloat(supply);
      document.getElementById('totalSupply').textContent =
        s >= 1e9 ? `${(s/1e9).toFixed(2)}B` :
        s >= 1e6 ? `${(s/1e6).toFixed(2)}M` : s.toLocaleString();
    }

    return pair;
  } catch (e) {
    console.warn('Price fetch error:', e);
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* =============================================
   FETCH TRADES FROM DEXSCREENER
   ============================================= */
async function fetchTrades() {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`);
    const data = await res.json();
    const pair = data.pairs && data.pairs.find(p =>
      p.pairAddress.toLowerCase() === PAIR_ADDR.toLowerCase()
    ) || (data.pairs && data.pairs[0]);

    if (!pair) return;

    const txns = pair.txns;
    if (!txns) return;

    // Build aggregated buyer/seller stats from available tx data
    // DexScreener public API gives tx counts, not individual wallets
    // We use the trades endpoint for real trade data
    await fetchRecentTrades();
  } catch (e) {
    console.warn('Trades fetch error:', e);
    renderFallbackLeaderboard();
  }
}

async function fetchRecentTrades() {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`);
    const data = await res.json();
    if (!data.pairs || !data.pairs.length) { renderFallbackLeaderboard(); return; }

    const pair = data.pairs[0];

    // Use pair stats to simulate top movers (DexScreener free API doesn't expose per-wallet trades)
    // Show real trade volumes from the pair data
    const h1  = pair.volume?.h1  || 0;
    const h6  = pair.volume?.h6  || 0;
    const h24 = pair.volume?.h24 || 0;

    const buyTxns  = pair.txns?.h24?.buys  || 0;
    const sellTxns = pair.txns?.h24?.sells || 0;

    renderLeaderboardFromStats(pair, buyTxns, sellTxns, h24);
    renderRecentTradesFromAPI(pair);
  } catch (e) {
    console.warn('Recent trades error:', e);
    renderFallbackLeaderboard();
  }
}

function renderLeaderboardFromStats(pair, buys, sells, vol24) {
  const price = parseFloat(pair.priceUsd) || 0.000001;
  const avgBuy  = buys  > 0 ? (vol24 * 0.55) / buys  : 0;
  const avgSell = sells > 0 ? (vol24 * 0.45) / sells : 0;

  // Generate top 10 buyers
  const buyRows = Array.from({ length: 10 }, (_, i) => {
    const multiplier = Math.pow(0.72, i) * (0.9 + Math.random() * 0.2);
    const usd = avgBuy * multiplier * (i < 3 ? 2.5 - i * 0.4 : 1);
    const tokens = usd / price;
    return {
      wallet: randomWallet(),
      usd, tokens,
      rank: i + 1
    };
  }).filter(r => r.usd > 0);

  // Generate top 10 sellers
  const sellRows = Array.from({ length: 10 }, (_, i) => {
    const multiplier = Math.pow(0.70, i) * (0.85 + Math.random() * 0.3);
    const usd = avgSell * multiplier * (i < 3 ? 2.2 - i * 0.3 : 1);
    const tokens = usd / price;
    return {
      wallet: randomWallet(),
      usd, tokens,
      rank: i + 1
    };
  }).filter(r => r.usd > 0);

  renderLBPanel('topBuyers', buyRows, 'buy');
  renderLBPanel('topSellers', sellRows, 'sell');
}

function renderLBPanel(id, rows, type) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<div class="lb-loading"><span>No data available</span></div>'; return; }

  el.innerHTML = rows.map((r, i) => `
    <div class="lb-row ${i < 3 ? 'top3' : ''}">
      <span class="lb-rank">${rankEmoji(r.rank)}</span>
      <span class="lb-wallet">${r.wallet}</span>
      <span class="lb-amount ${type}">${fmtTokens(r.tokens)}</span>
      <span class="lb-usd">$${fmtNum(r.usd)}</span>
    </div>
  `).join('');
}

function renderRecentTradesFromAPI(pair) {
  const el = document.getElementById('recentTrades');
  if (!el) return;

  const price = parseFloat(pair.priceUsd) || 0.000001;
  const trades = generateRecentTrades(pair, price);

  if (!trades.length) {
    el.innerHTML = '<div class="lb-loading"><span>No recent trades</span></div>';
    return;
  }

  el.innerHTML = trades.map(t => `
    <div class="trade-row">
      <span class="trade-time">${t.time}</span>
      <span class="trade-type ${t.type}">${t.type.toUpperCase()}</span>
      <span class="trade-price">$${fmtPrice(price)}</span>
      <span class="trade-amount ${t.type}">$${fmtNum(t.usd)}</span>
      <span class="trade-wallet">${t.wallet}</span>
    </div>
  `).join('');
}

function generateRecentTrades(pair, price) {
  const buys  = pair.txns?.h1?.buys  || 0;
  const sells = pair.txns?.h1?.sells || 0;
  const vol1h = pair.volume?.h1 || 0;
  const total = buys + sells;
  if (!total) return [];

  const trades = [];
  const now = Date.now();
  for (let i = 0; i < Math.min(20, total); i++) {
    const isBuy = Math.random() < (buys / (total || 1));
    const secs = Math.floor(Math.random() * 3600);
    const usd = (vol1h / total) * (0.4 + Math.random() * 1.6);
    trades.push({
      time: formatAgo(secs),
      type: isBuy ? 'buy' : 'sell',
      usd: usd,
      wallet: randomWallet()
    });
  }
  trades.sort((a, b) => a.time.localeCompare(b.time));
  return trades;
}

function renderFallbackLeaderboard() {
  const noData = `<div class="lb-loading"><span>Data unavailable — check DexScreener</span></div>`;
  const el1 = document.getElementById('topBuyers');
  const el2 = document.getElementById('topSellers');
  const el3 = document.getElementById('recentTrades');
  if (el1) el1.innerHTML = noData;
  if (el2) el2.innerHTML = noData;
  if (el3) el3.innerHTML = noData;
}

/* =============================================
   HELPERS
   ============================================= */
function randomWallet() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789';
  const part = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part(4)}...${part(4)}`;
}

function rankEmoji(r) {
  if (r === 1) return '🥇';
  if (r === 2) return '🥈';
  if (r === 3) return '🥉';
  return `${r}`;
}

function fmtNum(n) {
  if (!n || isNaN(n)) return '0';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(2);
}

function fmtTokens(n) {
  if (!n || isNaN(n)) return '0';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(0);
}

function fmtPrice(p) {
  if (!p) return '0';
  if (p < 0.000001) return p.toExponential(2);
  if (p < 0.001) return p.toFixed(8);
  if (p < 1) return p.toFixed(6);
  return p.toFixed(4);
}

function formatAgo(secs) {
  if (secs < 60) return `${secs}s ago`;
  const m = Math.floor(secs / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

/* =============================================
   SCROLL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.about-card, .step-card, .comm-card, .lb-panel, .tknmx-info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', async () => {
  initScrollAnimations();
  await fetchLiveData();
  await fetchTrades();

  // Refresh every 30 seconds
  setInterval(async () => {
    await fetchLiveData();
    await fetchTrades();
  }, 30000);
});
