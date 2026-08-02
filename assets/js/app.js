(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function safeInit(name, initializer) {
    try {
      initializer();
    } catch (error) {
      console.error("Nearloom component failed: " + name, error);
    }
  }

  function initMobileMenu() {
    var menu = document.querySelector("[data-mobile-menu]");
    var openButton = document.querySelector("[data-menu-open]");
    var closeButton = document.querySelector("[data-menu-close]");
    if (!menu || !openButton || !closeButton || menu.dataset.menuReady === "true") return;
    menu.dataset.menuReady = "true";
    var previousFocus = null;

    function focusable() {
      return [].slice.call(menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    }

    function openMenu() {
      previousFocus = document.activeElement;
      menu.removeAttribute("inert");
      menu.setAttribute("aria-hidden", "false");
      menu.dataset.open = "true";
      openButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      window.requestAnimationFrame(function () { closeButton.focus(); });
    }

    function closeMenu() {
      menu.dataset.open = "false";
      menu.setAttribute("aria-hidden", "true");
      menu.setAttribute("inert", "");
      openButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    }

    openButton.addEventListener("click", openMenu);
    closeButton.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (event) {
      if (menu.dataset.open !== "true") return;
      if (event.key === "Escape") { closeMenu(); return; }
      if (event.key !== "Tab") return;
      var items = focusable();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function (accordion) {
      if (accordion.dataset.accordionReady === "true") return;
      accordion.dataset.accordionReady = "true";
      var triggers = [].slice.call(accordion.querySelectorAll(".accordion__trigger"));

      function panelFor(trigger) {
        return document.getElementById(trigger.getAttribute("aria-controls"));
      }

      function closeItem(trigger) {
        var panel = panelFor(trigger);
        if (!panel) return;
        trigger.setAttribute("aria-expanded", "false");
        if (reduceMotion.matches) {
          panel.style.height = "0px";
          panel.style.visibility = "hidden";
          return;
        }
        panel.style.height = panel.scrollHeight + "px";
        panel.offsetHeight;
        panel.style.height = "0px";
        panel.addEventListener("transitionend", function onEnd(event) {
          if (event.propertyName !== "height") return;
          if (trigger.getAttribute("aria-expanded") === "false") panel.style.visibility = "hidden";
          panel.removeEventListener("transitionend", onEnd);
        });
      }

      function openItem(trigger) {
        var panel = panelFor(trigger);
        if (!panel) return;
        panel.style.visibility = "visible";
        trigger.setAttribute("aria-expanded", "true");
        if (reduceMotion.matches) { panel.style.height = "auto"; return; }
        panel.style.height = panel.scrollHeight + "px";
        panel.addEventListener("transitionend", function onEnd(event) {
          if (event.propertyName !== "height") return;
          if (trigger.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
          panel.removeEventListener("transitionend", onEnd);
        });
      }

      triggers.forEach(function (trigger) {
        var panel = panelFor(trigger);
        if (!panel) return;
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        panel.style.visibility = expanded ? "visible" : "hidden";
        panel.style.height = expanded ? "auto" : "0px";
        trigger.addEventListener("click", function () {
          var shouldOpen = trigger.getAttribute("aria-expanded") !== "true";
          triggers.forEach(function (other) {
            if (other !== trigger && other.getAttribute("aria-expanded") === "true") closeItem(other);
          });
          shouldOpen ? openItem(trigger) : closeItem(trigger);
        });
      });
    });
  }

  function initCardSwipers() {
    if (!window.Swiper) return;
    document.querySelectorAll("[data-card-swiper]").forEach(function (element) {
      if (element.dataset.swiperReady === "true") return;
      var section = element.closest("[data-swiper-section]");
      var prev = section ? section.querySelector("[data-swiper-prev]") : null;
      var next = section ? section.querySelector("[data-swiper-next]") : null;
      var pagination = section ? section.querySelector("[data-swiper-pagination]") : null;
      new window.Swiper(element, {
        speed: 650,
        spaceBetween: 18,
        slidesPerView: 1.08,
        keyboard: { enabled: true, onlyInViewport: true },
        navigation: { prevEl: prev || undefined, nextEl: next || undefined },
        pagination: { el: pagination || undefined, clickable: true },
        breakpoints: {
          640: { slidesPerView: 1.35, spaceBetween: 22 },
          900: { slidesPerView: 2.1, spaceBetween: 26 },
          1280: { slidesPerView: 2.7, spaceBetween: 30 }
        },
        a11y: { enabled: true }
      });
      element.dataset.swiperReady = "true";
    });
  }

  function initServiceDecks() {
    document.querySelectorAll("[data-service-deck]").forEach(function (deck) {
      if (deck.dataset.serviceDeckReady === "true") return;
      deck.dataset.serviceDeckReady = "true";
      var cards = [].slice.call(deck.querySelectorAll(".service-deck__card"));
      var activeIndex = Math.max(0, cards.findIndex(function (card) { return card.classList.contains("is-open"); }));
      if (!cards.length) return;

      function setCard(card, open) {
        var toggle = card.querySelector("[data-service-card-toggle]");
        card.classList.toggle("is-open", open);
        if (toggle) toggle.setAttribute("aria-expanded", String(open));
      }

      function openCard(card) {
        activeIndex = cards.indexOf(card);
        if (activeIndex < 0) activeIndex = 0;
        cards.forEach(function (item) { setCard(item, item === card); });
      }

      cards.forEach(function (card) {
        var toggle = card.querySelector("[data-service-card-toggle]");
        if (toggle) {
          toggle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            openCard(card);
          });
        }
        card.addEventListener("click", function (event) {
          if (event.target.closest("a, button")) return;
          openCard(card);
        });
      });

      function stepCards(direction) {
        var nextIndex = (activeIndex + direction + cards.length) % cards.length;
        openCard(cards[nextIndex]);
        var toggle = cards[nextIndex].querySelector("[data-service-card-toggle]");
        if (toggle) toggle.focus({ preventScroll: true });
      }

      deck.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          stepCards(-1);
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          stepCards(1);
          return;
        }
      });

      openCard(cards[activeIndex]);
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-method-switcher], [data-interactive-tabs]").forEach(function (switcher) {
      if (switcher.dataset.tabsReady === "true") return;
      switcher.dataset.tabsReady = "true";
      var tabs = [].slice.call(switcher.querySelectorAll('[role="tab"]'));
      function activate(tab, moveFocus) {
        tabs.forEach(function (item) {
          var selected = item === tab;
          var panel = document.getElementById(item.getAttribute("aria-controls"));
          item.setAttribute("aria-selected", String(selected));
          item.tabIndex = selected ? 0 : -1;
          if (panel) {
            panel.setAttribute("aria-hidden", String(!selected));
            if (selected) panel.removeAttribute("inert");
            else panel.setAttribute("inert", "");
          }
        });
        if (moveFocus) tab.focus();
      }
      tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () { activate(tab, false); });
        tab.addEventListener("keydown", function (event) {
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].indexOf(event.key) === -1) return;
          event.preventDefault();
          var next = index;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = tabs.length - 1;
          activate(tabs[next], true);
        });
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          tab.addEventListener("mouseenter", function () { activate(tab, false); });
        }
      });
    });
  }

  function initSpotlights() {
    document.querySelectorAll("[data-spotlight]").forEach(function (spotlight) {
      if (spotlight.dataset.spotlightReady === "true") return;
      spotlight.dataset.spotlightReady = "true";
      var image = spotlight.querySelector("[data-spotlight-image]");
      var copy = spotlight.querySelector("[data-spotlight-copy]");
      var buttons = [].slice.call(spotlight.querySelectorAll("[data-spotlight-option]"));
      function activate(button) {
        buttons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
        if (image && button.dataset.image) image.src = button.dataset.image;
        if (image && button.dataset.alt) image.alt = button.dataset.alt;
        if (copy && button.dataset.copy) copy.textContent = button.dataset.copy;
      }
      buttons.forEach(function (button) {
        button.addEventListener("click", function () { activate(button); });
        button.addEventListener("focus", function () { activate(button); });
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) button.addEventListener("mouseenter", function () { activate(button); });
      });
    });
  }

  function initExpandingGalleries() {
    document.querySelectorAll("[data-expanding-gallery]").forEach(function (gallery) {
      if (gallery.dataset.galleryReady === "true") return;
      gallery.dataset.galleryReady = "true";
      var items = [].slice.call(gallery.querySelectorAll(".expanding-gallery__item"));
      items.forEach(function (item) {
        item.addEventListener("click", function () {
          items.forEach(function (other) { other.dataset.active = String(other === item); });
        });
      });
    });
  }

  function initParallaxMedia() {
    var items = [].slice.call(document.querySelectorAll("[data-parallax-media]"));
    if (!items.length || document.documentElement.dataset.parallaxReady === "true") return;
    document.documentElement.dataset.parallaxReady = "true";
    var coarse = window.matchMedia("(pointer: coarse)");
    if (reduceMotion.matches || coarse.matches || window.innerWidth < 992) return;
    var frame = 0;
    function update() {
      frame = 0;
      var viewport = window.innerHeight;
      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) return;
        var progress = (viewport - rect.top) / (viewport + rect.height);
        var offset = Math.max(-48, Math.min(48, (progress - 0.5) * 96));
        item.style.setProperty("--parallax-y", offset + "px");
      });
    }
    function requestUpdate() { if (!frame) frame = window.requestAnimationFrame(update); }
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    requestUpdate();
  }

  function initParticles() {
    document.querySelectorAll("[data-particle-canvas]").forEach(function (canvas) {
      if (canvas.dataset.particlesReady === "true") return;
      canvas.dataset.particlesReady = "true";
      var light = canvas.dataset.particleTheme === "light";
      var accentColor = light ? "#a3a94d" : "#d2d778";
      var dotColor = light ? "rgba(17,21,19,.22)" : "rgba(247,248,244,.74)";
      var lineRgb = light ? "17,21,19" : "229,232,226";
      var lineAlpha = light ? 0.09 : 0.16;
      var context = canvas.getContext("2d");
      var host = canvas.parentElement;
      var points = [];
      var frame = 0;
      var running = true;
      var pointer = { x: -1000, y: -1000 };

      function resize() {
        var scale = Math.min(window.devicePixelRatio || 1, 2);
        var rect = host.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(rect.width * scale));
        canvas.height = Math.max(1, Math.floor(rect.height * scale));
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        context.setTransform(scale, 0, 0, scale, 0, 0);
        var count = window.innerWidth < 768 ? 24 : 46;
        points = Array.from({ length: count }, function (_, index) {
          return {
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            accent: index % 7 === 0
          };
        });
      }

      function draw() {
        if (!running) return;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        context.clearRect(0, 0, width, height);
        points.forEach(function (point, index) {
          if (!reduceMotion.matches) {
            point.x += point.vx;
            point.y += point.vy;
            if (point.x < 0 || point.x > width) point.vx *= -1;
            if (point.y < 0 || point.y > height) point.vy *= -1;
            var dx = point.x - pointer.x;
            var dy = point.y - pointer.y;
            var distance = Math.hypot(dx, dy);
            if (distance < 110 && distance > 0) {
              point.x += (dx / distance) * 0.12;
              point.y += (dy / distance) * 0.12;
            }
          }
          context.beginPath();
          context.arc(point.x, point.y, point.accent ? 1.8 : 1.25, 0, Math.PI * 2);
          context.fillStyle = point.accent ? accentColor : dotColor;
          context.fill();
          for (var next = index + 1; next < points.length; next += 1) {
            var other = points[next];
            var lineDistance = Math.hypot(point.x - other.x, point.y - other.y);
            if (lineDistance > 118) continue;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = "rgba(" + lineRgb + "," + ((1 - lineDistance / 118) * lineAlpha) + ")";
            context.lineWidth = 0.6;
            context.stroke();
          }
        });
        if (!reduceMotion.matches) frame = window.requestAnimationFrame(draw);
      }

      resize();
      draw();
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        host.addEventListener("pointermove", function (event) {
          var rect = host.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
        });
        host.addEventListener("pointerleave", function () { pointer.x = -1000; pointer.y = -1000; });
      }
      window.addEventListener("resize", resize, { passive: true });
      if ("IntersectionObserver" in window && !reduceMotion.matches) {
        new IntersectionObserver(function (entries) {
          running = entries[0].isIntersecting;
          if (running && !frame) frame = window.requestAnimationFrame(draw);
          if (!running && frame) { window.cancelAnimationFrame(frame); frame = 0; }
        }, { threshold: 0 }).observe(host);
      }
    });
  }

  function initApp() {
    if (document.documentElement.dataset.appReady === "true") return;
    document.documentElement.dataset.appReady = "true";
    safeInit("mobile menu", initMobileMenu);
    safeInit("accordions", initAccordions);
    safeInit("card swipers", initCardSwipers);
    safeInit("service decks", initServiceDecks);
    safeInit("tabs", initTabs);
    safeInit("spotlights", initSpotlights);
    safeInit("expanding galleries", initExpandingGalleries);
    safeInit("parallax media", initParallaxMedia);
    safeInit("particles", initParticles);
    safeInit("icons", function () { if (window.lucide) window.lucide.createIcons(); });
    safeInit("scroll reveals", function () { if (window.AOS) window.AOS.init({ once: true, duration: 700, offset: 70, easing: "ease-out-cubic" }); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initApp);
  else initApp();
}());
