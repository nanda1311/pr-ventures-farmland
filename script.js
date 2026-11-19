(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsMotion = !reduceMotion && 'IntersectionObserver' in window;

  if (supportsMotion) {
    document.documentElement.classList.add('motion-ready');

    [
      '.services .sec-head',
      '.svc-info > div',
      '.step',
      '.listings > .container > h2',
      '.feat',
      '.testi .tl',
      '.testi .tr',
      '.why-grid > div',
      '.faq-grid > div',
      '.about-story-copy',
      '.about-story-media',
      '.about-fact',
      '.about-purpose-intro',
      '.about-purpose-item',
      '.about-testimonial-media',
      '.about-testimonial-copy',
      '.property-gallery-inner',
      '.property-overview-copy',
      '.property-details',
      '.property-facilities-intro',
      '.facility-card',
      '.property-faq-media',
      '.property-faq-list',
      '.contact-info',
      '.contact-form',
      '.contact-map',
      '.contact-hours',
      '.contact-faq-media',
      '.contact-faq-list',
      '.f-grid > div',
      '.copy'
    ].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el, index) {
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        el.style.setProperty('--d', Math.min(index, 3) * 80 + 'ms');
      });
    });

    var targets = document.querySelectorAll('.reveal, .banner');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  document.querySelectorAll('.faq-list, .property-faq-list, .contact-faq-list').forEach(function (group) {
    var items = group.querySelectorAll('details');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  document.querySelectorAll('.burger').forEach(function (button) {
    var links = button.closest('.nav-in').querySelector('.links');
    button.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  var fmt = function (n) { return n.toLocaleString('en-US'); };
  if (supportsMotion) {
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
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  document.querySelectorAll('.links a').forEach(function (link) {
    link.addEventListener('click', function () {
      var links = link.closest('.links');
      var button = link.closest('.nav').querySelector('.burger');
      links.classList.remove('open');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  });

  var facilityList = document.querySelector('.property-facilities-list');
  var facilityImage = document.querySelector('.property-facility-image');
  if (facilityList && facilityImage) {
    var facilityCards = Array.prototype.slice.call(facilityList.querySelectorAll('.facility-card'));
    var activeFacilityIndex = 0;
    var facilityTimer = null;
    var facilityImageRequest = 0;

    function activateFacility(index) {
      activeFacilityIndex = index;
      var activeCard = facilityCards[index];
      var requestId = ++facilityImageRequest;

      facilityCards.forEach(function (card, cardIndex) {
        var isActive = cardIndex === index;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-pressed', String(isActive));
      });

      var imagePath = activeCard.dataset.image;
      var imageAlt = activeCard.dataset.imageAlt;
      if (facilityImage.getAttribute('src') === imagePath) {
        facilityImage.alt = imageAlt;
        facilityImage.classList.remove('is-changing');
        return;
      }

      facilityImage.classList.add('is-changing');
      var nextImage = new Image();
      nextImage.onload = function () {
        if (requestId !== facilityImageRequest) return;
        facilityImage.src = imagePath;
        facilityImage.alt = imageAlt;
        facilityImage.classList.remove('is-changing');
      };
      nextImage.onerror = function () {
        if (requestId !== facilityImageRequest) return;
        facilityImage.classList.remove('is-changing');
        console.error('Unable to load facility image: ' + imagePath);
      };
      nextImage.src = imagePath;
    }

    function stopFacilityRotation() {
      if (facilityTimer === null) return;
      window.clearInterval(facilityTimer);
      facilityTimer = null;
    }

    function startFacilityRotation() {
      if (reduceMotion || facilityTimer !== null || facilityCards.length < 2) return;
      facilityTimer = window.setInterval(function () {
        activateFacility((activeFacilityIndex + 1) % facilityCards.length);
      }, 3000);
    }

    facilityCards.forEach(function (card, index) {
      card.addEventListener('click', function () {
        activateFacility(index);
        stopFacilityRotation();
        startFacilityRotation();
      });
    });

    facilityList.addEventListener('mouseenter', stopFacilityRotation);
    facilityList.addEventListener('mouseleave', startFacilityRotation);
    facilityList.addEventListener('focusin', stopFacilityRotation);
    facilityList.addEventListener('focusout', function (event) {
      if (!facilityList.contains(event.relatedTarget)) startFacilityRotation();
    });

    var initialFacilityIndex = facilityCards.findIndex(function (card) {
      return card.classList.contains('active');
    });
    activateFacility(initialFacilityIndex >= 0 ? initialFacilityIndex : 0);
    startFacilityRotation();
  }
})();
