document.addEventListener('DOMContentLoaded', () => {
  fetch('components/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
      const navbarScript = document.createElement('script');
      navbarScript.src = 'components/navbar.js';
      document.body.appendChild(navbarScript);
    });
});