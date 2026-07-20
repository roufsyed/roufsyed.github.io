import { portfolioData } from './portfolio-data.js';

/* ============================================================
   Constants
   ============================================================ */
const DOT = '  ·  ';
const STAR_TTL = 216e5; // ~6h
const GAL_TTL = 864e5; // 24h

const CHIP_LABELS = {
  all: 'All',
  payments: 'Payments',
  android: 'Android',
  backend: 'Backend',
  desktop: 'Desktop',
  ios: 'iOS',
};

/* ============================================================
   State
   ============================================================ */
const state = {
  work: 'all',
  oss: 'all',
  starCounts: {},
  galleries: {},
  data: portfolioData || {},
};

/* ============================================================
   DOM helper: safe element builder (uses textContent, no HTML injection)
   ============================================================ */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else {
      node.setAttribute(k, v);
    }
  }
  const list = Array.isArray(children) ? children : [children];
  for (const c of list) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/* ============================================================
   Logic ports (from the design-tool Component)
   ============================================================ */
function repoSlug(url) {
  const m = (url || '').match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?(?:[?#].*)?$/i);
  return m ? m[1] : null;
}

function githubUrl(o) {
  if (o.github) return o.github;
  const arr = Array.isArray(o.links) ? o.links : [];
  const hit = arr.find((l) => l && l.url && /github\.com/i.test(l.url));
  return hit ? hit.url : null;
}

function buildLinks(o) {
  if (Array.isArray(o.links) && o.links.length) {
    return o.links.filter((l) => l && l.url).map((l) => ({ label: l.label, href: l.url }));
  }
  const legacy = [
    { label: 'GitHub', href: o.github },
    { label: 'F-Droid', href: o.fdroid },
    { label: 'Play Store', href: o.playStore },
    { label: 'Maven', href: o.maven },
  ];
  return legacy.filter((l) => l.href);
}

function rawImg(u) {
  return String(u || '')
    .replace(/^https?:\/\/github\.com\/([^/]+\/[^/]+)\/blob\//i, 'https://raw.githubusercontent.com/$1/')
    .replace(/[?&]raw=true\b/i, '');
}

function buildImages(o) {
  const gal = state.galleries[o.title];
  const explicit = Array.isArray(o.screenshots)
    ? o.screenshots
    : Array.isArray(o.images)
    ? o.images
    : null;
  const srcs = gal && gal.length ? gal : explicit && explicit.length ? explicit : o.thumbnail ? [o.thumbnail] : [];
  return srcs.map((src, i) => ({ src: rawImg(src), alt: o.title + ' screenshot ' + (i + 1) }));
}

function cacheGet(key, ttl) {
  try {
    const o = JSON.parse(localStorage.getItem(key));
    return o && Date.now() - o.t < ttl ? o.v : null;
  } catch (e) {
    return null;
  }
}

function cacheSet(key, v) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch (e) {}
}

function fetchGalleries(list) {
  list.forEach((o) => {
    const s = o.screenshots;
    if (!s || Array.isArray(s) || !s.repo || !s.path) return;
    const branch = s.branch || 'main';
    const path = String(s.path).replace(/^\/+|\/+$/g, '');
    const ck = 'rs_gal_' + s.repo + '/' + path + '@' + branch;
    const cached = cacheGet(ck, GAL_TTL);
    if (cached && cached.length) {
      state.galleries = { ...state.galleries, [o.title]: cached };
      renderOpenSource();
      return;
    }
    const url =
      'https://api.github.com/repos/' + s.repo + '/contents/' + path + '?ref=' + encodeURIComponent(branch);
    fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((arr) => {
        if (!Array.isArray(arr)) return;
        const imgs = arr
          .filter((f) => f && f.type === 'file' && /\.(png|jpe?g|webp|gif|avif)$/i.test(f.name))
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
          .map((f) => f.download_url)
          .filter(Boolean);
        if (imgs.length) {
          cacheSet(ck, imgs);
          state.galleries = { ...state.galleries, [o.title]: imgs };
          renderOpenSource();
        }
      })
      .catch(() => {});
  });
}

function fetchStars(list) {
  list.forEach((o) => {
    const slug = repoSlug(githubUrl(o));
    if (!slug) return;
    const ck = 'rs_stars_' + slug;
    const cached = cacheGet(ck, STAR_TTL);
    if (cached != null) {
      state.starCounts = { ...state.starCounts, [slug]: cached };
      updateStarDom(slug);
      return;
    }
    fetch('https://api.github.com/repos/' + slug, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.stargazers_count === 'number') {
          cacheSet(ck, d.stargazers_count);
          state.starCounts = { ...state.starCounts, [slug]: d.stargazers_count };
          updateStarDom(slug);
        }
      })
      .catch(() => {});
  });
}

/* Update every rendered ★ meta line for a given repo slug in place. */
function updateStarDom(slug) {
  const nodes = document.querySelectorAll('[data-slug="' + cssEscape(slug) + '"] .oss-meta');
  nodes.forEach((node) => {
    const cat = node.getAttribute('data-cat') || '';
    const live = state.starCounts[slug];
    node.textContent = cat + '  ·  ★ ' + live;
  });
}

function cssEscape(s) {
  return String(s).replace(/"/g, '\\"');
}

/* ============================================================
   Chips
   ============================================================ */
function makeChips(items, current, onSelect) {
  const keys = ['all', ...Array.from(new Set(items.map((i) => i.key)))];
  return keys.map((k) => {
    const active = current === k;
    return el(
      'button',
      {
        type: 'button',
        class: 'chip',
        'aria-pressed': active ? 'true' : 'false',
        onclick: () => onSelect(k),
      },
      [
        CHIP_LABELS[k] || k,
        el('span', { class: 'count' }, [k === 'all' ? items.length : items.filter((i) => i.key === k).length]),
      ]
    );
  });
}

/* ============================================================
   Derived data
   ============================================================ */
function cleanUrl(u) {
  return (u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function workAll() {
  return (state.data.projects || []).map((w) => ({
    cat: w.category,
    title: w.title,
    desc: w.impact,
    key: (w.category || '').toLowerCase(),
    techLine: (w.stack || []).join(DOT),
  }));
}

function ossAll() {
  return (state.data.openSource || []).map((o) => {
    const slug = repoSlug(githubUrl(o));
    const live = slug && state.starCounts[slug] != null ? state.starCounts[slug] : o.stars;
    const imgs = buildImages(o);
    return {
      cat: o.category,
      name: o.title,
      desc: o.description,
      key: (o.category || '').toLowerCase(),
      techLine: (o.stack || []).join(DOT),
      metaLine: o.category + '  ·  ★ ' + live,
      slug,
      url: o.url || o.github,
      links: buildLinks(o),
      images: imgs,
      hasImages: imgs.length > 0,
    };
  });
}

/* ============================================================
   Section renderers
   ============================================================ */
function renderResumeLinks() {
  const identity = state.data.identity || {};
  document.querySelectorAll('a[data-resume]').forEach((a) => {
    // Data-driven; keep the HTML href as fallback if the data omits it.
    const url = identity.resumeUrl || a.getAttribute('href');
    if (!url) return;
    a.setAttribute('href', url);
    if (/^https?:\/\//i.test(url)) {
      // External résumé (e.g. Google Drive): open in a new tab, don't force-download.
      a.removeAttribute('download');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    } else {
      // Local file: download in place.
      a.setAttribute('download', '');
      a.removeAttribute('target');
      a.removeAttribute('rel');
    }
  });
}

function renderHero() {
  const c = (state.data.identity && state.data.identity.contact) || {};
  const focus = document.getElementById('focusLine');
  if (focus) focus.textContent = (state.data.focusAreas || []).join(', ');

  const phoneDigits = (c.phone || '').replace(/[^0-9]/g, '');
  const set = (id, href) => {
    const a = document.getElementById(id);
    if (a) a.setAttribute('href', href);
  };
  set('linkEmail', c.email ? 'mailto:' + c.email : '#');
  set('linkPhone', c.phone ? 'tel:+' + phoneDigits : '#');
  set('linkWhatsapp', phoneDigits ? 'https://wa.me/' + phoneDigits : '#');
  set('linkLinkedin', c.linkedin || '#');
}

function renderCareer() {
  const src = state.data.career || [];
  const years = src.flatMap((j) => (j.period.match(/\d{4}/g) || []).map(Number));
  const careerRange = years.length
    ? Math.min(...years) + ' - ' + (src.some((j) => /present/i.test(j.period)) ? 'Present' : Math.max(...years))
    : '';
  const rangeEl = document.getElementById('careerRange');
  if (rangeEl) rangeEl.textContent = careerRange;

  const orgLabel = (org) => {
    const m = org.match(/\(([^)]+)\)/);
    return m ? m[1] : org;
  };
  const orgs = [...new Set(src.map((j) => orgLabel(j.org)))];
  const workOrgs = orgs.slice(0, 3).join(', ') + (orgs.length > 3 ? ' & beyond' : '');
  const orgsEl = document.getElementById('workOrgs');
  if (orgsEl) orgsEl.textContent = workOrgs;

  const list = document.getElementById('careerList');
  clear(list);
  src.forEach((j) => {
    list.append(
      el('div', { class: 'job' }, [
        el('div', { class: 'job-head' }, [
          el('h3', { class: 'job-role' }, [j.role]),
          el('div', { class: 'job-dates' }, [j.period]),
        ]),
        el('div', { class: 'job-org' }, [j.org]),
        el('p', { class: 'job-desc' }, [j.summary]),
      ])
    );
  });
}

function renderWork() {
  const all = workAll();
  const chips = document.getElementById('workChips');
  clear(chips);
  makeChips(all, state.work, (k) => {
    state.work = k;
    renderWork();
  }).forEach((chip) => chips.append(chip));

  const filtered = state.work === 'all' ? all : all.filter((w) => w.key === state.work);
  const list = document.getElementById('workList');
  clear(list);
  filtered.forEach((p) => {
    list.append(
      el('article', { class: 'card' }, [
        el('div', { class: 'card-head' }, [
          el('h3', { class: 'card-title' }, [p.title]),
          el('span', { class: 'card-cat' }, [p.cat]),
        ]),
        el('p', { class: 'card-desc' }, [p.desc]),
        el('div', { class: 'card-tech' }, [p.techLine]),
      ])
    );
  });
}

function renderOpenSource() {
  const all = ossAll();
  const chips = document.getElementById('ossChips');
  clear(chips);
  makeChips(all, state.oss, (k) => {
    state.oss = k;
    renderOpenSource();
  }).forEach((chip) => chips.append(chip));

  const filtered = state.oss === 'all' ? all : all.filter((o) => o.key === state.oss);
  const list = document.getElementById('ossList');
  clear(list);

  filtered.forEach((o) => {
    const children = [];

    // Full-card overlay link (sits below the real links via z-index).
    children.push(
      el('a', {
        class: 'oss-overlay',
        href: o.url || '#',
        target: '_blank',
        rel: 'noopener',
        'aria-label': o.name + ' website',
      })
    );

    // Optional screenshot gallery.
    if (o.hasImages) {
      const gallery = el('div', { class: 'oss-gallery' });
      o.images.forEach((shot) => {
        gallery.append(
          el('img', {
            src: shot.src,
            alt: shot.alt,
            loading: 'lazy',
            referrerpolicy: 'no-referrer',
            onerror: function () {
              this.style.display = 'none';
            },
          })
        );
      });
      children.push(gallery);
    }

    // Body.
    const links = el('div', { class: 'oss-links' });
    o.links.forEach((lnk) => {
      links.append(
        el('a', { class: 'oss-link', href: lnk.href, target: '_blank', rel: 'noopener' }, [lnk.label + ' ↗'])
      );
    });

    children.push(
      el('div', { class: 'oss-body' }, [
        el('div', { class: 'oss-head' }, [
          el('h3', { class: 'card-title' }, [o.name]),
          el('span', { class: 'oss-meta', 'data-cat': o.cat }, [o.metaLine]),
        ]),
        el('p', { class: 'card-desc' }, [o.desc]),
        el('div', { class: 'oss-foot' }, [el('div', { class: 'oss-tech' }, [o.techLine]), links]),
      ])
    );

    list.append(el('article', { class: 'oss-card', 'data-slug': o.slug || '' }, children));
  });
}

function renderPublications() {
  const list = document.getElementById('pubList');
  clear(list);
  (state.data.articles || []).forEach((p) => {
    list.append(
      el('a', { class: 'pub-card', href: p.url, target: '_blank', rel: 'noopener' }, [
        el('div', {}, [
          el('h3', { class: 'pub-title' }, [p.title]),
          el('div', { class: 'pub-venue' }, [p.platform]),
        ]),
        el('span', { class: 'pub-read' }, ['Read ↗']),
      ])
    );
  });
}

function renderContacts() {
  const c = (state.data.identity && state.data.identity.contact) || {};
  const contacts = [];
  if (c.email) contacts.push({ label: 'Email', value: c.email, href: 'mailto:' + c.email });
  if (c.phone) contacts.push({ label: 'Phone', value: c.phone, href: 'tel:' + c.phone.replace(/\s+/g, '') });
  if (c.linkedin) contacts.push({ label: 'LinkedIn', value: cleanUrl(c.linkedin), href: c.linkedin });
  if (c.github) contacts.push({ label: 'GitHub', value: cleanUrl(c.github), href: c.github });

  const list = document.getElementById('contactList');
  clear(list);
  contacts.forEach((ct) => {
    list.append(
      el('a', { class: 'contact-card', href: ct.href, target: '_blank', rel: 'noopener' }, [
        el('span', { class: 'contact-label' }, [ct.label]),
        el('span', { class: 'contact-value' }, [ct.value]),
      ])
    );
  });
}

/* ============================================================
   Mumbai clock
   ============================================================ */
function startClock() {
  const node = document.getElementById('mumbaiTime');
  const tick = () => {
    try {
      node.textContent = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
    } catch (e) {}
  };
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   Mobile menu
   ============================================================ */
function mobileMenu() {
  const btn = document.getElementById('hambBtn');
  const menu = document.getElementById('mobileMenu');
  const panel = menu.querySelector('.mobile-menu-panel');
  const closeBtn = menu.querySelector('.mobile-menu-close');

  const focusable = () =>
    Array.from(panel.querySelectorAll('a[href], button:not([disabled])')).filter(
      (n) => n.offsetParent !== null
    );

  const open = () => {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    (focusable()[0] || panel).focus();
  };
  const close = () => {
    if (menu.hidden) return;
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.focus(); // restore focus to the trigger
  };

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  // Clicking the backdrop closes; clicking the panel itself does not.
  menu.addEventListener('click', close);
  panel.addEventListener('click', (e) => e.stopPropagation());
  // Any nav link inside the menu closes it.
  menu.querySelectorAll('.mobile-menu-nav a, .mobile-menu-cta').forEach((a) => {
    a.addEventListener('click', close);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) close();
  });
  // Trap Tab focus within the open dialog.
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ============================================================
   Init
   ============================================================ */
function init() {
  renderResumeLinks();
  renderHero();
  renderCareer();
  renderWork();
  renderOpenSource();
  renderPublications();
  renderContacts();
  startClock();
  mobileMenu();

  const oss = state.data.openSource || [];
  fetchStars(oss);
  fetchGalleries(oss);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
