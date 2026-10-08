/* ------------------------------------------------------------------
   Ссылка перехода для кнопок OPEN THE DEMO.
   Вставь адрес между кавычками — он подставится во все кнопки сразу.
   Пока строка пустая, кнопки ничего не делают.
   ------------------------------------------------------------------ */
var CTA_URL = '';

/* Открывать в новой вкладке? true / false */
var CTA_NEW_TAB = false;

(function () {
  'use strict';

  function apply() {
    var buttons = document.querySelectorAll('[data-cta]');
    for (var i = 0; i < buttons.length; i++) {
      var el = buttons[i];
      if (!CTA_URL) {
        // без адреса клик не должен уводить на "#" и дёргать страницу вверх
        el.setAttribute('href', '#');
        el.addEventListener('click', function (e) { e.preventDefault(); });
        continue;
      }
      el.setAttribute('href', CTA_URL);
      if (CTA_NEW_TAB) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  /* Клик по любой ссылке-заглушке не должен дописывать # в адрес и прыгать
     наверх. Слушаем на фазе перехвата, чтобы чужой stopPropagation не увёл
     событие мимо; preventDefault другим обработчикам не мешает. */
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || !el.closest) return;
    if (el.closest('a[href="#"]')) e.preventDefault();
  }, true);
})();
