(function () {
  "use strict";

  function initSignalStories() {
    var swiperElement = document.querySelector("[data-signal-swiper]");
    if (!swiperElement || !window.Swiper) return;
    if (swiperElement.dataset.swiperReady === "true") return;
    var slides = swiperElement.querySelectorAll(".swiper-slide");

    var signalSwiper = new window.Swiper(swiperElement, {
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      initialSlide: Math.floor(slides.length / 2),
      observer: true,
      observeParents: true,
      slidesPerView: "auto",
      spaceBetween: 18,
      speed: 800,
      slideToClickedSlide: true,
      keyboard: { enabled: true, onlyInViewport: true },
      pagination: { el: "[data-signal-pagination]", clickable: true },
      a11y: { enabled: true }
    });

    swiperElement.signalSwiper = signalSwiper;
    var slideTo = signalSwiper.slideTo.bind(signalSwiper);
    signalSwiper.slideNext = function () {
      slideTo((signalSwiper.activeIndex + 1) % slides.length);
    };
    signalSwiper.slidePrev = function () {
      slideTo((signalSwiper.activeIndex - 1 + slides.length) % slides.length);
    };

    function centerMiddleSlide() {
      if (typeof signalSwiper.update === "function") signalSwiper.update();
      if (typeof signalSwiper.slideToLoop === "function") {
        signalSwiper.slideToLoop(Math.floor(slides.length / 2), 0);
      } else {
        slideTo(Math.floor(slides.length / 2), 0);
      }
    }
    window.setTimeout(centerMiddleSlide, 120);
    window.setTimeout(centerMiddleSlide, 900);

    swiperElement.addEventListener("click", function (event) {
      var slide = event.target.closest(".swiper-slide");
      if (!slide || slide.classList.contains("swiper-slide-active")) return;
      event.preventDefault();
      if (typeof signalSwiper.slideToLoop === "function" && slide.dataset.swiperSlideIndex) {
        signalSwiper.slideToLoop(Number(slide.dataset.swiperSlideIndex));
      } else {
        slideTo(Array.prototype.indexOf.call(slides, slide));
      }
    });

    swiperElement.dataset.swiperReady = "true";
  }

  function initMethodCube() {
    var stage = document.querySelector("[data-method-cube]");
    var card = document.querySelector("[data-method-card]");
    var switcher = document.querySelector("[data-method-switcher]");
    if (!stage || !card || !switcher || stage.dataset.cubeReady === "true") return;
    stage.dataset.cubeReady = "true";
    var tabs = [].slice.call(switcher.querySelectorAll('[role="tab"]'));
    var selectedRotation = 0;
    var tiltX = 0;
    var tiltY = 0;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartRotation = 0;
    var dragStartTilt = 0;
    var dragging = false;

    function setDepth() {
      card.style.setProperty("--cube-depth", (card.clientWidth / 2) + "px");
    }

    function renderRotation() {
      stage.style.transform = "rotateX(" + tiltX + "deg) rotateY(" + (selectedRotation + tiltY) + "deg)";
    }

    function normalizeIndex(index) {
      return ((index % tabs.length) + tabs.length) % tabs.length;
    }

    function activateFace(index) {
      var activeIndex = normalizeIndex(index);
      tabs.forEach(function (item, itemIndex) {
        var selected = itemIndex === activeIndex;
        var panel = document.getElementById(item.getAttribute("aria-controls"));
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
        if (!panel) return;
        panel.setAttribute("aria-hidden", String(!selected));
        if (selected) panel.removeAttribute("inert");
        else panel.setAttribute("inert", "");
      });
    }

    function applyRotation() {
      var index = tabs.findIndex(function (tab) { return tab.getAttribute("aria-selected") === "true"; });
      selectedRotation = -Math.max(index, 0) * 90;
      renderRotation();
    }

    function requestRotation() {
      window.requestAnimationFrame(applyRotation);
    }

    setDepth();
    applyRotation();
    window.addEventListener("resize", setDepth, { passive: true });
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      card.addEventListener("pointermove", function (event) {
        if (dragging) return;
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        tiltX = Math.max(-10, Math.min(10, y * -18));
        tiltY = Math.max(-10, Math.min(10, x * 18));
        renderRotation();
      });
      card.addEventListener("pointerleave", function () {
        if (dragging) return;
        tiltX = 0;
        tiltY = 0;
        renderRotation();
      });
    }
    card.addEventListener("pointerdown", function (event) {
      dragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartRotation = selectedRotation;
      dragStartTilt = tiltX;
      tiltY = 0;
      card.setPointerCapture(event.pointerId);
      card.dataset.dragging = "true";
    });
    card.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      selectedRotation = dragStartRotation + ((event.clientX - dragStartX) * 0.45);
      tiltX = Math.max(-24, Math.min(24, dragStartTilt - ((event.clientY - dragStartY) * 0.18)));
      renderRotation();
    });
    function finishDrag(event) {
      if (!dragging) return;
      dragging = false;
      if (card.hasPointerCapture && card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
      selectedRotation = Math.round(selectedRotation / 90) * 90;
      tiltX = 0;
      tiltY = 0;
      card.dataset.dragging = "false";
      activateFace(Math.round(-selectedRotation / 90));
      renderRotation();
    }
    card.addEventListener("pointerup", finishDrag);
    card.addEventListener("pointercancel", finishDrag);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", requestRotation);
      tab.addEventListener("mouseenter", requestRotation);
      tab.addEventListener("keydown", requestRotation);
    });
    new MutationObserver(applyRotation).observe(switcher, {
      attributes: true,
      attributeFilter: ["aria-selected"],
      subtree: true
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const switcherSection = document.querySelector(".insight-switcher");

    if (!switcherSection) return;


    const tabs = switcherSection.querySelectorAll(".insight-switcher__tab");
    const panels = switcherSection.querySelectorAll(".insight-switcher__content");

    const activateTab = (targetId) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.target === targetId;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateTab(tab.dataset.target);
      });

      tab.addEventListener("keydown", (event) => {
        const tabsArray = Array.from(tabs);
        const currentIndex = tabsArray.indexOf(tab);
        let nextIndex = currentIndex;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabsArray.length;
          event.preventDefault();
        }

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
          event.preventDefault();
        }

        if (nextIndex !== currentIndex) {
          tabsArray[nextIndex].focus();
          activateTab(tabsArray[nextIndex].dataset.target);
        }
      });
    });


    const counters = switcherSection.querySelectorAll("[data-counter]");
    let countersStarted = false;

    const animateCounter = (element) => {
      const target = Number(element.dataset.counter);
      const duration = 1600;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * eased);

        element.textContent = currentValue.toLocaleString("en-US");

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = target.toLocaleString("en-US");
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach(animateCounter);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    counterObserver.observe(switcherSection);
  });

  function initHome() {
    if (document.documentElement.dataset.homeReady === "true") return;
    document.documentElement.dataset.homeReady = "true";
    try { initSignalStories(); } catch (error) { console.error("Nearloom component failed: signal stories", error); }
    try { initMethodCube(); } catch (error) { console.error("Nearloom component failed: method cube", error); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHome);
  else initHome();
}());
