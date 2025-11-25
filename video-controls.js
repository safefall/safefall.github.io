(function() {
  const video = document.getElementById('teaser');
  const playBtn = document.getElementById('play-pause');
  const progress = document.getElementById('progress');
  const volume = document.getElementById('volume');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const fullscreenBtn = document.getElementById('fullscreen');

  if (!video) return;

  // Format seconds as M:SS
  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Update play/pause button
  function updatePlayButton() {
    playBtn.textContent = video.paused ? '▶' : '❚❚';
    playBtn.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
  }

  // When metadata loaded, set duration
  video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(video.duration);
    progress.max = Math.floor(video.duration);
  });

  // Timeupdate -> progress
  video.addEventListener('timeupdate', () => {
    progress.value = Math.floor(video.currentTime);
    currentTimeEl.textContent = formatTime(video.currentTime);
  });

  // Play/pause button
  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayButton();
  });

  // Clicking progress seeks
  progress.addEventListener('input', (e) => {
    video.currentTime = e.target.value;
  });

  // Volume control
  volume.addEventListener('input', (e) => {
    video.volume = e.target.value;
  });

  // Update button when playback state changes
  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);

  // Fullscreen toggle
  fullscreenBtn.addEventListener('click', () => {
    const container = video.closest('.video-container');
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) container.requestFullscreen();
      else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  });

  // Keyboard shortcuts: space to play/pause, f for fullscreen, m mute
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // don't intercept when typing
    if (e.code === 'Space') {
      e.preventDefault();
      if (video.paused) video.play(); else video.pause();
      updatePlayButton();
    } else if (e.key === 'f') {
      fullscreenBtn.click();
    } else if (e.key === 'm') {
      video.muted = !video.muted;
    }
  });

  // Initialize UI
  updatePlayButton();
  currentTimeEl.textContent = formatTime(0);
  durationEl.textContent = formatTime(NaN);
  progress.value = 0;
  volume.value = video.volume;
})();
