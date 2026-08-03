(function () {
  "use strict";
  function initScopeBuilder() {
    var builder = document.querySelector("[data-scope-builder]");
    if (!builder || builder.dataset.scopeReady === "true") return;
    builder.dataset.scopeReady = "true";
    var choices = [].slice.call(builder.querySelectorAll("[data-scope-choice]"));
    var summary = builder.querySelector("[data-scope-summary]");

    

    function update() {
      var selected = choices.filter(function (button) { return button.getAttribute("aria-pressed") === "true"; }).map(function (button) { return button.dataset.scopeChoice; });
      if (!summary) return;
      summary.textContent = selected.length ? "Selected areas: " + selected.join(", ") + "." : "Select one or more areas to shape a clearer starting conversation.";
    }
    choices.forEach(function (button) { button.addEventListener("click", function () { button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true")); update(); }); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const workSwiperElement = document.querySelector("[data-work-swiper]");

    if (workSwiperElement && typeof Swiper !== "undefined") {
      const workSwiper = new Swiper(workSwiperElement, {
        loop: true,
        speed: 750,
        spaceBetween: 18,
        slidesPerView: 1,
        grabCursor: true,
        simulateTouch: true,
        allowTouchMove: true,
        touchEventsTarget: "container",
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
          0: {
            slidesPerView: 1,
            spaceBetween: 18
          },
          560: {
            slidesPerView: 1,
            spaceBetween: 18
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 22
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 24
          }
        }
      });

      if (workSwiper.autoplay && typeof workSwiper.autoplay.start === "function") {
        workSwiper.autoplay.start();
      }
    }

    const reviewsSwiperElement = document.querySelector("[data-services-reviews-swiper]");

    if (!reviewsSwiperElement || typeof Swiper === "undefined") return;

    const reviewsSwiper = new Swiper(reviewsSwiperElement, {
      loop: true,
      speed: 700,
      spaceBetween: 18,
      slidesPerView: 1,
      slidesPerGroup: 1,
      centeredSlides: false,
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: true,
      touchEventsTarget: "container",
      watchOverflow: false,
      loopAdditionalSlides: 2,
      observer: true,
      observeParents: true,

      autoplay: {
        delay: 2600,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },

      pagination: {
        el: ".services-reviews__pagination",
        clickable: true
      },

      navigation: {
        nextEl: ".services-reviews__arrow--next",
        prevEl: ".services-reviews__arrow--prev"
      },

      keyboard: {
        enabled: true,
        onlyInViewport: true
      },

      mousewheel: {
        forceToAxis: true
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 18
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        992: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1200: {
          slidesPerView: 2,
          spaceBetween: 26
        }
      }
    });

    if (reviewsSwiper.autoplay && typeof reviewsSwiper.autoplay.start === "function") {
      reviewsSwiper.autoplay.start();
    }
  });

  function initServices() { if (document.documentElement.dataset.servicesReady === "true") return; document.documentElement.dataset.servicesReady = "true"; try { initScopeBuilder(); } catch (error) { console.error("Nearloom component failed: scope builder", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initServices); else initServices();
}());
