document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.player-card').forEach(card => {
    const audio = card.querySelector('.player-audio');
    const img = card.querySelector('.player-img');
    const playOverlay = card.querySelector('.play-btn-overlay');
    const playBottom = card.querySelector('.play-btn-bottom');
    const progress = card.querySelector('.progress-bar');
    const downloadBtn = card.querySelector('.download-btn');

    let currentAngle = 0;
    let animationId = null;
    let lastTimestamp = 0;
    const DEG_PER_SECOND = 90; // Ajusta velocidad (grados/segundo)

    function applyRotation() {
      img.style.transform = `rotate(${currentAngle}deg)`;
    }

    function rotateAnimation(timestamp) {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        animationId = requestAnimationFrame(rotateAnimation);
        return;
      }
      const delta = Math.min(100, timestamp - lastTimestamp);
      const deltaDeg = (DEG_PER_SECOND * delta) / 1000;
      currentAngle += deltaDeg;
      // Sin normalización → sin saltos
      applyRotation();
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(rotateAnimation);
    }

    function startSpin() {
      if (animationId !== null) return;
      lastTimestamp = 0;
      animationId = requestAnimationFrame(rotateAnimation);
    }

    function stopSpin() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      // Mantiene currentAngle
    }

    function resetSpin() {
      stopSpin();
      currentAngle = 0;
      applyRotation();
    }

    function updatePlayButtons() {
  // Selecciona el elemento <i> dentro de cada botón
  const overlayIcon = playOverlay.querySelector('i');
  const bottomIcon = playBottom.querySelector('i');

  if (audio.paused) {
    // Modo pausado → mostrar play_arrow
    overlayIcon.textContent = 'play_arrow';
    bottomIcon.textContent = 'play_arrow';
  } else {
    // Modo reproduciendo → mostrar pause
    overlayIcon.textContent = 'pause';
    bottomIcon.textContent = 'pause';
  }
}

    function togglePlay() {
      if (audio.paused) {
        audio.play().catch(e => console.error('Error:', e));
        startSpin();
      } else {
        audio.pause();
        stopSpin();
      }
      updatePlayButtons();
    }

    playOverlay.addEventListener('click', togglePlay);
    playBottom.addEventListener('click', togglePlay);

    audio.addEventListener('ended', () => {
      audio.pause();
      audio.currentTime = 0;
      progress.value = 0;
      updatePlayButtons();
      resetSpin();
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.paused && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent;
      }
    });

    progress.addEventListener('input', () => {
      if (audio.duration) {
        const time = (progress.value / 100) * audio.duration;
        audio.currentTime = time;
      }
    });

    downloadBtn.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = audio.src;
      a.download = '';
      a.click();
    });

    // Inicializar
    updatePlayButtons();
    progress.value = 0;
    applyRotation();
  });
});