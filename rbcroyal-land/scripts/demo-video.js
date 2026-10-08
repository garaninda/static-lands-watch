/* Выбор ролика под ширину экрана: на телефоне вертикальный, иначе горизонтальный.
   Порог совпадает с точкой, где карточка перестаёт быть двухколоночной. */
(function () {
  'use strict';

  var TALL_UP_TO = 640; // px

  function pick() {
    var nodes = document.querySelectorAll('video[data-src-wide]');
    var tall = window.matchMedia('(max-width: ' + TALL_UP_TO + 'px)').matches;
    for (var i = 0; i < nodes.length; i++) {
      var v = nodes[i];
      var want = v.getAttribute(tall ? 'data-src-tall' : 'data-src-wide');
      if (!want || v.getAttribute('src') === want) continue;
      v.setAttribute('src', want);
      v.load();
      var played = v.play();
      if (played && played.catch) played.catch(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pick);
  } else {
    pick();
  }
  window.addEventListener('resize', pick);
})();
