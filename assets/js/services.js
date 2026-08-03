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
    const reviewsSwiperElement = document.querySelector("[data-services-reviews-swiper]");

    if (!reviewsSwiperElement || typeof Swiper === "undefined") return;

    new Swiper(reviewsSwiperElement, {
      loop: true,
      speed: 700,
      spaceBetween: 18,
      slidesPerView: 1,
      centeredSlides: false,
      grabCursor: true,
      watchOverflow: false,
      observer: true,
      observeParents: true,

      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },

      pagination: {
        el: ".services-reviews__pagination",
        clickable: true
      },

      navigation: {
        nextEl: ".services-reviews__arrow--next",
        prevEl: ".services-reviews__arrow--prev"
      },

      breakpoints: {
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
  });

  function initServices() { if (document.documentElement.dataset.servicesReady === "true") return; document.documentElement.dataset.servicesReady = "true"; try { initScopeBuilder(); } catch (error) { console.error("Nearloom component failed: scope builder", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initServices); else initServices();
}());
