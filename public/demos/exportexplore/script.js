(function () {
  'use strict';

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

  // Mobile nav
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

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
