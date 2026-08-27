// все внешние ссылки обезврежены: href переписывается на якорь формы,
// а клик по ним плавно скроллит к блоку регистрации вместо перехода
(function () {
  "use strict";

  var TARGET_ID = "cta-button"; // секция с формой
  var FALLBACK_ID = "form_block";
  var ANCHOR = "#" + TARGET_ID;

  function getTarget() {
    return document.getElementById(TARGET_ID) || document.getElementById(FALLBACK_ID);
  }

  // внешняя = чужой хост, протокол-относительная (//...) или не-http схема
  // (mailto:, tel:). Якоря (#...) и относительные пути остаются рабочими —
  // на них держится навигация внутри страницы
  function isExternal(a) {
    var href = a.getAttribute("href");
    if (!href) return false;

    var h = href.replace(/^\s+/, "").toLowerCase();
    if (!h || h.charAt(0) === "#") return false;
    if (h.indexOf("javascript:") === 0) return false;
    if (h.indexOf("//") === 0) return true;

    if (/^[a-z][a-z0-9+.\-]*:/.test(h)) {
      if (h.indexOf("http://") !== 0 && h.indexOf("https://") !== 0) return true;
      return a.hostname !== window.location.hostname;
    }
    return false;
  }

  function neutralize(root) {
    var links = (root || document).querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (!isExternal(a)) continue;
      a.setAttribute("href", ANCHOR);
      a.removeAttribute("target");
      a.removeAttribute("ping");
      a.setAttribute("rel", "nofollow");
    }
  }

  function scrollToForm() {
    var target = getTarget();
    if (!target) return;

    var reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    } catch (e) {
      target.scrollIntoView(); // старые браузеры не понимают объект-опции
    }
  }

  function closestLink(node) {
    while (node && node !== document) {
      if (node.nodeType === 1 && node.tagName && node.tagName.toLowerCase() === "a") return node;
      node = node.parentNode;
    }
    return null;
  }

  function handle(event) {
    var a = closestLink(event.target);
    if (!a) return;

    var href = a.getAttribute("href");
    if (href !== ANCHOR && !isExternal(a)) return;

    event.preventDefault();
    event.stopPropagation();
    scrollToForm();
  }

  function init() {
    neutralize(document);

    // capture-фаза: перехватываем раньше обработчиков разметки BBC
    document.addEventListener("click", handle, true);
    document.addEventListener("auxclick", handle, true); // клик колесиком = новая вкладка

    // ссылки, дорисованные скриптами уже после загрузки
    if (window.MutationObserver) {
      new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var added = mutations[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            if (added[j].nodeType !== 1) continue;
            if (added[j].tagName.toLowerCase() === "a") {
              if (isExternal(added[j])) neutralize(added[j].parentNode || document);
            } else {
              neutralize(added[j]);
            }
          }
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
