// homepage-scripts.ts — runs only on the homepage.
// Hero terminal feed. The testimonial rotator lives inside Marquee.astro.

// ============ HERO TERMINAL FEED ============
(function() {
  const feed = document.getElementById('hero-terminal-feed');
  const clock = document.getElementById('hero-terminal-clock');
  if (!feed || !clock) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sites = [
    'acme-co.com',
    'northern-firm.co.uk',
    'studio-portfolio.com',
    'apex-agency.co.uk',
    'meadow-cafe.com',
  ];

  type Evt = { type: string; verb: string; detail: () => string; label: string };

  const events: Evt[] = [
    { type: 'backup',   verb: 'Backup',           detail: () => `${(Math.floor(Math.random() * 400) + 120)}MB`, label: 'BACKUP' },
    { type: 'plugin',   verb: 'Plugins updated',  detail: () => `${Math.floor(Math.random() * 6) + 2} packages`, label: 'UPDATE' },
    { type: 'uptime',   verb: 'Uptime check',     detail: () => `${(Math.random() * 80 + 40).toFixed(0)}ms`, label: 'PING' },
    { type: 'ssl',      verb: 'SSL renewed',      detail: () => 'valid 90 days', label: 'SSL' },
    { type: 'security', verb: 'Security scan',    detail: () => '0 threats', label: 'SCAN' },
    { type: 'core',     verb: 'WP core updated',  detail: () => '6.7.2 → 6.7.3', label: 'CORE' },
  ];

  const MAX_ROWS = 6;
  const TICK_INTERVAL = 2400;

  let tickTimer: number | null = null;
  let clockTimer: number | null = null;
  let running = false;

  function pad(n: number): string { return n < 10 ? '0' + n : '' + n; }
  function timestamp(): string {
    const d = new Date();
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  function updateClock() { if (clock) clock.textContent = timestamp(); }
  function pickEvent(): Evt { return events[Math.floor(Math.random() * events.length)]!; }
  function pickSite(): string { return sites[Math.floor(Math.random() * sites.length)]!; }

  interface FeedRow extends HTMLDivElement {
    _completeTimer?: number | null;
    _removeTimer?: number | null;
  }

  function safeRemove(row: FeedRow | null) {
    if (!row) return;
    if (row._completeTimer) { clearTimeout(row._completeTimer); row._completeTimer = null; }
    if (row._removeTimer) { clearTimeout(row._removeTimer); row._removeTimer = null; }
    if (row.parentNode) row.parentNode.removeChild(row);
  }

  function completeRow(row: FeedRow, evt: Evt, site: string) {
    if (!row.isConnected) return;
    row.classList.remove('hero-terminal-row--pending');
    row.classList.add('hero-terminal-row--done');
    const text = row.querySelector('.hero-terminal-text');
    const spinner = row.querySelector('.hero-terminal-spinner');
    if (spinner) spinner.outerHTML = '<span class="hero-terminal-check">✓</span>';
    if (text) {
      text.innerHTML = evt.verb + ' · ' + site + ' <span class="hero-terminal-detail">· ' + evt.detail() + '</span>';
    }
  }

  function makeRow(evt: Evt, site: string): FeedRow {
    const row = document.createElement('div') as FeedRow;
    row.className = 'hero-terminal-row hero-terminal-row--pending';
    row.innerHTML =
      '<span class="hero-terminal-time">' + timestamp() + '</span>' +
      '<span class="hero-terminal-tag hero-terminal-tag--' + evt.type + '">' + evt.label + '</span>' +
      '<span class="hero-terminal-body">' +
        '<span class="hero-terminal-spinner"></span>' +
        '<span class="hero-terminal-text">' + evt.verb + ' · ' + site + '</span>' +
      '</span>';
    return row;
  }

  function tickFn() {
    if (!feed || !document.body.contains(feed)) {
      stop();
      return;
    }

    const evt = pickEvent();
    const site = pickSite();
    const row = makeRow(evt, site);
    feed.appendChild(row);

    while (feed.children.length > MAX_ROWS) {
      const oldest = feed.firstElementChild as FeedRow | null;
      if (!oldest) break;
      oldest.classList.add('hero-terminal-row--exit');
      oldest._removeTimer = window.setTimeout(() => safeRemove(oldest), 350);
      setTimeout(() => { if (oldest.parentNode) safeRemove(oldest); }, 1000);
      break;
    }

    void row.offsetHeight;
    row.classList.add('hero-terminal-row--enter');

    row._completeTimer = window.setTimeout(() => {
      completeRow(row, evt, site);
      row._completeTimer = null;
    }, 700);
  }

  function start() {
    if (running) return;
    running = true;
    updateClock();
    clockTimer = window.setInterval(updateClock, 1000);
    tickTimer = window.setInterval(tickFn, TICK_INTERVAL);
    tickFn();
  }

  function stop() {
    running = false;
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener('pagehide', stop);

  setTimeout(start, 600);
})();
