/* ===== HERO SLIDER ===== */
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  let slideInterval;

  console.log('Hero slider initialized');
  console.log('Slides found:', slides.length);
  console.log('Indicators found:', indicators.length);

  // Check if device is mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Get appropriate interval based on device
  function getSlideInterval() {
    return isMobile() ? 5000 : 3000; // 5 seconds on mobile, 3 seconds on desktop
  }

  function showSlide(index) {
    console.log('Showing slide:', index);
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      currentSlide = index;
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function startSlider() {
    const interval = getSlideInterval();
    console.log('Starting slider with', interval/1000, 'second intervals');
    slideInterval = setInterval(nextSlide, interval);
  }

  function stopSlider() {
    console.log('Stopping slider');
    clearInterval(slideInterval);
  }

  // Initialize slider
  if (slides.length > 0) {
    showSlide(0);
    startSlider();

    // Manual controls - both click and touch support
    indicators.forEach((indicator, index) => {
      // Mouse events
      indicator.addEventListener('click', () => {
        stopSlider();
        showSlide(index);
        startSlider();
      });
      
      // Touch events for mobile
      indicator.addEventListener('touchstart', (e) => {
        e.preventDefault();
        stopSlider();
        showSlide(index);
        startSlider();
      });
    });

    // Pause on hover - for desktop
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', stopSlider);
      hero.addEventListener('mouseleave', startSlider);
      
      // Touch events for mobile - pause on touch
      hero.addEventListener('touchstart', stopSlider);
      hero.addEventListener('touchend', () => {
        setTimeout(startSlider, 2000); // Resume after 2 seconds on mobile (longer pause)
      });
    }

    // Handle window resize to adjust timing
    window.addEventListener('resize', () => {
      stopSlider();
      startSlider();
    });
  } else {
    console.error('No slides found!');
  }
});

/* ===== RANDOM WORD HIGHLIGHT ===== */
const words = document.querySelectorAll("#wordGrid span");

function getWordGridPosition(index) {
  // Calculate row and column based on 5x5 grid (25 words total)
  const row = Math.floor(index / 5);
  const col = index % 5;
  return { row, col };
}

function highlightRandomWords() {
  if (!words.length) return;

  words.forEach(word => word.classList.remove("active"));

  let selected = new Set();
  
  // Select exactly one word from each row (0-4)
  for (let row = 0; row < 5; row++) {
    let availableCols = [];
    
    // Find all available columns that haven't been used yet
    for (let col = 0; col < 5; col++) {
      let index = row * 5 + col;
      if (!selected.has(index)) {
        // Check if this column is already used by another selected word
        let colUsed = false;
        for (let selectedIdx of selected) {
          let selectedCol = selectedIdx % 5;
          if (selectedCol === col) {
            colUsed = true;
            break;
          }
        }
        if (!colUsed) {
          availableCols.push(index);
        }
      }
    }
    
    // Randomly select one word from this row with available columns
    if (availableCols.length > 0) {
      let randomIndex = availableCols[Math.floor(Math.random() * availableCols.length)];
      selected.add(randomIndex);
    }
  }

  selected.forEach(index => {
    words[index].classList.add("active");
  });
}

// Start highlighting immediately and then every 3 seconds
setInterval(highlightRandomWords, 3000);
highlightRandomWords();

/* ===== VIDEO SCROLL PROGRESS ===== */
const container = document.querySelector(".video-container");
const progress = document.querySelector(".scroll-progress");

if (container && progress) {
  // Handle both scroll events for desktop and touch events for mobile
  container.addEventListener("scroll", () => {
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const scrolled = (container.scrollLeft / scrollWidth) * 100;
    progress.style.width = scrolled + "%";
  });
  
  // Touch support for mobile video scrolling
  let isTouching = false;
  let startX = 0;
  let scrollLeft = 0;
  
  container.addEventListener('touchstart', (e) => {
    isTouching = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  
  container.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    e.preventDefault();
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
  
  container.addEventListener('touchend', () => {
    isTouching = false;
  });
}

/* ===== TIMELINE ANIMATION ===== */
const phases = document.querySelectorAll('.phase');
const timeline = document.querySelector('.timeline');

let hasAnimated = false;

if (timeline && phases.length) {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

      if (entry.isIntersecting && !hasAnimated) {

        hasAnimated = true;

        // ONE BY ONE SMOOTH FLOW - works on mobile too
        phases.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('show');
          }, index * 250); // faster + premium feel
        });

      }

      // Re-trigger animation when scrolling back
      if (!entry.isIntersecting) {
        hasAnimated = false;
        phases.forEach(el => el.classList.remove('show'));
      }

    });
  }, {
    threshold: 0.3
  });

  observer.observe(timeline);
}

/* ===== LIFECYCLE CIRCLES CLICK FUNCTIONALITY ===== */
const phaseCircles = document.querySelectorAll('.phase-circle');

phaseCircles.forEach(circle => {
  // Mouse events for desktop
  circle.addEventListener('click', function(e) {
    e.preventDefault();
    handlePhaseClick(this);
  });
  
  // Touch events for mobile
  circle.addEventListener('touchstart', function(e) {
    e.preventDefault();
    handlePhaseClick(this);
  });
});

function handlePhaseClick(circle) {
  const phase = circle.closest('.phase');
  const allPhases = document.querySelectorAll('.phase');
  
  // Close all other phases
  allPhases.forEach(p => {
    if (p !== phase) {
      p.classList.remove('active');
    }
  });
  
  // Toggle current phase
  phase.classList.toggle('active');
}

// Close details when clicking outside - works on both desktop and mobile
document.addEventListener('click', function(e) {
  if (!e.target.closest('.phase')) {
    const allPhases = document.querySelectorAll('.phase');
    allPhases.forEach(p => p.classList.remove('active'));
  }
});

document.addEventListener('touchstart', function(e) {
  if (!e.target.closest('.phase')) {
    const allPhases = document.querySelectorAll('.phase');
    allPhases.forEach(p => p.classList.remove('active'));
  }
});

/* ===== CONTACT MODAL ===== */
const modal = document.getElementById("contactModal");
const openBtns = document.querySelectorAll(".open-contact");
const closeBtn = document.getElementById("closeModal");
const overlay = document.querySelector(".contact-overlay");
const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

// OPEN MODAL - works on both desktop and mobile
openBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("active");
    document.body.style.overflow = 'hidden'; // Prevent background scroll on mobile
  });
  
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    modal.classList.add("active");
    document.body.style.overflow = 'hidden';
  });
});

// CLOSE MODAL
function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = ''; // Restore background scroll
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Touch events for mobile
closeBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  closeModal();
});

overlay.addEventListener("touchstart", (e) => {
  e.preventDefault();
  closeModal();
});

// FORM SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();

  successMsg.style.display = "block";
  form.reset();

  setTimeout(() => {
    successMsg.style.display = "none";
    closeModal();
  }, 2000);
});

/* ===== CASE STUDIES SCROLL PROGRESS ===== */
const caseContainer = document.querySelector(".case-container");
const caseProgress = document.querySelector(".case-scroll-progress");

if (caseContainer && caseProgress) {
  // Handle both scroll events for desktop and touch events for mobile
  caseContainer.addEventListener("scroll", () => {
    const scrollWidth = caseContainer.scrollWidth - caseContainer.clientWidth;
    const scrolled = (caseContainer.scrollLeft / scrollWidth) * 100;
    caseProgress.style.width = scrolled + "%";
  });
  
  // Touch support for mobile case studies scrolling
  let isTouchingCase = false;
  let startXCase = 0;
  let scrollLeftCase = 0;
  
  caseContainer.addEventListener('touchstart', (e) => {
    isTouchingCase = true;
    startXCase = e.touches[0].pageX - caseContainer.offsetLeft;
    scrollLeftCase = caseContainer.scrollLeft;
  });
  
  caseContainer.addEventListener('touchmove', (e) => {
    if (!isTouchingCase) return;
    e.preventDefault();
    const x = e.touches[0].pageX - caseContainer.offsetLeft;
    const walk = (x - startXCase) * 2;
    caseContainer.scrollLeft = scrollLeftCase - walk;
  });
  
  caseContainer.addEventListener('touchend', () => {
    isTouchingCase = false;
  });
}

/* ===== MOBILE OPTIMIZATIONS ===== */
// Check if device is mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Adjust animations for mobile
if (isMobile()) {
  // Reduce animation intensity on mobile for better performance
  document.documentElement.style.setProperty('--animation-duration', '0.3s');
  
  // Disable some heavy effects on mobile
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .word-grid span {
        transition: all 0.2s ease !important;
      }
      .phase-circle {
        transition: all 0.2s ease !important;
      }
      .service-card {
        transition: all 0.2s ease !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // Re-initialize slider after orientation change
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
      const currentSlide = document.querySelector('.hero-slide.active');
      if (currentSlide) {
        const index = Array.from(slides).indexOf(currentSlide);
        // Force reflow to fix any layout issues
        currentSlide.style.display = 'none';
        setTimeout(() => {
          currentSlide.style.display = '';
        }, 10);
      }
    }
  }, 100);
});

document.addEventListener('DOMContentLoaded', function() {
  const openLogin = document.getElementById("openLogin");
  const loginModal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");

  console.log('Login elements found:', { openLogin, loginModal, closeLogin });

  if (openLogin && loginModal && closeLogin) {
    openLogin.addEventListener("click", (e) => {
      e.preventDefault();
      console.log('Login button clicked');
      loginModal.style.display = "flex";
    });

    closeLogin.addEventListener("click", () => {
      console.log('Close button clicked');
      loginModal.style.display = "none";
    });

    loginModal.addEventListener("click", (e) => {
      if (e.target.classList.contains("login-overlay")) {
        console.log('Overlay clicked');
        loginModal.style.display = "none";
      }
    });
  } else {
    console.log('Login elements not found');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Reduce Rework Popup
  document.querySelector(".reduce").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("reducePopup").style.display = "block";
  });

  // Accelerate Delivery Popup
  document.querySelector(".accelerate").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("acceleratePopup").style.display = "block";
  });

  // Construct Smart Popup
  document.querySelector(".construct").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("constructPopup").style.display = "block";
  });

  // Optimize Cost Popup
  document.querySelector(".optimize").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("optimizePopup").style.display = "block";
  });

  // Intelligence Popup
  document.querySelector(".intelligence").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("intelligencePopup").style.display = "block";
  });

  // Close popup functionality
  const closeButtons = [
    { id: "closeReducePopup", popup: "reducePopup" },
    { id: "closeAcceleratePopup", popup: "acceleratePopup" },
    { id: "closeConstructPopup", popup: "constructPopup" },
    { id: "closeOptimizePopup", popup: "optimizePopup" },
    { id: "closeIntelligencePopup", popup: "intelligencePopup" }
  ];

  closeButtons.forEach(({ id, popup }) => {
    const closeBtn = document.getElementById(id);
    const popupElement = document.getElementById(popup);

    if (closeBtn && popupElement) {
      closeBtn.addEventListener("click", function() {
        popupElement.style.display = "none";
      });

      // Close on overlay click
      popupElement.addEventListener("click", function(e) {
        if (e.target.classList.contains("popup-overlay")) {
          popupElement.style.display = "none";
        }
      });
    }
  });
});

document.querySelector(".construct").addEventListener("click", function(e) {
  e.preventDefault();

  document.getElementById("detail-section").classList.add("active");

  // scroll to section smoothly
  document.getElementById("detail-section").scrollIntoView({
    behavior: "smooth"
  });
});

document.querySelector(".optimize").addEventListener("click", function(e) {
  e.preventDefault();

  document.getElementById("optimize-section").classList.add("active");

  // scroll to section smoothly
  document.getElementById("optimize-section").scrollIntoView({
    behavior: "smooth"
  });
});

document.querySelector(".accelerate").addEventListener("click", function(e) {
  e.preventDefault();

  document.getElementById("delivery-section").classList.add("active");

  // scroll to section smoothly
  document.getElementById("delivery-section").scrollIntoView({
    behavior: "smooth"
  });
});

document.querySelector(".intelligence").addEventListener("click", function(e) {
  e.preventDefault();

  document.getElementById("lifecycle-section").classList.add("active");

  // scroll to section smoothly
  document.getElementById("lifecycle-section").scrollIntoView({
    behavior: "smooth"
  });
});

document.querySelector(".reduce").addEventListener("click", function(e) {
  e.preventDefault();

  // hide all sections (if you add more later)
  document.querySelectorAll(".detail-section, .info-section, .delivery-section, .lifecycle-section").forEach(sec => {
    sec.classList.remove("active");
  });

  // show this section
  document.getElementById("reduce-section").classList.add("active");

  // smooth scroll
  document.getElementById("reduce-section").scrollIntoView({
    behavior: "smooth"
  });
});

/* ===== LIFECYCLE CIRCLES INTERACTION ===== */
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const circleItems = document.querySelectorAll('.circle-item');
  const descriptionBoxes = document.querySelectorAll('.circle-description');
  
  // Add click event listeners to circles
  circleItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      e.preventDefault(); // Prevent default behavior
      
      // Remove active class from all circles
      circleItems.forEach(circle => circle.classList.remove('active'));
      // Add active class to clicked circle
      this.classList.add('active');
    });
  });

  // Add click event listeners to description boxes
  descriptionBoxes.forEach(box => {
    box.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      e.preventDefault(); // Prevent default behavior
      
      // Remove active class from all circles
      circleItems.forEach(circle => circle.classList.remove('active'));
    });
  });

  // Hide description boxes when clicking outside
  document.addEventListener('click', function(e) {
    // Check if click is outside any circle item or description box
    const clickedOutside = !e.target.closest('.circle-item') && !e.target.closest('.circle-description');
    
    if (clickedOutside) {
      circleItems.forEach(circle => circle.classList.remove('active'));
    }
  });
});