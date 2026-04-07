const REVEAL_SELECTORS = [
  ".hero-highlights",
  ".urgency-note",
  ".features h2",
  ".feature-card",
  ".testimonials h2",
  ".testimonial-card",
  ".trading-demo h2",
  ".section-glass-note",
  ".stat-item",
  ".trading-feature",
  ".trading-demo-visual",
  ".investment-options h2",
  ".option-card",
  ".how-to-start h2",
  ".highlight-card",
  ".step-item",
  ".steps-visual",
  ".security-withdrawal h2",
  ".security-card",
  ".guarantee-content",
  ".guarantee-visual",
  ".withdrawal-step",
  ".stats-showcase",
  ".regulatory h2",
  ".regulatory-card",
  ".regulatory-info",
  ".certificate-frame",
];

function animateCounter(element, duration = 1600) {
  const target = Number(element.dataset.target || 0);

  if (!target || element.dataset.animated === "true") {
    return;
  }

  element.dataset.animated = "true";

  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    element.textContent = Math.floor(progress * target).toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target.toString();
    }
  };

  requestAnimationFrame(step);
}

function initRevealAnimations() {
  const revealElements = REVEAL_SELECTORS.flatMap((selector) => [...document.querySelectorAll(selector)]);

  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 80}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function initCounters() {
  const counters = [...document.querySelectorAll(".counter")];

  if (!counters.length) {
    return;
  }

  const counterSection = document.querySelector(".trading-stats");

  if (!counterSection) {
    counters.forEach((counter) => animateCounter(counter));
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        counters.forEach((counter, index) => {
          setTimeout(() => animateCounter(counter), index * 120);
        });

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
    }
  );

  counterObserver.observe(counterSection);
}

function initProgressAnimation() {
  const progressBlock = document.querySelector(".steps-progress");

  if (!progressBlock) {
    return;
  }

  const dots = [...progressBlock.querySelectorAll(".progress-dot")];

  const progressObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        progressBlock.classList.add("visible");

        dots.forEach((dot) => {
          dot.classList.remove("active");
          dot.classList.remove("is-active");
        });

        dots.forEach((dot, index) => {
          setTimeout(() => {
            dot.classList.add("is-active");
          }, 220 * (index + 1));
        });

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.4,
    }
  );

  progressObserver.observe(progressBlock);
}

function initConfidenceBars() {
  const bars = [...document.querySelectorAll(".confidence-bar")];

  if (!bars.length) {
    return;
  }

  bars.forEach((bar) => {
    const targetWidth = bar.dataset.targetWidth || bar.style.width || "0%";
    bar.style.setProperty("--target-width", targetWidth);
    bar.style.width = "0%";
  });

  const barObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-animated");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.5,
    }
  );

  bars.forEach((bar) => barObserver.observe(bar));
}

function initHeaderState() {
  const header = document.querySelector("header");

  if (!header) {
    return;
  }

  const toggleHeaderState = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  toggleHeaderState();
  window.addEventListener("scroll", toggleHeaderState, { passive: true });
}

function initScrollButtons() {
  const formAnchor = document.getElementById("regFormDiv");
  const floatingButton = document.querySelector(".scroll-to-form");

  if (!formAnchor) {
    return;
  }

  const scrollToForm = (event) => {
    event.preventDefault();
    formAnchor.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  document.querySelectorAll(".to-form, .scroll-to-form").forEach((button) => {
    button.addEventListener("click", scrollToForm);
  });

  if (!floatingButton) {
    return;
  }

  const toggleScrollButton = () => {
    floatingButton.classList.toggle("visible", window.scrollY > 500);
  };

  toggleScrollButton();
  window.addEventListener("scroll", toggleScrollButton, { passive: true });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);

    element.textContent = element.id === "minutes" ? formatTime(value) : value;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

function initUrgencyWidgets() {
  const minutesElement = document.getElementById("minutes");
  const spotsElement = document.getElementById("spots");

  if (!minutesElement || !spotsElement) {
    return;
  }

  const initialMinutes = 16 * 60 + 43;
  const initialSpots = 193;

  minutesElement.textContent = formatTime(initialMinutes);
  spotsElement.textContent = initialSpots;

  let remainingSeconds = Number(minutesElement.dataset.seconds || initialMinutes);
  let currentSpots = initialSpots;

  window.setInterval(() => {
    remainingSeconds -= 1;

    if (remainingSeconds >= 0) {
      minutesElement.style.transform = "scale(1.1)";
      minutesElement.textContent = formatTime(remainingSeconds);
      minutesElement.dataset.seconds = remainingSeconds;

      window.setTimeout(() => {
        minutesElement.style.transform = "scale(1)";
      }, 100);

      return;
    }

    minutesElement.textContent = "0:00";
    minutesElement.style.backgroundColor = "#ff4444";
  }, 1000);

  window.setInterval(() => {
    if (currentSpots <= 0) {
      return;
    }

    const decrease = Math.floor(Math.random() * 3) + 1;
    const nextSpots = Math.max(currentSpots - decrease, 0);

    animateValue(spotsElement, currentSpots, nextSpots, 500);

    spotsElement.style.transform = "scale(1.1)";
    window.setTimeout(() => {
      spotsElement.style.transform = "scale(1)";
    }, 100);

    currentSpots = nextSpots;

    if (currentSpots === 0) {
      spotsElement.style.backgroundColor = "#ff4444";
    }
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enhanced");

  initHeaderState();
  initScrollButtons();
  initRevealAnimations();
  initCounters();
  initProgressAnimation();
  initConfidenceBars();
  initUrgencyWidgets();
});
