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
  // Use click instead of hover for better mobile compatibility
  message.addEventListener('click', () => {
    const hidden = message.querySelector('.hidden');
    if (hidden.style.display === 'block') {
      hidden.style.display = 'none';
    } else {
      hidden.style.display = 'block';
    }
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

surpriseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const message = button.getAttribute('data-message');
    alert(message);
  });
});

// Initialize Three.js Scene
const threeDContainer = document.getElementById('threeDContainer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, threeDContainer.clientWidth / threeDContainer.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(threeDContainer.clientWidth, threeDContainer.clientHeight);
threeDContainer.appendChild(renderer.domElement);

// Add 3D Text
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  const geometry = new THREE.TextGeometry('I love you Skye!', {
    font: font,
    size: 0.5,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.04,
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
  heartShape.bezierCurveTo(0, 0.5, 1, 1.5, 2, 0);
  heartShape.bezierCurveTo(2, -1, 1, -1.5, 0, -1);
  heartShape.bezierCurveTo(-1, -1.5, -2, -1, -2, 0);
  heartShape.bezierCurveTo(-2, 1, -1, 1.5, 0, 1);

  const heartGeometry = new THREE.ShapeGeometry(heartShape);
  const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const heart = new THREE.Mesh(heartGeometry, heartMaterial);
  heart.scale.set(0.5, 0.5, 0.5);
  heart.position.set(-1.5, -1, 0);
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

// Initialize Rules Modal on Load
document.addEventListener("DOMContentLoaded", function () {
  const rulesModal = document.getElementById("rulesModal");
  rulesModal.classList.remove("hidden");
  rulesModal.classList.add("flex");
});

// Close Rules Modal Function
function closeRulesModal() {
  const rulesModal = document.getElementById("rulesModal");
  rulesModal.classList.add("hidden");
  rulesModal.classList.remove("flex");
}

// Event Listeners for Rules Modal
const closeRulesButton = document.getElementById('closeRulesButton');
const modalClose = document.querySelector('.modal-close');

closeRulesButton.addEventListener('click', closeRulesModal);
modalClose.addEventListener('click', closeRulesModal);

// Optional: Close modal when clicking outside the modal content
const rulesModal = document.getElementById("rulesModal");
rulesModal.addEventListener('click', function(e) {
  if (e.target === rulesModal) {
    closeRulesModal();
  }
});

// Play Music Button Functionality
const playMusicButton = document.getElementById('playMusicButton');
const backgroundMusic = document.getElementById('backgroundMusic');

playMusicButton.addEventListener('click', () => {
  backgroundMusic.play()
    .then(() => {
      // Auto-play started
      playMusicButton.style.display = 'none';
    })
    .catch((error) => {
      console.error('Error playing audio:', error);
    });
});
