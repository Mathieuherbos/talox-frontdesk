// Page /demo : lecteur audio personnalisé + transcription synchronisée.
// Isolé de main.js car propre à cette page (pas de build step, on charge en plus).

document.addEventListener('DOMContentLoaded', () => {
  initCallPlayer();
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function initCallPlayer() {
  const audio = document.getElementById('call-audio');
  const playBtn = document.querySelector('[data-play]');
  const progress = document.querySelector('[data-progress]');
  const progressFill = document.querySelector('[data-progress-fill]');
  const currentEl = document.querySelector('[data-current]');
  const durationEl = document.querySelector('[data-duration]');
  const bubbles = Array.from(document.querySelectorAll('.t-bubble[data-start]'));
  if (!audio || !playBtn || !progress) return;

  const starts = bubbles.map((b) => parseFloat(b.dataset.start));
  let activeIndex = -1;

  function setActiveBubble(time) {
    let idx = -1;
    for (let i = 0; i < starts.length; i++) {
      if (time >= starts[i]) idx = i; else break;
    }
    if (idx === activeIndex) return;
    if (activeIndex >= 0) bubbles[activeIndex].classList.remove('is-active');
    activeIndex = idx;
    if (activeIndex >= 0) {
      const el = bubbles[activeIndex];
      el.classList.add('is-active');
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function updateProgress() {
    const duration = audio.duration || parseDuration(durationEl?.textContent) || 99;
    const pct = duration ? Math.min(100, (audio.currentTime / duration) * 100) : 0;
    progressFill.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', Math.round(audio.currentTime));
    if (currentEl) currentEl.textContent = formatTime(audio.currentTime);
    setActiveBubble(audio.currentTime);
  }

  function parseDuration(text) {
    if (!text) return null;
    const [m, s] = text.split(':').map(Number);
    return Number.isFinite(m) && Number.isFinite(s) ? m * 60 + s : null;
  }

  function seekTo(time) {
    const duration = audio.duration || parseDuration(durationEl?.textContent) || 99;
    audio.currentTime = Math.max(0, Math.min(duration, time));
    updateProgress();
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) audio.play(); else audio.pause();
  });
  audio.addEventListener('play', () => playBtn.setAttribute('aria-pressed', 'true'));
  audio.addEventListener('pause', () => playBtn.setAttribute('aria-pressed', 'false'));
  audio.addEventListener('ended', () => playBtn.setAttribute('aria-pressed', 'false'));
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', () => {
    if (durationEl && Number.isFinite(audio.duration)) durationEl.textContent = formatTime(audio.duration);
    progress.setAttribute('aria-valuemax', Math.round(audio.duration || 99));
  });

  progress.addEventListener('click', (e) => {
    const rect = progress.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const duration = audio.duration || parseDuration(durationEl?.textContent) || 99;
    seekTo(ratio * duration);
  });
  progress.addEventListener('keydown', (e) => {
    const duration = audio.duration || parseDuration(durationEl?.textContent) || 99;
    if (e.key === 'ArrowRight') { seekTo(audio.currentTime + 5); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { seekTo(audio.currentTime - 5); e.preventDefault(); }
    else if (e.key === 'Home') { seekTo(0); e.preventDefault(); }
    else if (e.key === 'End') { seekTo(duration); e.preventDefault(); }
  });

  bubbles.forEach((bubble, i) => {
    const jump = () => {
      seekTo(starts[i]);
      audio.play();
    };
    bubble.addEventListener('click', jump);
    bubble.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jump(); }
    });
  });
}
