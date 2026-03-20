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

setInterval(highlightRandomWords, 3000);
highlightRandomWords();



/* ===== VIDEO SCROLL PROGRESS ===== */
const container = document.querySelector(".video-container");
const progress = document.querySelector(".scroll-progress");

if (container && progress) {
  container.addEventListener("scroll", () => {
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const scrolled = (container.scrollLeft / scrollWidth) * 100;
    progress.style.width = scrolled + "%";
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

        // 🔥 ONE BY ONE SMOOTH FLOW
        phases.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('show');
          }, index * 250); // faster + premium feel
        });

      }

      // 🔁 Re-trigger animation when scrolling back
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


/* ===== CONTACT MODAL ===== */
const modal = document.getElementById("contactModal");
const openBtns = document.querySelectorAll(".open-contact");
const closeBtn = document.getElementById("closeModal");
const overlay = document.querySelector(".contact-overlay");
const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

// OPEN MODAL
openBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("active");
  });
});

// CLOSE MODAL
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

overlay.addEventListener("click", () => {
  modal.classList.remove("active");
});

// FORM SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();

  successMsg.style.display = "block";
  form.reset();

  setTimeout(() => {
    successMsg.style.display = "none";
    modal.classList.remove("active");
  }, 2000);
});