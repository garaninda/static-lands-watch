(() => {
  const startLugaresCountdown = () => {
    const main = document.getElementById('lugares-counter');
    const inline = document.querySelectorAll('.lugares-inline');
    if (!main && !inline.length) return;

    let current = parseInt(main?.textContent || inline[0]?.textContent || '264', 10);
    if (Number.isNaN(current)) current = 264;

    const render = () => {
      if (main) main.textContent = current;
      inline.forEach((el) => {
        el.textContent = current;
      });
    };
    render();

    setInterval(() => {
      if (current > 1) {
        current -= 1;
        render();
      }
    }, 25000);
  };

  const startEnLineaJitter = () => {
    const nodes = document.querySelectorAll('.enlinea-counter');
    if (!nodes.length) return;

    const min = 80;
    const max = 180;
    let current = 127;

    const render = () => {
      nodes.forEach((el) => {
        el.textContent = current;
      });
    };
    render();

    setInterval(() => {
      const delta = Math.floor(Math.random() * 31) - 15;
      current = Math.max(min, Math.min(max, current + delta));
      render();
    }, 15000);
  };

  const bindSmoothScroll = () => {
    document.addEventListener('click', (ev) => {
      const a = ev.target.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (href === '#' || href.length < 2) {
        ev.preventDefault();
        return;
      }
      const target = document.getElementById(href.slice(1));
      if (!target) {
        ev.preventDefault();
        return;
      }
      ev.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const startRealDate = () => {
    const nodes = document.querySelectorAll('[data-header-target="realdate"]');
    if (!nodes.length) return;

    const FALLBACK_DAYS = [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
    ];
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

    const format = () => {
      const d = new Date();
      let weekday;
      try {
        weekday = new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(d).toLowerCase();
      } catch {
        weekday = FALLBACK_DAYS[d.getDay()];
      }
      return `${weekday}, ${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} / ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const render = () => {
      const s = format();
      nodes.forEach((el) => {
        el.textContent = s;
      });
    };
    render();
    setInterval(render, 30000);
  };

  const init = () => {
    startRealDate();
    startLugaresCountdown();
    startEnLineaJitter();
    bindSmoothScroll();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
