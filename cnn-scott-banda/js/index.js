(() => {
  const DESKTOP_BREAKPOINT = 960;
  const EXTRA_LARGE_BREAKPOINT = 1280;

  const scrollToElementWithHeaderOffset = (element, offset = 12) => {
    if (!element) {
      return;
    }

    const header = document.getElementById("pageHeader");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top = window.scrollY + element.getBoundingClientRect().top - headerHeight - offset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  };

  const pickFirstVisible = (elements) => {
    const list = elements.filter(Boolean);
    return list.find((item) => item.offsetParent !== null) || list[0] || null;
  };

  const calculateNavLeftMaxWidth = (header) => {
    const container = header.querySelector(".header__container");
    const right = header.querySelector(".header__right");

    if (!container || !right) {
      return 0;
    }

    const containerWidth = container.getBoundingClientRect().width;
    const containerStyles = window.getComputedStyle(container);
    const containerPaddingLeft = parseFloat(containerStyles.paddingLeft || "0");
    const containerPaddingRight = parseFloat(containerStyles.paddingRight || "0");
    const isArabicPage = document.documentElement.getAttribute("dir") === "rtl" || document.body?.getAttribute("dir") === "rtl";
    const menuIconWidth = header.querySelector(".header__menu-icon")?.getBoundingClientRect().width || 0;
    const brandLogoWidth = isArabicPage ? 0 : header.querySelector(".brand-logo")?.getBoundingClientRect().width || 0;

    return containerWidth - (containerPaddingLeft + containerPaddingRight) - right.getBoundingClientRect().width - menuIconWidth - brandLogoWidth;
  };

  const initializeResponsiveHeaderNav = (header) => {
    const nav = header.querySelector(".header__nav");
    const navContainer = header.querySelector(".header__left .header__nav-container");
    const navMore = header.querySelector(".header__nav-more");
    const navMoreDropdown = header.querySelector(".header__nav-more > .header__nav-item-dropdown");
    const headerRight = header.querySelector(".header__right");

    if (!nav || !navContainer || !navMore || !navMoreDropdown || !headerRight) {
      return;
    }

    const show = (element) => {
      element.style.display = "block";
    };

    const hide = (element) => {
      element.style.display = "none";
    };

    const measureLeftWidth = () => header.querySelector(".header__left")?.getBoundingClientRect().width || 0;

    const hideNavItemsFromRight = (count) => {
      const startIndex = navContainer.childElementCount - count;
      navContainer.querySelectorAll(`.header__nav-item:nth-child(n+${startIndex})`).forEach(hide);
    };

    const updateDesktopNav = () => {
      if (header.getBoundingClientRect().width < DESKTOP_BREAKPOINT) {
        nav.style.visibility = "visible";
        headerRight.style.visibility = "visible";
        return;
      }

      if (window.location.pathname.startsWith("/webview") || header.classList.contains("header_sponsorship")) {
        nav.style.visibility = "visible";
        headerRight.style.visibility = "visible";
        return;
      }

      nav.style.visibility = "hidden";

      navContainer.querySelectorAll(".header__nav-item").forEach(show);
      navMoreDropdown.querySelectorAll(".header__nav-item-dropdown-item").forEach(hide);
      hide(navMore);

      const navLeftMaxWidth = calculateNavLeftMaxWidth(header);
      let navLeftWidth = measureLeftWidth();
      let hasHiddenItems = false;
      let hiddenItemsCount = 1;

      while (navLeftWidth > navLeftMaxWidth && hiddenItemsCount <= navContainer.childElementCount + 1) {
        hasHiddenItems = true;
        hideNavItemsFromRight(hiddenItemsCount);
        navLeftWidth = measureLeftWidth();
        hiddenItemsCount += 1;
      }

      if (hasHiddenItems) {
        show(navMore);
        navLeftWidth = measureLeftWidth();

        if (navLeftWidth > navLeftMaxWidth) {
          hideNavItemsFromRight(hiddenItemsCount);
          hiddenItemsCount += 1;
        }
      }

      const promotionOffset = navContainer.querySelector(".promotion-link") ? 0 : 1;
      const dropdownStart = navContainer.childElementCount - hiddenItemsCount + promotionOffset;
      navMoreDropdown.querySelectorAll(`.header__nav-item-dropdown-item:nth-child(n+${dropdownStart})`).forEach(show);

      nav.style.visibility = "visible";
      headerRight.style.visibility = "visible";
    };

    const navMoreCaret = header.querySelector(".header__nav-more--toggle-caret");
    if (navMoreCaret) {
      navMore.addEventListener("mouseover", () => {
        navMoreCaret.classList.remove("header__nav-more--toggle-caret-down");
        navMoreCaret.classList.add("header__nav-more--toggle-caret-up");
      });

      navMore.addEventListener("mouseout", () => {
        navMoreCaret.classList.remove("header__nav-more--toggle-caret-up");
        navMoreCaret.classList.add("header__nav-more--toggle-caret-down");
      });
    }

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(updateDesktopNav).observe(headerRight);
    }

    window.addEventListener("resize", updateDesktopNav);
    window.addEventListener("load", updateDesktopNav);

    if (document.fonts?.ready) {
      document.fonts.ready.then(updateDesktopNav).catch(() => {});
    }

    updateDesktopNav();
  };

  const initializeProgressBar = () => {
    const progressBar = document.querySelector(".progress-bar");
    const progressContainer = document.querySelector(".progress-container");

    if (!progressBar || !progressContainer) {
      return;
    }

    const articleMain = document.querySelector(".article__main");
    let progressStart = pickFirstVisible([
      articleMain?.querySelector('.article__content-container .action-bar[data-label-id-prefix="action-bar-start-of-article"]'),
      document.querySelector('.layout-article-elevate__left .action-bar[data-label-id-prefix="action-bar-start-of-article"]'),
      document.querySelector('.action-bar[data-label-id-prefix="action-bar-start-of-article"]'),
    ]);
    let progressEnd = pickFirstVisible([
      articleMain?.querySelector('.action-bar[data-label-id-prefix="action-bar-end-of-article"]'),
      document.querySelector('.action-bar[data-label-id-prefix="action-bar-end-of-article"]'),
    ]);

    if (!progressStart || !progressEnd) {
      const markers = document.querySelectorAll(".action-bar, .gallery-inline_unfurled__divider");
      if (markers.length >= 2) {
        progressStart = markers[0];
        progressEnd = markers[1];
      }
    }

    if (!progressStart || !progressEnd) {
      return;
    }

    const renderProgress = () => {
      progressStart = pickFirstVisible([
        articleMain?.querySelector('.article__content-container .action-bar[data-label-id-prefix="action-bar-start-of-article"]'),
        document.querySelector('.layout-article-elevate__left .action-bar[data-label-id-prefix="action-bar-start-of-article"]'),
        document.querySelector('.action-bar[data-label-id-prefix="action-bar-start-of-article"]'),
      ]);
      progressEnd = pickFirstVisible([
        articleMain?.querySelector('.action-bar[data-label-id-prefix="action-bar-end-of-article"]'),
        document.querySelector('.action-bar[data-label-id-prefix="action-bar-end-of-article"]'),
      ]);

      if (!progressStart || !progressEnd) {
        progressBar.style.width = "0%";
        return;
      }

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
      const midpoint = scrollTop + 0.5 * window.innerHeight;
      const startTop = window.scrollY + progressStart.getBoundingClientRect().top;
      const endTop = window.scrollY + progressEnd.getBoundingClientRect().top;

      progressContainer.classList.toggle("scrolled", scrollTop > 1);

      if (midpoint <= startTop) {
        progressBar.style.width = "0%";
        return;
      }

      if (midpoint >= endTop) {
        progressBar.style.width = "100%";
        return;
      }

      if (endTop <= startTop) {
        progressBar.style.width = "0%";
        return;
      }

      const progress = ((midpoint - startTop) / (endTop - startTop)) * 100;
      progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    };

    window.addEventListener("scroll", renderProgress, { passive: true });
    window.addEventListener("resize", renderProgress);
    window.addEventListener("load", renderProgress);
    renderProgress();
  };

  const initializeAdaptiveStartActionBars = () => {
    const leftStartActionBar = document.querySelector('.layout-article-elevate__left .action-bar[data-label-id-prefix="action-bar-start-of-article"]');
    const contentStartActionBar = document.querySelector('.article__content-container > .action-bar[data-label-id-prefix="action-bar-start-of-article"]');

    if (!leftStartActionBar || !contentStartActionBar) {
      return;
    }

    const syncStartActionBars = () => {
      const showLeftBar = window.innerWidth >= EXTRA_LARGE_BREAKPOINT;
      leftStartActionBar.style.display = showLeftBar ? "" : "none";
      contentStartActionBar.style.display = showLeftBar ? "none" : "";
    };

    window.addEventListener("resize", syncStartActionBars);
    window.addEventListener("load", syncStartActionBars);
    syncStartActionBars();
  };

  const initializeTimestampExpand = () => {
    document.querySelectorAll(".headline__byline-sub-text .vossi-timestamp_elevate").forEach((timestamp) => {
      const expandBtn = timestamp.querySelector(".vossi-timestamp_elevate__expand-btn");
      const details = timestamp.querySelector(".vossi-timestamp_elevate__details");
      const container = timestamp.querySelector(".vossi-timestamp_elevate__container");
      const timeSince = timestamp.querySelector(".vossi-timestamp_elevate__time-since");
      const activeTimeSince = timestamp.querySelector(".vossi-timestamp_elevate__time-since--active");

      if (!expandBtn || !details || !container) {
        return;
      }

      expandBtn.setAttribute("role", "button");
      expandBtn.setAttribute("tabindex", "0");
      expandBtn.setAttribute("aria-label", "Expand timestamp details");
      expandBtn.setAttribute("aria-expanded", "false");

      const expand = () => {
        timestamp.classList.add("vossi-timestamp_elevate--expanded");
        details.classList.add("vossi-timestamp_elevate__details--expanded");
        expandBtn.classList.add("vossi-timestamp_elevate__expand-btn--expanded");
        container.classList.add("vossi-timestamp_elevate__container--expanded");
        timeSince?.classList.add("vossi-timestamp_elevate__time-since--expanded");
        activeTimeSince?.classList.add("vossi-timestamp_elevate__time-since--expanded");
        expandBtn.setAttribute("aria-expanded", "true");
      };

      expandBtn.addEventListener("click", expand, { once: true });
      expandBtn.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            expand();
          }
        },
        { once: true },
      );
    });
  };

  const initializeSmoothScrollToForm = () => {
    const form = document.getElementById("form");
    if (!form) {
      return;
    }

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const trigger = target.closest(".scroll-to-form");
      if (!trigger) {
        return;
      }

      event.preventDefault();
      scrollToElementWithHeaderOffset(form);
    });
  };

  const initializeSocialShareBehavior = () => {
    const form = document.getElementById("form");

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const shareItem = target.closest(".vossi-social-share_labelled-list__share, .social-share_labelled-list__share");
      if (!shareItem) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const actionBar = shareItem.closest('.action-bar[data-label-id-prefix]');
      const isEndShare = actionBar?.getAttribute("data-label-id-prefix") === "action-bar-end-of-article";

      if (isEndShare && form) {
        scrollToElementWithHeaderOffset(form);
      }
    });
  };

  const initializeHeaderFooterExternalLinksBlock = () => {
    const isExternalLink = (link) => {
      const rawHref = link.getAttribute("href");
      if (!rawHref) {
        return false;
      }

      const href = rawHref.trim();
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
        return false;
      }

      try {
        const url = new URL(href, window.location.origin);
        return url.origin !== window.location.origin;
      } catch {
        return false;
      }
    };

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("header a[href], footer a[href], .header a[href], .footer a[href]");
      if (!link || !(link instanceof HTMLAnchorElement)) {
        return;
      }

      if (!isExternalLink(link)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    });
  };

  const init = () => {
    const header = document.getElementById("pageHeader");
    if (header) {
      initializeResponsiveHeaderNav(header);
    }
    initializeAdaptiveStartActionBars();
    initializeProgressBar();
    initializeTimestampExpand();
    initializeSmoothScrollToForm();
    initializeSocialShareBehavior();
    initializeHeaderFooterExternalLinksBlock();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

(() => {
  const DEFAULT_FORMAT = "DD/MM/YYYY";
  const DEFAULT_UNIT = "day";
  const MAX_DAYJS_WAIT_ATTEMPTS = 50;
  const DAYJS_WAIT_DELAY_MS = 100;

  function getDayjs() {
    return typeof window.dayjs === "function" ? window.dayjs : null;
  }

  function renderCDates(root = document) {
    const dayjsRef = getDayjs();
    if (!dayjsRef || !root) {
      return false;
    }

    let nodes = [];
    if (root.nodeType === Node.ELEMENT_NODE) {
      const rootElement = root;
      if (rootElement.matches("[c-date], [c-date-now]")) {
        nodes.push(rootElement);
      }
      nodes = nodes.concat(Array.from(rootElement.querySelectorAll("[c-date], [c-date-now]")));
    } else if (typeof root.querySelectorAll === "function") {
      nodes = Array.from(root.querySelectorAll("[c-date], [c-date-now]"));
    }

    nodes.forEach((el) => {
      let offset = 0;

      if (el.hasAttribute("c-date-now")) {
        offset = 0;
      } else if (el.hasAttribute("c-date")) {
        const raw = el.getAttribute("c-date");
        offset = raw === null || raw.trim() === "" ? 0 : Number(raw);
        if (Number.isNaN(offset)) {
          offset = 0;
        }
      }

      const unit = (el.getAttribute("c-date-unit") || DEFAULT_UNIT).trim();
      const format = (el.getAttribute("c-date-format") || DEFAULT_FORMAT).trim();

      el.textContent = dayjsRef().add(offset, unit).format(format);
    });

    return true;
  }

  function startDateObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target) {
          renderCDates(mutation.target);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            renderCDates(node);
          }
        });
      });
    });

    const observeRoot = document.body || document.documentElement;
    if (!observeRoot) {
      return;
    }

    observer.observe(observeRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["c-date", "c-date-now", "c-date-unit", "c-date-format"],
    });
  }

  function initializeCDates() {
    let attempts = 0;

    const boot = () => {
      attempts += 1;
      const rendered = renderCDates(document);

      if (rendered) {
        startDateObserver();
        return;
      }

      if (attempts < MAX_DAYJS_WAIT_ATTEMPTS) {
        window.setTimeout(boot, DAYJS_WAIT_DELAY_MS);
      }
    };

    boot();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCDates, { once: true });
  } else {
    initializeCDates();
  }

  window.addEventListener("load", () => renderCDates(document), { once: true });

  // для ручного вызова после любых динамических изменений
  window.renderCDates = renderCDates;
})();
