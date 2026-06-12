/* ---- Dynamic "today" deadline (always shows the current date) ---- */
(() => {
  var now = new Date();
  var month = now.toLocaleString("en-US", { month: "long" });
  var dayMonth = `${month} ${now.getDate()}`;
  var dayMonthYear = `${dayMonth}, ${now.getFullYear()}`;
  document.querySelectorAll(".today").forEach((el) => {
    el.textContent = dayMonth;
  });
  document.querySelectorAll(".today-y").forEach((el) => {
    el.textContent = dayMonthYear;
  });
})();

/* ---- Smooth in-page anchor scroll (JS only, accounts for sticky nav) ---- */
(() => {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.querySelector(".nav");
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    var id = a.getAttribute("href");
    if (id.length < 2) return; // skip bare "#"
    a.addEventListener("click", (e) => {
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = nav ? nav.offsetHeight : 0;
      var y = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
  });
})();

/* ---- GSAP motion suite ---- */
(() => {
  var html = document.documentElement;
  // Reduced-motion or failed CDN -> content already visible, do nothing
  if (!html.classList.contains("gsap-on") || typeof gsap === "undefined") {
    html.classList.remove("gsap-on");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var EASE = "power3.out";

  /* ---- Hero entrance ---- */
  gsap.set([".hero-eyebrow", ".hero-headline", ".hero-sub", ".sp-item", ".hero-note", ".trust-row"], { opacity: 0, y: 22 });
  gsap
    .timeline({ defaults: { ease: EASE, duration: 0.7 } })
    .to(".hero-eyebrow", { opacity: 1, y: 0 })
    .to(".hero-headline", { opacity: 1, y: 0, duration: 0.85 }, "-=0.45")
    .to(".hero-sub", { opacity: 1, y: 0 }, "-=0.55")
    .to(".sp-item", { opacity: 1, y: 0, stagger: 0.1 }, "-=0.4")
    .to([".hero-note", ".trust-row"], { opacity: 1, y: 0, stagger: 0.12 }, "-=0.35");

  /* ---- Scroll reveals (staggered as each batch enters) ---- */
  var revealSel = ".sec-label,.sec-headline,.break-box,.info-card,.info-big,.step,.testimonial,.bonus-box,.faq-item,.final-headline,.final-sub,.final-form,.final-note";
  gsap.set(revealSel, { opacity: 0, y: 26 });
  ScrollTrigger.batch(revealSel, {
    start: "top 88%",
    onEnter: (b) => {
      gsap.to(b, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: EASE, overwrite: true });
    },
  });

  /* ---- Count-up numbers ---- */
  function runCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.dataset.count),
      dec = parseInt(el.dataset.decimals || "0", 10),
      pre = el.dataset.prefix || "",
      suf = el.dataset.suffix || "",
      sep = el.dataset.sep != null,
      o = { v: 0 };
    gsap.to(o, {
      v: target,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        var n = o.v.toFixed(dec);
        if (sep) n = (+n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
        el.textContent = pre + n + suf;
      },
    });
  }
  ScrollTrigger.batch("[data-count]", {
    start: "top 92%",
    onEnter: (b) => {
      b.forEach(runCount);
    },
  });

  /* ---- Scrubbing word reveal (solution paragraph) ---- */
  var st = document.getElementById("solutionText");
  if (st) {
    var words = st.textContent.trim().split(/\s+/);
    st.innerHTML = words.map((w) => '<span class="w">' + w + "</span>").join(" ");
    gsap.set("#solutionText .w", { opacity: 0.16 });
    gsap.to("#solutionText .w", { opacity: 1, ease: "none", stagger: 0.05, scrollTrigger: { trigger: st, start: "top 78%", end: "bottom 62%", scrub: true } });
  }

  /* ---- Nav shadow on scroll ---- */
  var nav = document.querySelector(".nav");
  if (nav)
    ScrollTrigger.create({
      start: "top -8",
      end: 99999,
      onUpdate: (s) => {
        nav.classList.toggle("scrolled", s.progress > 0 || window.scrollY > 8);
      },
    });

  ScrollTrigger.refresh();
})();
