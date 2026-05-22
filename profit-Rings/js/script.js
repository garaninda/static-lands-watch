(() => {
  'use strict';

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? '0px' : answer.scrollHeight + 'px';
    });
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('revealed'));
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Anchor links — smooth scroll without changing URL
  const header = document.querySelector('header');
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Mobile sticky CTA — show after hero, hide near form/footer
  const mobileCta = document.getElementById('mobile-cta');
  const heroForm = document.getElementById('registration-form-hero');
  const footer = document.querySelector('footer');
  if (mobileCta && heroForm && 'IntersectionObserver' in window) {
    let formInView = false;
    let footerInView = false;
    let pastHero = false;

    const update = () => {
      const shouldShow = pastHero && !formInView && !footerInView;
      mobileCta.classList.toggle('show', shouldShow);
    };

    const heroIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => { pastHero = !e.isIntersecting; update(); });
    }, { threshold: 0.2 });
    heroIo.observe(heroForm);

    const formIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => { formInView = e.isIntersecting; update(); });
    }, { threshold: 0.3 });
    formIo.observe(heroForm);

    if (footer) {
      const footIo = new IntersectionObserver((entries) => {
        entries.forEach((e) => { footerInView = e.isIntersecting; update(); });
      }, { threshold: 0.05 });
      footIo.observe(footer);
    }
  }

  // Form submit — handled by Validate.initLeadForms onSubmit callback in each page.
})();
