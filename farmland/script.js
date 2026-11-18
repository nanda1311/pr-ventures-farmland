(function () {
  // Scroll reveal for grid items (fade + rise + image zoom-out), staggered via --d in HTML
  var targets = document.querySelectorAll('.reveal, .banner');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (el) { io.observe(el); });

  // Count-up numbers
  var fmt = function (n) { return n.toLocaleString('en-US'); };
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null, dur = 1600;
      (function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = fmt(v) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  // Close mobile menu on link click
  document.querySelectorAll('#links a').forEach(function (a) {
    a.addEventListener('click', function () { document.getElementById('links').classList.remove('open'); });
  });
})();
