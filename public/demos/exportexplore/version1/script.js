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

  // ---- Service menu modal ----
  var modal = document.getElementById('service-menu');
  if (modal) {
    var lastFocus = null;
    var hideTimer;
    var openModal = function () {
      clearTimeout(hideTimer);
      lastFocus = document.activeElement;
      modal.hidden = false;
      void modal.offsetHeight;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      var f = modal.querySelector('input, select, button');
      if (f) { setTimeout(function () { f.focus(); }, 60); }
    };
    var closeModal = function () {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      hideTimer = setTimeout(function () { modal.hidden = true; }, 260);
      if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
    };
    document.querySelectorAll('[data-modal-open]').forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) { closeModal(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) { closeModal(); }
    });
    modal.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); closeModal(); });
  }

  // Form send → sent state
  Array.prototype.forEach.call(document.querySelectorAll('.form'), function (form) {
    if (form.closest('.modal')) { return; }
    var btn = form.querySelector('.btn--wide');
    if (btn && !btn.querySelector('.btn__spin')) {
      var spin = document.createElement('span');
      spin.className = 'btn__spin';
      spin.setAttribute('aria-hidden', 'true');
      btn.appendChild(spin);
    }
    if (!form.querySelector('.form__sent')) {
      var sent = document.createElement('p');
      sent.className = 'form__sent';
      sent.setAttribute('role', 'status');
      sent.innerHTML = '<svg class="form__tick" viewBox="0 0 26 26" aria-hidden="true">' +
        '<circle cx="13" cy="13" r="12"></circle><path d="M7 13.4 11.2 17.5 19 8.5"></path></svg>' +
        '<span>Thank you &mdash; we&rsquo;ll reply within two working days.</span>';
      form.appendChild(sent);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-sending') || form.classList.contains('is-sent')) { return; }
      form.classList.add('is-sending');
      window.setTimeout(function () {
        form.classList.remove('is-sending');
        form.classList.add('is-sent');
      }, 1100);
    });
  });

  // In-page anchors clear the fixed bar
  var start = document.getElementById('start');
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.hasAttribute('data-modal-open')) { return; }
      var href = a.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      var target = document.querySelector(href);
      if (!target) { return; }
      e.preventDefault();
      var barH = bar ? bar.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - barH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
  void start;

  // Place Effect chain: fill and invert stages on scroll progress
  var chain = document.querySelector('[data-chain]');
  if (chain) {
    var fill = chain.querySelector('.chain__fill');
    var steps = Array.prototype.slice.call(chain.querySelectorAll('.chain__step'));
    var tick = function () {
      var r = chain.getBoundingClientRect();
      var span = window.innerHeight * 0.72;
      var p = (window.innerHeight - r.top - window.innerHeight * 0.22) / span;
      p = Math.max(0, Math.min(1, p));
      fill.style.width = (p * 100).toFixed(2) + '%';
      steps.forEach(function (s, i) {
        s.classList.toggle('is-on', p >= (i + 0.55) / steps.length);
      });
    };
    var queued = false;
    var onScroll = function () {
      if (queued) { return; }
      queued = true;
      requestAnimationFrame(function () { queued = false; tick(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
  }

  // Reveal sections as they enter the viewport
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section__head, .door, .reason, .steps, .place__inner, .person, .cta__inner');
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


/* Figure parallax — the image drifts against the frame as it crosses the viewport. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

  var slots = [].slice.call(document.querySelectorAll('.fig__frame:not([data-no-parallax]) image-slot'));
  if (!slots.length) { return; }

  // Peak travel must stay inside the slot's over-scan (14% of the frame per
  // side). The shortest frame is 340px, so the budget is ~47px — 30 leaves room.
  var DRIFT = 30;           // px of travel across the full pass
  var live = [];
  var ticking = false;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var i = live.indexOf(e.target);
      if (e.isIntersecting && i === -1) { live.push(e.target); }
      else if (!e.isIntersecting && i > -1) { live.splice(i, 1); }
    });
    update();
  }, { rootMargin: '20% 0px' });

  slots.forEach(function (el) { io.observe(el); });

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    live.forEach(function (el) {
      var frame = el.parentElement;
      var r = frame.getBoundingClientRect();
      // -1 when the frame sits below the fold, 1 when it has passed above it
      var p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
      p = Math.max(-1, Math.min(1, p));
      el.style.transform = 'translate3d(0,' + (p * DRIFT).toFixed(2) + 'px,0)';
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();


/* Picker — a menu whose selection swaps the companion image. Any number of
   entries; exactly one is open at a time. */
(function () {
  'use strict';
  var groups = [].slice.call(document.querySelectorAll('[data-picker]'));
  if (!groups.length) { return; }

  groups.forEach(function (group) {
    var items = [].slice.call(group.querySelectorAll('[data-picker-item]'));
    var shots = [].slice.call(group.querySelectorAll('[data-picker-shot]'));
    if (!items.length) { return; }

    function select(i) {
      items.forEach(function (el) {
        var on = Number(el.dataset.pickerItem) === i;
        el.classList.toggle('is-open', on);
        el.querySelector('.picker__head').setAttribute('aria-expanded', String(on));
      });
      shots.forEach(function (el) {
        el.setAttribute('data-active', String(Number(el.dataset.pickerShot) === i));
      });
    }

    items.forEach(function (el) {
      var head = el.querySelector('.picker__head');
      head.addEventListener('click', function () { select(Number(el.dataset.pickerItem)); });
      head.addEventListener('keydown', function (e) {
        // roving arrow keys, since this reads as a single list of choices
        var dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
        if (!dir) { return; }
        e.preventDefault();
        var next = items[(Number(el.dataset.pickerItem) + dir + items.length) % items.length];
        next.querySelector('.picker__head').focus();
        select(Number(next.dataset.pickerItem));
      });
    });
  });
})();
