var gallerySwiper = new Swiper(".gallerySwiper", {
  slidesPerView: 1,
  spaceBetween: 25,
  loop: true,
  autoplay: { 
    delay: 3000, 
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  navigation: { 
    nextEl: ".swiper-button-next", 
    prevEl: ".swiper-button-prev" 
  },
  breakpoints: { 
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1080: { slidesPerView: 3 }
  }
});

const pureImageSlider = new Swiper('.pureImages', {
  slidesPerView: 1,
  loop: true,
  speed: 900,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  pagination: {
    el: '.pureImages .swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.pureImages .swiper-button-next',
    prevEl: '.pureImages .swiper-button-prev'
  }
});

const openVimeo = document.getElementById('openVimeo');
const vimeoPopup = document.getElementById('vimeoPopup');
const closeVimeo = document.getElementById('closeVimeo');
const vimeoPlayer = document.getElementById('vimeoPlayer');

if (openVimeo) {
  openVimeo.addEventListener('click', () => {
    vimeoPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    vimeoPlayer.src += "&autoplay=1";
  });
}

if (closeVimeo) {
  closeVimeo.addEventListener('click', () => {
    vimeoPopup.classList.remove('active');
    document.body.style.overflow = '';
    vimeoPlayer.src = vimeoPlayer.src.replace("&autoplay=1", "");
  });

  vimeoPopup.addEventListener('click', (e) => {
    if (e.target === vimeoPopup) {
      vimeoPopup.classList.remove('active');
      document.body.style.overflow = '';
      vimeoPlayer.src = vimeoPlayer.src.replace("&autoplay=1", "");
    }
  });
}

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const count = 50;
  class Particle {
    constructor() {
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
  for (let i = 0; i < count; i++) particles.push(new Particle());
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245,181,51,${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
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

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav a');
  function setActive(el) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (el) el.classList.add('active');
  }
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    document.querySelectorAll('section[id]').forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav a[href="#${id}"]`);
        if (link) setActive(link);
      }
    });
  });
}


// Toggle individual video play/pause with sound
function toggleVideo(button) {
  const videoItem = button.closest('.video-item');
  const video = videoItem.querySelector('video');
  const icon = button.querySelector('i');
  
  if (video.paused) {
    // Pause all other videos first
    document.querySelectorAll('.video-item video').forEach(v => {
      if (v !== video) {
        v.pause();
      }
    });
    
    // Play this video with sound
    video.muted = false;
    video.volume = 1.0;
    video.play().catch(e => {});
    
    // Update button icon
    icon.className = 'bi bi-pause-fill';
    button.classList.add('playing');
    
    // Update all other buttons
    document.querySelectorAll('.video-play-btn').forEach(btn => {
      if (btn !== button) {
        btn.querySelector('i').className = 'bi bi-play-fill';
        btn.classList.remove('playing');
      }
    });
  } else {
    // Pause this video
    video.pause();
    icon.className = 'bi bi-play-fill';
    button.classList.remove('playing');
  }
}

// Video Showcase Slider logic (Advanced 3D Carousel)
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.video-item');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentIndex = 1;

  function updateCarousel() {
    items.forEach((item, index) => {
      item.className = 'video-item'; // Reset classes
      const video = item.querySelector('video');
      const playBtn = item.querySelector('.video-play-btn');
      
      // Pause video and reset button
      video.pause();
      if (playBtn) {
        playBtn.querySelector('i').className = 'bi bi-play-fill';
        playBtn.classList.remove('playing');
      }

      if (index === currentIndex) {
        item.classList.add('active');
        // Auto-play active video with sound
        video.muted = false;
        video.volume = 1.0;
        video.play().catch(e => {});
        if (playBtn) {
          playBtn.querySelector('i').className = 'bi bi-pause-fill';
          playBtn.classList.add('playing');
        }
      } else if (index === (currentIndex - 1 + items.length) % items.length) {
        item.classList.add('prev');
      } else if (index === (currentIndex + 1) % items.length) {
        item.classList.add('next');
      } else if (index < currentIndex) {
        item.classList.add('hidden-left');
      } else {
        item.classList.add('hidden-right');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index !== currentIndex) {
        currentIndex = index;
        updateCarousel();
      }
    });
  });

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Swipe Support
  let touchStartX = 0;
  const container = document.querySelector('.video-carousel');
  if (container) {
    container.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
    container.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) nextSlide();
      if (touchEndX - touchStartX > 50) prevSlide();
    });
  }

  // Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (video) {
        if (entry.isIntersecting && entry.target.classList.contains('active')) {
          video.play().catch(e => {});
        } else {
          video.pause();
        }
      }
    });
  }, { threshold: 0.5 });

  items.forEach(item => observer.observe(item));

  updateCarousel();
});

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
});
