(() => {
  const DEFAULT_FORMAT = "DD/MM/YYYY";
  const DEFAULT_UNIT = "day";
  const DEFAULT_LOCALE = "en";

  let currentLocale =
    window.C_DATE_LOCALE ||
    document.documentElement.getAttribute("lang") ||
    DEFAULT_LOCALE;

  function normalizeLocale(locale) {
    return typeof locale === "string" && locale.trim() ? locale.trim() : currentLocale;
  }

  function resolveRenderOptions(rootOrOptions = document, options = {}) {
    if (
      rootOrOptions &&
      typeof rootOrOptions === "object" &&
      !("nodeType" in rootOrOptions) &&
      rootOrOptions !== document
    ) {
      return {
        root: rootOrOptions.root || document,
        locale: normalizeLocale(rootOrOptions.locale),
      };
    }

    return {
      root: rootOrOptions || document,
      locale: normalizeLocale(options.locale),
    };
  }

  function buildDayjs(el, locale) {
    const instance = dayjs();
    const elementLocale = el.getAttribute("c-date-locale");
    const nextLocale = normalizeLocale(elementLocale || locale);

    return typeof instance.locale === "function" ? instance.locale(nextLocale) : instance;
  }

  function renderCDates(rootOrOptions = document, options = {}) {
    const { root, locale } = resolveRenderOptions(rootOrOptions, options);
    const nodes = root.querySelectorAll("[c-date], [c-date-now]");

    nodes.forEach((el) => {
      let offset = 0;

      if (el.hasAttribute("c-date-now")) {
        offset = 0;
      } else if (el.hasAttribute("c-date")) {
        const raw = el.getAttribute("c-date");
        offset = raw === null || raw.trim() === "" ? 0 : Number(raw);
        if (Number.isNaN(offset)) offset = 0;
      }

      const unit = (el.getAttribute("c-date-unit") || DEFAULT_UNIT).trim();
      const format = (el.getAttribute("c-date-format") || DEFAULT_FORMAT).trim();

      el.textContent = buildDayjs(el, locale).add(offset, unit).format(format);
    });
  }

  function setCDatesLocale(locale, root = document) {
    currentLocale = normalizeLocale(locale);
    renderCDates({ root, locale: currentLocale });
  }

  function setupHeaderScrollBehavior() {
    const body = document.body;
    const header = document.getElementById("header");
    const headMenu = document.getElementById("headMenu");
    const secondaryNav = headMenu?.querySelector(".leftSecNav");

    if (!body || !header || !headMenu || !secondaryNav || typeof window.matchMedia !== "function") {
      return;
    }

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const TOP_THRESHOLD = 24;
    const MIN_DELTA = 2;
    const HIDE_DISTANCE = 24;
    const SHOW_DISTANCE = 80;
    const TOGGLE_COOLDOWN_MS = 220;

    let lastScrollY = Math.max(window.scrollY || 0, 0);
    let lastDirection = 0;
    let accumulatedDistance = 0;
    let secondaryVisible = true;
    let initialized = false;
    let toggleLockUntil = 0;
    let ticking = false;

    function resetHeaderState(scrollY) {
      body.classList.remove("scrollB", "scrollT", "header-scroll-ready");
      lastScrollY = scrollY;
      lastDirection = 0;
      accumulatedDistance = 0;
      secondaryVisible = true;
      initialized = false;
      toggleLockUntil = 0;
    }

    function setSecondaryVisible(visible, scrollY, now) {
      secondaryVisible = visible;
      body.classList.toggle("scrollT", visible);
      body.classList.toggle("scrollB", !visible);
      lastScrollY = scrollY;
      lastDirection = 0;
      accumulatedDistance = 0;
      toggleLockUntil = now + TOGGLE_COOLDOWN_MS;
    }

    function applyHeaderState(force = false) {
      const scrollY = Math.max(window.scrollY || 0, 0);
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();

      if (!desktopQuery.matches) {
        resetHeaderState(scrollY);
        return;
      }

      body.classList.add("header-scroll-ready");

      if (scrollY <= TOP_THRESHOLD) {
        setSecondaryVisible(true, scrollY, now);
        return;
      }

      if (force && !initialized) {
        setSecondaryVisible(false, scrollY, now);
        initialized = true;
        return;
      }

      initialized = true;

      if (now < toggleLockUntil) {
        lastScrollY = scrollY;
        return;
      }

      const delta = scrollY - lastScrollY;
      if (!force && Math.abs(delta) < MIN_DELTA) {
        return;
      }

      const direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;
      if (direction === 0) return;

      if (direction !== lastDirection) {
        lastDirection = direction;
        accumulatedDistance = Math.abs(delta);
      } else {
        accumulatedDistance += Math.abs(delta);
      }

      if (direction > 0 && secondaryVisible && accumulatedDistance >= HIDE_DISTANCE) {
        setSecondaryVisible(false, scrollY, now);
        return;
      }

      if (direction < 0 && !secondaryVisible && accumulatedDistance >= SHOW_DISTANCE) {
        setSecondaryVisible(true, scrollY, now);
        return;
      }

      lastScrollY = scrollY;
    }

    function onScroll() {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        applyHeaderState();
        ticking = false;
      });
    }

    applyHeaderState(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => applyHeaderState(true));

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", () => applyHeaderState(true));
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(() => applyHeaderState(true));
    }
  }

  renderCDates();
  setupHeaderScrollBehavior();
  window.setCDatesLocale = setCDatesLocale;
  window.renderCDates = renderCDates;
})();
