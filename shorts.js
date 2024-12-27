document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('short-video');
  const useSoundButton = document.getElementById('use-sound');

  // Ensure the video plays automatically
  video.play();

  // Toggle sound on button click
  useSoundButton.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      useSoundButton.textContent = 'Mute sound';
    } else {
      video.muted = true;
      useSoundButton.textContent = 'Use sound';
    }
  });

  // Optional: Add custom play/pause controls
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
});