(function () {
  "use strict";
  var observer;
  window.AOS = {
    init: function (options) {
      var settings = options || {};
      var elements = [].slice.call(document.querySelectorAll("[data-aos]"));
      if (!elements.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        elements.forEach(function (item) { item.classList.add("aos-animate"); });
        return;
      }
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("aos-animate");
          if (settings.once !== false) currentObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -" + (settings.offset || 70) + "px 0px", threshold: 0.01 });
      document.documentElement.classList.add("aos-enabled");
      elements.forEach(function (item) {
        item.style.transitionDuration = String(settings.duration || 700) + "ms";
        item.style.transitionTimingFunction = "cubic-bezier(.22,.61,.36,1)";
        var delay = Number(item.getAttribute("data-aos-delay") || 0);
        if (delay) item.style.transitionDelay = delay + "ms";
        observer.observe(item);
      });
    },
    refresh: function () { window.AOS.init({ once: true, duration: 700, offset: 70 }); }
  };
}());
