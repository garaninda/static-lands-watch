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
  function scrollToTarget(selector) {
    var target = document.querySelector(selector);
    if (!target) return false;
    var navH = nav ? nav.offsetHeight : 0;
    var y = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    return true;
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    var id = a.getAttribute("href");
    if (id.length < 2) return; // skip bare "#"
    a.addEventListener("click", (e) => {
      if (scrollToTarget(id)) e.preventDefault();
    });
  });
  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (scrollToTarget(button.dataset.scrollTarget)) e.preventDefault();
    });
  });
})();

/* ---- FAQ accordion (single-open, progressive enhancement) ---- */
(() => {
  var items = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
  if (!items.length) return;

  items.forEach((item, i) => {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;

    // wrap the answer so we can animate it to its natural height
    var wrap = document.createElement("div");
    wrap.className = "faq-a-wrap";
    a.parentNode.insertBefore(wrap, a);
    wrap.appendChild(a);
    var aId = `faq-a-${i}`;
    a.id = aId;

    // turn the question into an accessible toggle
    q.setAttribute("role", "button");
    q.setAttribute("tabindex", "0");
    q.setAttribute("aria-expanded", "false");
    q.setAttribute("aria-controls", aId);

    var icon = document.createElement("span");
    icon.className = "faq-icon";
    icon.setAttribute("aria-hidden", "true");
    q.appendChild(icon);

    q.addEventListener("click", () => toggle(item));
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggle(item);
      }
    });
  });

  function toggle(item) {
    var willOpen = !item.classList.contains("open");
    var q;
    items.forEach((it) => {
      it.classList.remove("open");
      var qq = it.querySelector(".faq-q");
      if (qq) qq.setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      item.classList.add("open");
      q = item.querySelector(".faq-q");
      if (q) q.setAttribute("aria-expanded", "true");
    }
  }

  // open the first item by default as an interactivity hint
  toggle(items[0]);
})();

/* ---- GSAP motion suite ---- */
(() => {
  var html = document.documentElement;
  // Reduced-motion or failed CDN -> content already visible, do nothing
  if (!html.classList.contains("gsap-on") || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    html.classList.remove("gsap-on");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var EASE = "power3.out";

  /* ---- Hero entrance ---- */
  gsap.set([".hero-eyebrow", ".hero-headline", ".hero-sub", ".hero-cta", ".sp-item", ".hero-note", ".trust-row"], { opacity: 0, y: 22 });
  gsap.set(".hero-visual", { opacity: 0, y: 24, transformOrigin: "50% 100%" });
  gsap
    .timeline({ defaults: { ease: EASE, duration: 0.7 } })
    .to(".hero-visual", { opacity: 1, scale: 1, duration: 1 }, 0)
    .to(".hero-eyebrow", { opacity: 1, y: 0 }, 0.1)
    .to(".hero-headline", { opacity: 1, y: 0, duration: 0.85 }, "-=0.45")
    .to(".hero-sub", { opacity: 1, y: 0 }, "-=0.55")
    .to(".hero-cta", { opacity: 1, y: 0 }, "-=0.45")
    .to(".sp-item", { opacity: 1, y: 0, stagger: 0.1 }, "-=0.35")
    .to([".hero-note", ".trust-row"], { opacity: 1, y: 0, stagger: 0.12 }, "-=0.35");

  /* ---- Scroll reveals (staggered as each batch enters) ---- */
  var revealSel = ".sec-label,.sec-headline,.break-box,.info-card,.chart-card,.info-big,.step,.testimonial,.bonus-box,.faq-item,.final-headline,.final-sub,.final-form,.final-note";
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

/* ---- Cost-of-living line charts (self-contained: builds SVG + draws on scroll) ---- */
(() => {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".chart-card[data-chart]"));
  if (!cards.length) return;
  var SVGNS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // viewBox geometry
  var W = 320,
    H = 188,
    padL = 12,
    padR = 14,
    padT = 26,
    padB = 24;
  var plotW = W - padL - padR,
    plotH = H - padT - padB;

  function el(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  // Catmull-Rom -> cubic Bézier for a smooth, hand-drawn-looking line
  function smoothPath(pts) {
    if (pts.length < 3) return pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6,
        c1y = p1[1] + (p2[1] - p0[1]) / 6,
        c2x = p2[0] - (p3[0] - p1[0]) / 6,
        c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + "," + c2x.toFixed(1) + " " + c2y.toFixed(1) + "," + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }

  function build(card) {
    var vals = card.dataset.values.split(",").map(Number);
    var years = (card.dataset.years || "").split(",");
    var plot = card.querySelector(".chart-plot");
    var title = (card.querySelector(".chart-title") || {}).textContent || "Trend";
    var max = Math.max.apply(null, vals) || 1;
    var top = max * 1.18; // headroom for value labels
    var n = vals.length;
    var X = (i) => padL + (n > 1 ? (plotW * i) / (n - 1) : 0);
    var Y = (v) => padT + plotH * (1 - v / top);
    var pts = vals.map((v, i) => [X(i), Y(v)]);

    var svg = el("svg", {
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label": title + " rose from 0% in " + years[0] + " to +" + max + "% in " + years[years.length - 1] + ".",
    });

    // horizontal gridlines
    for (var g = 0; g <= 2; g++) {
      var gy = padT + (plotH * g) / 2;
      svg.appendChild(el("line", { class: "cl-grid", x1: padL, y1: gy, x2: W - padR, y2: gy }));
    }

    // area fill
    var areaD = smoothPath(pts) + " L" + pts[n - 1][0].toFixed(1) + " " + (padT + plotH) + " L" + pts[0][0].toFixed(1) + " " + (padT + plotH) + " Z";
    var area = el("path", { class: "cl-area", d: areaD });
    svg.appendChild(area);

    // the line
    var line = el("path", { class: "cl-line", d: smoothPath(pts) });
    svg.appendChild(line);

    // x-axis year labels
    years.forEach((yr, i) => {
      var t = el("text", { class: "cl-xlabel", x: X(i), y: H - 8 });
      t.textContent = yr;
      svg.appendChild(t);
    });

    // value labels (cumulative %) above each point
    var vlabels = vals.map((v, i) => {
      var t = el("text", { class: "cl-vlabel", x: X(i), y: Y(v) - 8 });
      t.textContent = (v > 0 ? "+" : "") + v;
      svg.appendChild(t);
      return t;
    });

    // dots (last one is the emphasized end marker)
    var dots = pts.map((p, i) => {
      var c = el("circle", { class: "cl-dot" + (i === n - 1 ? " cl-end" : ""), cx: p[0], cy: p[1], r: i === n - 1 ? 4 : 3 });
      var tt = el("title", {});
      tt.textContent = years[i] + ": +" + vals[i] + "%";
      c.appendChild(tt);
      svg.appendChild(c);
      return c;
    });

    plot.appendChild(svg);
    return { line: line, area: area, dots: dots, vlabels: vlabels };
  }

  function setNum(numEl, v) {
    var dec = parseInt(numEl.dataset.dec || "0", 10);
    numEl.textContent = (numEl.dataset.pre || "") + v.toFixed(dec) + (numEl.dataset.suf || "");
  }

  function draw(card, parts) {
    if (card.dataset.drawn) return;
    card.dataset.drawn = "1";
    var line = parts.line,
      area = parts.area,
      dots = parts.dots,
      vlabels = parts.vlabels;
    var numEl = card.querySelector(".chart-num");
    var target = numEl ? parseFloat(numEl.dataset.val) : 0;
    var len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;

    if (reduce) {
      line.style.strokeDashoffset = 0;
      area.style.opacity = 1;
      dots.forEach((d) => d.classList.add("on"));
      vlabels.forEach((t) => t.classList.add("on"));
      if (numEl) setNum(numEl, target);
      return;
    }

    var dur = 1500,
      start = null,
      shown = 0;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      line.style.strokeDashoffset = len * (1 - e);
      area.style.opacity = e;
      if (numEl) setNum(numEl, target * e);
      // reveal dots + value labels progressively as the line reaches them
      var reach = Math.floor(e * dots.length + 0.001);
      while (shown < reach && shown < dots.length) {
        dots[shown].classList.add("on");
        vlabels[shown].classList.add("on");
        shown++;
      }
      if (p < 1) requestAnimationFrame(frame);
      else {
        dots.forEach((d) => d.classList.add("on"));
        vlabels.forEach((tt) => tt.classList.add("on"));
        if (numEl) setNum(numEl, target);
      }
    }
    requestAnimationFrame(frame);
  }

  var built = cards.map((card) => ({ card: card, parts: build(card) }));

  if (!("IntersectionObserver" in window)) {
    built.forEach((b) => draw(b.card, b.parts));
    return;
  }
  var io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          var rec = built.find((b) => b.card === en.target);
          if (rec) draw(rec.card, rec.parts);
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.35 }
  );
  built.forEach((b) => io.observe(b.card));
})();
