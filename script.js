// Canvas for hearts animation
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];
const maxHearts = 100; // Limit the number of hearts for performance

function createHeart() {
  if (hearts.length < maxHearts) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 10 + 10,
      speed: Math.random() * 2 + 1,
      opacity: Math.random(),
      drift: Math.random() * 2 - 1
    });
  }
}

function drawHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach((heart, i) => {
    ctx.fillStyle = `rgba(255, 0, 150, ${heart.opacity})`;
    ctx.beginPath();
    ctx.moveTo(heart.x, heart.y);
    ctx.bezierCurveTo(
      heart.x + heart.size / 2,
      heart.y - heart.size / 2,
      heart.x + heart.size,
      heart.y + heart.size / 2,
      heart.x,
      heart.y + heart.size
    );
    ctx.bezierCurveTo(
      heart.x - heart.size,
      heart.y + heart.size / 2,
      heart.x - heart.size / 2,
      heart.y - heart.size / 2,
      heart.x,
      heart.y
    );
    ctx.closePath();
    ctx.fill();

    // Update heart position
    heart.y -= heart.speed;
    heart.x += heart.drift;
    heart.opacity -= 0.005;

    // Remove hearts that are no longer visible
    if (heart.opacity <= 0) hearts.splice(i, 1);
  });
}

function animateHearts() {
  drawHearts();
  if (Math.random() < 0.05) createHeart();
  requestAnimationFrame(animateHearts);
}

animateHearts();

// Resize canvas on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Navigation Smooth Scrolling
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    // Remove active class from all links
    navLinks.forEach(nav => nav.classList.remove('active'));
    // Add active class to the clicked link
    this.classList.add('active');

    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    // Scroll to the target section
    window.scrollTo({
      top: targetSection.offsetTop - 80,
      behavior: 'smooth'
    });

    // Hide mobile menu if open
    if (window.innerWidth <= 768) {
      document.querySelector('nav#navbar ul').classList.remove('show');
    }
  });
});

// Highlight Active Section on Scroll
window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});

// Responsive Navigation Toggle (Optional)
const navbar = document.getElementById('navbar');
const navUl = navbar.querySelector('ul');

const toggleNav = () => {
  navUl.classList.toggle('show');
};

navbar.addEventListener('click', (e) => {
  if (e.target.tagName === 'NAV' || e.target.tagName === 'UL') {
    toggleNav();
  }
});
