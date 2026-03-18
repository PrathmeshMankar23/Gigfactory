/* ===== RANDOM WORD HIGHLIGHT ===== */
const words = document.querySelectorAll("#wordGrid span");

function highlightRandomWords() {
  if (!words.length) return;

  words.forEach(word => word.classList.remove("active"));

  let selected = new Set();
  while (selected.size < Math.min(5, words.length)) {
    let rand = Math.floor(Math.random() * words.length);
    selected.add(rand);
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


// ===== CONTACT MODAL =====
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