/* Gate motion before first paint; bail on reduced-motion so content stays visible */
(() => {
  var r = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!r) document.documentElement.classList.add("gsap-on");
  window.setTimeout(function () {
    if (typeof window.gsap === "undefined") document.documentElement.classList.remove("gsap-on");
  }, 1200);
})();
