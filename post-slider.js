/* Filtered Thoughts post slideshow.
   Builds a clickable slideshow from the post cards already on the page,
   using each post's preview image (og:image). New posts appear automatically. */
(function () {
  var mount = document.querySelector('[data-post-slider]');
  if (!mount) return;
  var links = Array.prototype.slice.call(document.querySelectorAll('.cards .card h3 a'));
  if (!links.length) { mount.remove(); return; }

  var css = [
    '.slider-top{padding-top:4px}',
    '.ps{position:relative;max-width:880px;margin:0 auto 32px;border-radius:var(--radius,14px);overflow:hidden;background:var(--surface,#fff);border:1px solid var(--line,#e6e2d8);box-shadow:0 10px 30px rgba(0,0,0,.08)}',
    '.ps-track{display:flex;transition:transform .5s ease;will-change:transform}',
    '.ps-slide{flex:0 0 100%;display:block;color:inherit;text-decoration:none}',
    '.ps-img{display:block;width:100%;aspect-ratio:1200/630;object-fit:cover;background:#12161d}',
    '.ps-cap{display:flex;flex-direction:column;gap:2px;padding:14px 20px 40px}',
    '.ps-cat{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#5d6573)}',
    '.ps-title{font-family:"Fraunces",Georgia,serif;font-size:1.25rem;line-height:1.25;color:var(--ink,#1d2330)}',
    '.ps-slide:hover .ps-title{color:var(--accent,#1f7a6d)}',
    '.ps-btn{position:absolute;top:calc((100% - 74px)/2);transform:translateY(-50%);width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#1d2330;font-size:24px;line-height:34px;text-align:center;cursor:pointer;padding:0;box-shadow:0 4px 14px rgba(0,0,0,.3)}',
    '.ps-btn:hover,.ps-btn:focus-visible{background:#fff;color:var(--accent,#1f7a6d)}',
    '.ps-prev{left:6px}.ps-next{right:6px}',
    '.ps-dots{position:absolute;left:0;right:0;bottom:14px;display:flex;justify-content:center;gap:8px}',
    '.ps-dot{width:9px;height:9px;border-radius:50%;border:0;padding:0;background:var(--line,#d6d1c4);cursor:pointer}',
    '.ps-dot[aria-current="true"]{background:var(--accent,#1f7a6d);width:22px;border-radius:5px}',
    '.ps-single .ps-btn,.ps-single .ps-dots{display:none}.ps-single .ps-cap{padding-bottom:16px}',
    '@media (max-width:600px){.ps-btn{display:none}.ps-title{font-size:1.05rem}.ps-cap{padding:12px 14px 36px}}',
    '@media (prefers-reduced-motion:reduce){.ps-track{transition:none}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fallback = new URL('/images/filtered-thoughts-preview.jpg', location.href).href;
  var slides = links.map(function (a) {
    var card = a.closest('.card');
    var meta = card && card.querySelector('.meta');
    return {
      href: a.getAttribute('href'),
      title: a.textContent.trim(),
      cat: meta ? meta.textContent.split('·')[0].trim() : ''
    };
  });

  var root = document.createElement('div');
  root.className = 'ps' + (slides.length < 2 ? ' ps-single' : '');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carousel');
  root.setAttribute('aria-label', 'Featured posts');
  var track = document.createElement('div'); track.className = 'ps-track';
  var imgs = [];
  slides.forEach(function (s, i) {
    var a = document.createElement('a');
    a.className = 'ps-slide'; a.href = s.href;
    a.setAttribute('aria-label', s.title + ' (slide ' + (i + 1) + ' of ' + slides.length + ')');
    var img = document.createElement('img');
    img.className = 'ps-img'; img.alt = ''; img.width = 1200; img.height = 630;
    img.loading = i === 0 ? 'eager' : 'lazy';
    imgs.push(img);
    var cap = document.createElement('span'); cap.className = 'ps-cap';
    cap.innerHTML = '<span class="ps-cat"></span><span class="ps-title"></span>';
    cap.firstChild.textContent = s.cat; cap.lastChild.textContent = s.title;
    a.appendChild(img); a.appendChild(cap); track.appendChild(a);
  });
  root.appendChild(track);

  var prev = btn('ps-btn ps-prev', 'Previous post', '‹');
  var next = btn('ps-btn ps-next', 'Next post', '›');
  var dots = document.createElement('div'); dots.className = 'ps-dots';
  var dotEls = slides.map(function (s, i) {
    var d = btn('ps-dot', 'Show ' + s.title, '');
    d.addEventListener('click', function () { go(i, true); });
    dots.appendChild(d); return d;
  });
  root.appendChild(prev); root.appendChild(next); root.appendChild(dots);
  mount.replaceWith(root);

  function btn(cls, label, txt) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.setAttribute('aria-label', label); b.textContent = txt; return b;
  }

  // Fetch each post's preview image (cached for the browser session).
  slides.forEach(function (s, i) {
    var key = 'ps:' + new URL(s.href, location.href).pathname, cached = null;
    try { cached = sessionStorage.getItem(key); } catch (e) {}
    if (cached) { imgs[i].src = cached; return; }
    fetch(s.href).then(function (r) { return r.text(); }).then(function (html) {
      var m = html.match(/<meta property="og:image" content="([^"]+)"/);
      var src = m ? m[1] : fallback;
      // Serve from this site even if og:image points at the live domain.
      try { var u = new URL(src); if (/nedworldwide\.com$/.test(u.hostname)) src = new URL(u.pathname, location.href).href; } catch (e) {}
      imgs[i].src = src;
      try { sessionStorage.setItem(key, src); } catch (e) {}
    }).catch(function () { imgs[i].src = fallback; });
  });

  var cur = 0, timer = null, paused = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(i, user) {
    cur = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * cur) + '%)';
    dotEls.forEach(function (d, k) { d.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    var s = track.children;
    for (var k = 0; k < s.length; k++) {
      s[k].setAttribute('aria-hidden', k === cur ? 'false' : 'true');
      s[k].tabIndex = k === cur ? 0 : -1;
    }
    if (user) restart();
  }
  function restart() {
    clearInterval(timer);
    if (slides.length > 1 && !reduce) timer = setInterval(function () { if (!paused) go(cur + 1); }, 5000);
  }
  prev.addEventListener('click', function () { go(cur - 1, true); });
  next.addEventListener('click', function () { go(cur + 1, true); });
  root.addEventListener('mouseenter', function () { paused = true; });
  root.addEventListener('mouseleave', function () { paused = false; });
  root.addEventListener('focusin', function () { paused = true; });
  root.addEventListener('focusout', function () { paused = false; });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { go(cur - 1, true); } else if (e.key === 'ArrowRight') { go(cur + 1, true); }
  });
  var x0 = null;
  root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; paused = true; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null; paused = false;
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), true);
  });
  go(0); restart();
})();
