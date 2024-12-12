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

// Interactive Messages Toggle
const interactiveMessages = document.querySelectorAll('.interactive-message');

interactiveMessages.forEach(message => {
  message.addEventListener('mouseenter', () => {
    message.querySelector('.hidden').style.display = 'block';
  });
  message.addEventListener('mouseleave', () => {
    message.querySelector('.hidden').style.display = 'none';
  });
});

// Typewriter Effect
const typed = new Typed('#typewriter', {
  strings: ["To forever and ever, I love you so much. I hope you have a wonderful birthday."],
  typeSpeed: 50,
  backSpeed: 25,
  backDelay: 5000,
  startDelay: 1000,
  loop: false
});

// Surprise Buttons Functionality
const surpriseButtons = document.querySelectorAll('.surprise-button');
const surpriseMessages = [
  "I love you more than anything in the world. You mean so much to me Skye, and I will always try my hardest to be the best man I can for you and Addy.",
  "I can’t believe I get to share this life with you, and I always look forward to whatever the next adventure will bring.",
  "You are so funny, beautiful and wonderful.",
  "I love your blue eyes",
  "I love your smile",
  "I love your Sim house building skills",
  "I love your city planning abilities in Cities Skylines",
  "You may not be the best at carrying a Domino’s pizza out of the car, but that’s okay with me ❤️",
  "You have a pretty cute butt too."
];

surpriseButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    alert(surpriseMessages[index]);
  });
});

// Initialize Three.js Scene
const threeDContainer = document.getElementById('threeDContainer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, threeDContainer.clientWidth / threeDContainer.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(300, 150);
threeDContainer.appendChild(renderer.domElement);

// Add 3D Text
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  const geometry = new THREE.TextGeometry('I love you Skye!', {
    font: font,
    size: 1,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 5
  });
  const material = new THREE.MeshBasicMaterial({ color: 0xff69b4 });
  const text = new THREE.Mesh(geometry, material);
  geometry.center();
  scene.add(text);

  // Add Heart
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 0, 0, 1, 1, 1);
  heartShape.bezierCurveTo(1, 1, 2, 1, 2, 0);
  heartShape.bezierCurveTo(2, -1, 1, -2, 0, -1);
  heartShape.bezierCurveTo(-1, -2, -2, -1, -2, 0);
  heartShape.bezierCurveTo(-2, 1, -1, 1, -1, 1);
  heartShape.bezierCurveTo(-1, 1, 0, 1, 0, 0);

  const heartGeometry = new THREE.ShapeGeometry(heartShape);
  const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const heart = new THREE.Mesh(heartGeometry, heartMaterial);
  heart.scale.set(0.5, 0.5, 0.5);
  heart.position.set(-2, -1.5, 0);
  scene.add(heart);

  camera.position.z = 5;

  const animate = function () {
    requestAnimationFrame(animate);
    text.rotation.y += 0.01;
    heart.rotation.z += 0.02;
    renderer.render(scene, camera);
  };

  animate();
});

// Initialize Swiper Carousel
const swiper = new Swiper('.swiper-container', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// Initialize Lightbox
lightbox.option({
  'resizeDuration': 200,
  'wrapAround': true
});

// Countdown Timers
function updateCountdown(id, targetDate) {
  const countdownElement = document.getElementById(id);
  const countDownDate = new Date(targetDate).getTime();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance < 0) {
      clearInterval(interval);
      countdownElement.innerHTML = "Event Started!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

updateCountdown('countdown1', 'April 1, 2025 00:00:00');
updateCountdown('countdown2', 'October 18, 2024 00:00:00');

// Chart.js for Relationship Milestones
const ctxChart = document.getElementById('milestonesChart').getContext('2d');
const milestonesChart = new Chart(ctxChart, {
  type: 'bar',
  data: {
    labels: ['Adventures Together', 'Memories Captured', 'Pranks Planned', 'Laughs Shared'],
    datasets: [{
      label: 'Our Journey',
      data: [15, 30, 10, 50], // Example data
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Initialize Fireworks Animation
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fireworksCanvas.getContext('2d');

fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

let particles = [];
const maxParticles = 300;

function createFirework(x, y) {
  const particleCount = 100;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: x,
      y: y,
      speed: Math.random() * 5 + 2,
      angle: Math.random() * Math.PI * 2,
      size: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.003
    });
  }
}

function drawFireworks() {
  fwCtx.globalCompositeOperation = 'source-over';
  fwCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  fwCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fwCtx.globalCompositeOperation = 'lighter';

  particles.forEach((particle, index) => {
    fwCtx.beginPath();
    fwCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    fwCtx.fillStyle = particle.color;
    fwCtx.globalAlpha = particle.opacity;
    fwCtx.fill();

    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed;
    particle.opacity -= particle.decay;

    if (particle.opacity <= 0) {
      particles.splice(index, 1);
    }
  });

  if (Math.random() < 0.02 && particles.length < maxParticles) {
    createFirework(Math.random() * fireworksCanvas.width, Math.random() * fireworksCanvas.height / 2);
  }

  requestAnimationFrame(drawFireworks);
}

drawFireworks();

// Resize Fireworks Canvas on Window Resize
window.addEventListener('resize', () => {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
});

// Initialize Birthday Modal on Load
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("birthdayModal");
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
});

// Close Birthday Modal Function
function closeBirthdayModal() {
  const modal = document.getElementById("birthdayModal");
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}
