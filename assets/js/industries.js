(function () {
  "use strict";
  function initMomentMosaic() {
    var mosaic = document.querySelector("[data-moment-mosaic]");
    if (!mosaic || mosaic.dataset.mosaicReady === "true") return;
    mosaic.dataset.mosaicReady = "true";
    var buttons = [].slice.call(mosaic.querySelectorAll("button"));
    buttons.forEach(function (button) { button.addEventListener("click", function () { buttons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); }); }); });
  }
  function initBusinessSwiper() {
    var element = document.querySelector("[data-business-swiper]");
    if (!element || typeof Swiper === "undefined" || element.dataset.swiperReady === "true") return;
    element.dataset.swiperReady = "true";
    new Swiper(element, {
	      direction: window.innerWidth < 768 ? "horizontal" : "vertical",
	      loop: true,
      speed: 1000,
      effect: "slide",
      grabCursor: true,
      simulateTouch: true,
	      allowTouchMove: true,
	      touchEventsTarget: "container",
	      touchStartPreventDefault: false,
	      touchMoveStopPropagation: false,
	      threshold: 2,
	      touchRatio: 1.15,
	      longSwipesRatio: 0.18,
	      preventClicks: true,
	      preventClicksPropagation: true,
      observer: true,
      observeParents: true,
      pagination: {
        el: ".business-swiper__pagination",
        clickable: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      a11y: {
        enabled: true
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".service-filter-gallery");

    if (!gallery) return;

    const filters = gallery.querySelectorAll("[data-service-filter]");
    const cards = gallery.querySelectorAll("[data-service-category]");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let filterTimer = null;

    const applyFilter = (selectedFilter) => {
      window.clearTimeout(filterTimer);

      cards.forEach((card) => {
        const category = card.dataset.serviceCategory;
        const shouldShow =
          selectedFilter === "all" || category === selectedFilter;

        if (shouldShow) {
          card.hidden = false;

          requestAnimationFrame(() => {
            card.classList.remove("is-filtering-out");
          });
        } else if (reduceMotion) {
          card.hidden = true;
        } else {
          card.classList.add("is-filtering-out");

          filterTimer = window.setTimeout(() => {
            if (card.classList.contains("is-filtering-out")) {
              card.hidden = true;
            }
          }, 260);
        }
      });
    };

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedFilter = button.dataset.serviceFilter;

        filters.forEach((filterButton) => {
          const isActive = filterButton === button;

          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        applyFilter(selectedFilter);
      });
    });
  });
  function initWorkShowcase() {
    var element = document.querySelector("[data-work-swiper]");
    if (!element || typeof Swiper === "undefined" || element.dataset.swiperReady === "true") return;
    element.dataset.swiperReady = "true";
    var workSwiper = new Swiper(element, {
      loop: true,
      speed: 750,
      spaceBetween: 18,
      slidesPerView: 1,
      grabCursor: true,
      simulateTouch: true,
	      allowTouchMove: true,
	      touchEventsTarget: "container",
	      touchStartPreventDefault: false,
	      touchMoveStopPropagation: false,
	      threshold: 2,
	      touchRatio: 1.15,
	      longSwipesRatio: 0.18,
	      preventClicks: true,
	      preventClicksPropagation: true,
	      watchOverflow: false,
      loopAdditionalSlides: 2,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: 2200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      navigation: {
        nextEl: ".work-showcase__arrow--next",
        prevEl: ".work-showcase__arrow--prev"
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      a11y: {
        enabled: true
      },
      breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 18 },
        560: { slidesPerView: 1, spaceBetween: 18 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 22 },
        1280: { slidesPerView: 3, spaceBetween: 24 }
      }
    });
    if (workSwiper.autoplay && typeof workSwiper.autoplay.start === "function") workSwiper.autoplay.start();
  }
  function initIndustries() { if (document.documentElement.dataset.industriesReady === "true") return; document.documentElement.dataset.industriesReady = "true"; try { initMomentMosaic(); } catch (error) { console.error("Nearloom component failed: local moments", error); } try { initBusinessSwiper(); } catch (error) { console.error("Nearloom component failed: business swiper", error); } try { initWorkShowcase(); } catch (error) { console.error("Nearloom component failed: work showcase", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initIndustries); else initIndustries();
}());
