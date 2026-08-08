(function () {
  'use strict';

  var bar = document.getElementById('bar');

  // Hero video: some hosts block or delay autoplay — nudge it, and fail silently
  // to the navy ground + gradient if the file can't play.
  var video = document.querySelector('.hero__video');
  if (video) {
    video.muted = true;
    var play = function () {
      var p = video.play();
      if (p && p.catch) { p.catch(function () {}); }
    };
    play();
    video.addEventListener('loadeddata', play, { once: true });
    video.addEventListener('canplay', play, { once: true });
  }

  // Bar goes solid once it leaves the hero
  var onScroll = function () {
    if (!bar) { return; }
    bar.classList.toggle('is-solid', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Mega menu ----
  // Hover opens on desktop (pointer: fine); click/tap toggles everywhere else.
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav__item[data-menu]'));
  // Must match the CSS mobile-menu breakpoint in styles.css (@media max-width: 1180px)
  var NAV_BREAKPOINT = 1180;
  var hoverable = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: ' + (NAV_BREAKPOINT + 1) + 'px)');

  function closeAll() {
    items.forEach(function (i) {
      i.classList.remove('is-open');
      var b = i.querySelector('.nav__link');
      if (b && b.tagName === 'BUTTON') { b.setAttribute('aria-expanded', 'false'); }
    });
    if (bar) { bar.classList.remove('has-open'); }
  }

  function open(item) {
    closeAll();
    item.classList.add('is-open');
    var b = item.querySelector('.nav__link');
    if (b && b.tagName === 'BUTTON') { b.setAttribute('aria-expanded', 'true'); }
    if (bar) { bar.classList.add('has-open'); }
  }

  var closeTimer;

  items.forEach(function (item) {
    var link = item.querySelector('.nav__link');

    item.addEventListener('mouseenter', function () {
      if (!hoverable.matches) { return; }
      clearTimeout(closeTimer);
      open(item);
    });
    item.addEventListener('mouseleave', function () {
      if (!hoverable.matches) { return; }
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeAll, 140);
    });

    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        if (item.classList.contains('is-open')) { closeAll(); } else { open(item); }
      });
    }
  });

  if (bar) {
    bar.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    bar.addEventListener('mouseleave', function () {
      if (!hoverable.matches) { return; }
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeAll, 140);
    });
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); } });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item')) { closeAll(); }
  });

  // Mobile menu
  var toggle = document.querySelector('.nav__toggle');
  if (bar && toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = bar.classList.toggle('is-menu');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) { closeAll(); }
    });
  }

  // In-page anchors clear the fixed bar
  var start = document.getElementById('start');
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) { return; }
      e.preventDefault();
      var barH = bar ? bar.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - barH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
  void start;

  // Reveal sections as they enter the viewport
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section__head, .door, .reason, .place__inner, .person, .cta__inner');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) { return; }
        entry.target.style.animationDelay = (i * 0.06) + 's';
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
  }
})();
