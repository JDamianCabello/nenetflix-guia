const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if(conn && (conn.saveData || (conn.effectiveType && /2g/.test(conn.effectiveType)))){ document.body.classList.add('save-data'); }

/* NN wordmark (index): auto-open once on load (stays open until refresh) */
const nnToggles = Array.from(document.querySelectorAll("[data-nn-toggle]"));
if(nnToggles.length){
  const isIndex = /(^|\/)(index\.html)?$/.test(location.pathname) || location.pathname === "/";
  if(isIndex){
    // Trigger after a short delay so fonts/layout settle (smoother)
    window.addEventListener("load", ()=>{
      setTimeout(()=>{
        nnToggles.forEach(el => el.classList.add("is-open"));
      }, 750);
    });
}
}
/* Common UI bits */
const pages = window.NENETFLIX_PAGES || [];
const grid = document.querySelector(".pdf-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const toTop = document.getElementById("toTop");
const posterWall = document.getElementById("posterWall");
let currentIndex = -1;
const pageSrcs = pages.slice();

function buildPages(){
  if(!grid) return;
  const titles = [
    "Todo en un solo lugar (precio y comparación)",
    "Qué es NENETFLIX (Plex)",
    "Qué contenido hay",
    "Cómo funciona (3 pasos)",
    "Dónde puedes usarlo",
    "Inicio de sesión (web)",
    "Inicio de sesión en TV (con móvil)",
    "Primer inicio y limpieza del menú",
    "Ordenar bibliotecas (pelis/series)",
    ];

  pages.forEach((src, idx) => {
    const card = document.createElement("article");
    card.className = "page reveal";
    card.innerHTML = `
      <img src="${src}" alt="Guía NENETFLIX - página ${idx+1}" loading="lazy"/>
    `;
    const img = card.querySelector("img");
    img.addEventListener("click", () => openLightbox(src, idx));
    card.dataset.idx = String(idx);
    grid.appendChild(card);

    // Neon divider between slides (visible on mobile + desktop)
    if(idx !== pages.length - 1){
      const divider = document.createElement("div");
      divider.className = "neon-divider reveal";
      divider.setAttribute("aria-hidden","true");
      grid.appendChild(divider);
    }
  });
}

function openLightbox(src, idx){
  if(!lightbox || !lightboxImg) return;
  if(typeof idx === "number") currentIndex = idx;
  else currentIndex = pageSrcs.indexOf(src);
  lightboxImg.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
}

function closeLightbox(){
  if(!lightbox || !lightboxImg) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");
  lightboxImg.src = "";
}

if(lightbox && lightboxClose){
  lightbox.addEventListener("click", (e)=>{
    if(e.target === lightbox) closeLightbox();
  });
  lightboxClose.addEventListener("click", closeLightbox);
}

const lbPrev = document.getElementById("lightboxPrev");
const lbNext = document.getElementById("lightboxNext");

function showAt(i){
  if(i < 0) i = pageSrcs.length - 1;
  if(i >= pageSrcs.length) i = 0;
  currentIndex = i;
  openLightbox(pageSrcs[currentIndex], currentIndex);
}
if(lbPrev) lbPrev.addEventListener("click", (e)=>{ e.stopPropagation(); showAt(currentIndex-1); });
if(lbNext) lbNext.addEventListener("click", (e)=>{ e.stopPropagation(); showAt(currentIndex+1); });

document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape") closeLightbox();
  if(lightbox && lightbox.classList.contains("open")){
    if(e.key === "ArrowLeft") showAt(currentIndex-1);
    if(e.key === "ArrowRight") showAt(currentIndex+1);
  }
});

const progressTrack = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");

function handleScroll(){
  const y = window.scrollY || 0;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  // Progress bar: fill inner bar (track is always visible)
  if(progressBar && docH > 0){
    progressBar.style.width = (y/docH*100).toFixed(2) + "%";
  }

  updateGlow();

  if(toTop){
    if(y > 600) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }

  // subtle parallax for hero posters (if present)
  if(posterWall){
    posterWall.style.transform = `perspective(900px) rotateY(-8deg) rotateX(4deg) translateY(${Math.min(0, -y*0.03)}px)`;
  }
}

// rAF throttling for smoother scrolling on mobile
let _ticking = false;
function onScroll(){
  if(_ticking) return;
  _ticking = true;
  requestAnimationFrame(()=>{
    handleScroll();
    _ticking = false;
  });
}
window.addEventListener("scroll", onScroll, {passive:true});
window.addEventListener("load", handleScroll, {passive:true});

if(toTop){
  toTop.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));
}

/* Reveal animation */
const io = new IntersectionObserver((entries)=>{
  for(const en of entries){
    if(en.isIntersecting) en.target.classList.add("show");
  }
},{threshold: 0.12});

function watchReveals(){
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

// Removed legacy drawer/hamburger code (not used anymore)

/* init */
if(grid) buildPages();
watchReveals();
if(posterWall) posterWall.classList.add("float");

// v7: subtle hero glow parallax + button ripple (mobile-friendly)
const heroEl = document.querySelector(".hero");
function updateGlow(){
  if(!heroEl) return;
  const y = window.scrollY || 0;
  const xOff = Math.sin(y/420) * 12;
  const yOff = (y/18) * 0.35;
  heroEl.style.setProperty("--glowX", xOff.toFixed(2) + "px");
  heroEl.style.setProperty("--glowY", yOff.toFixed(2) + "px");
}
updateGlow();

document.querySelectorAll(".btn").forEach(btn=>{
  btn.addEventListener("pointerdown", (e)=>{
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    btn.style.setProperty("--rx", x.toFixed(2) + "%");
    btn.style.setProperty("--ry", y.toFixed(2) + "%");
    btn.classList.remove("ripple");
    // force reflow
    void btn.offsetWidth;
    btn.classList.add("ripple");
  }, {passive:true});
});

// v8RevealFallback: ensure reveal never stays hidden/blurred
window.addEventListener("load", ()=>{
  setTimeout(()=>{
    document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));
  }, 600);
});

// v10: mark images loaded (remove shimmer)
document.querySelectorAll("img").forEach(img=>{
  if(img.complete) img.classList.add("is-loaded");
  img.addEventListener("load", ()=>img.classList.add("is-loaded"), {passive:true});
});

// v10: share button (Web Share API + WhatsApp fallback)
const shareBtn = document.getElementById("shareBtn");
if(shareBtn){
  shareBtn.addEventListener("click", async ()=>{
    const url = window.location.href;
    const title = "NENETFLIX · Guía";
    const text = "🎬 NENETFLIX: streaming privado tipo Netflix en Plex. 50€ al año · 2 pantallas · Peticiones incluidas.";
    try{
      if(navigator.share){
        await navigator.share({title, text, url});
      }else{
        try{ await navigator.clipboard.writeText(url); alert("Enlace copiado ✅"); }catch(e){ alert(url); }
      }
    }catch(e){}
  });
}

// v10: mode toggle (Guía vs Modo fácil)
const modeFull = document.getElementById("modeFull");
const modeEasy = document.getElementById("modeEasy");
const easyMode = document.getElementById("easyMode");
const fullGuide = document.getElementById("fullGuide");

function setMode(mode){
  const isEasy = mode === "easy";
  if(easyMode) easyMode.classList.toggle("active", isEasy);
  if(fullGuide) fullGuide.classList.toggle("hidden", isEasy);
  if(modeFull){ modeFull.classList.toggle("active", !isEasy); modeFull.setAttribute("aria-selected", String(!isEasy)); }
  if(modeEasy){ modeEasy.classList.toggle("active", isEasy); modeEasy.setAttribute("aria-selected", String(isEasy)); }
  localStorage.setItem("nenetflix_mode", mode);
}

const savedMode = localStorage.getItem("nenetflix_mode");
if(savedMode) setMode(savedMode);

modeFull?.addEventListener("click", ()=> setMode("full"));
modeEasy?.addEventListener("click", ()=> setMode("easy"));

// v10: FAQ accordion
document.querySelectorAll(".faq-q").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    btn.classList.toggle("open");
  });
});

// v10: sound toggle (tiny UI click)
const soundBtn = document.getElementById("soundBtn");
const soundIcon = document.getElementById("soundIcon");
let soundOn = localStorage.getItem("nenetflix_sound") === "1";

function updateSoundUI(){
  if(soundIcon) soundIcon.textContent = soundOn ? "🔊" : "🔇";
}
updateSoundUI();

function uiClick(){
  if(!soundOn) return;
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = 520;
    g.gain.value = 0.0001;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    o.stop(ctx.currentTime + 0.09);
    o.onended = ()=> ctx.close();
  }catch(e){}
}

// Attach click sound to buttons/links
document.addEventListener("click", (e)=>{
  const t = e.target.closest("button, a");
  if(t) uiClick();
}, {passive:true});

soundBtn?.addEventListener("click", ()=>{
  soundOn = !soundOn;
  localStorage.setItem("nenetflix_sound", soundOn ? "1" : "0");
  updateSoundUI();
});

// Hook reset when opening/closing
const _openLightbox = openLightbox;
openLightbox = function(src, idx){
  resetLbTransform();
  _openLightbox(src, idx);
}
const _closeLightbox = closeLightbox;
closeLightbox = function(){
  resetLbTransform();
  _closeLightbox();
}

// v13: one-time logo animation
(function(){
  const key = "nenetflix_logo_once";
  const h1 = document.getElementById("heroTitle");
  if(h1){
    const done = localStorage.getItem(key) === "1";
    if(!done){
      h1.classList.add("logo-once");
      localStorage.setItem(key, "1");
    }
  }
})();


// Mobile hamburger/menu removed (requested): actions are visible on mobile now.
