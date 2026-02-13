const buttons = document.querySelectorAll(".filter-buttons button");
const items = document.querySelectorAll(".gallery .item");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    items.forEach(item => {
      item.style.display = (filter === "all" || item.classList.contains(filter)) ? "block" : "none";
    });
  });
});


function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 181, 51, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(o => {
        const dx = p.x - o.x, dy = p.y - o.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245, 181, 51, ${0.1 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(o.x, o.y);
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// 🔹 إدارة الروابط النشطة في النافبار
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav a');

  function setActiveLink(linkElement) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (linkElement) {
      linkElement.classList.add('active');
      const linkHref = linkElement.getAttribute('href');
      if (linkHref) localStorage.setItem('activeNavLink', linkHref);
    }
  }

  function determineActiveLink() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('page2.html')) {
      const savedActiveLink = localStorage.getItem('activeNavLink');
      if (savedActiveLink && savedActiveLink.includes('page2.html')) {
        const savedLink = document.querySelector(`.nav a[href*="page2.html"]`);
        if (savedLink) {
          setActiveLink(savedLink);
          return;
        }
      }
      const galleryLink = document.querySelector('.nav a[href*="page2.html"]');
      if (galleryLink) setActiveLink(galleryLink);
    }
  }

  determineActiveLink();

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      setActiveLink(this);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initNavigation();

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const btn = document.querySelector(`.filter-buttons button[data-filter="${hash}"]`);
    if (btn) btn.click();
  }
});
