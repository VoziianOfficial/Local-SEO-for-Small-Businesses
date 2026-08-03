(function () {
  "use strict";
  function initChecklist() {
    var checklist = document.querySelector("[data-checklist]");
    if (!checklist || checklist.dataset.checklistReady === "true") return;
    checklist.dataset.checklistReady = "true";
    var inputs = [].slice.call(checklist.querySelectorAll('input[type="checkbox"]'));
    var count = document.querySelector("[data-checklist-count]");
    var bar = document.querySelector("[data-checklist-bar]");
    function update() {
      var checked = inputs.filter(function (input) { return input.checked; }).length;
      if (count) count.textContent = checked + " of " + inputs.length + " reviewed";
      if (bar) bar.style.setProperty("--checklist-progress", ((checked / inputs.length) * 100) + "%");
    }
    inputs.forEach(function (input) { input.addEventListener("change", update); });
    update();
  }

  function initServiceFilterGallery() {
    var gallery = document.querySelector(".service-filter-gallery");
    if (!gallery || gallery.dataset.filterReady === "true") return;

    gallery.dataset.filterReady = "true";

    var filters = [].slice.call(gallery.querySelectorAll("[data-service-filter]"));
    var cards = [].slice.call(gallery.querySelectorAll("[data-service-category]"));
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var filterTimer = null;

    function applyFilter(selectedFilter) {
      window.clearTimeout(filterTimer);

      cards.forEach(function (card) {
        var shouldShow = selectedFilter === "all" || card.dataset.serviceCategory === selectedFilter;

        if (shouldShow) {
          card.hidden = false;
          window.requestAnimationFrame(function () {
            card.classList.remove("is-filtering-out");
          });
          return;
        }

        if (reduceMotion) {
          card.hidden = true;
          return;
        }

        card.classList.add("is-filtering-out");
        filterTimer = window.setTimeout(function () {
          if (card.classList.contains("is-filtering-out")) card.hidden = true;
        }, 260);
      });
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        var selectedFilter = button.dataset.serviceFilter;

        filters.forEach(function (filterButton) {
          var isActive = filterButton === button;
          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        applyFilter(selectedFilter);
      });
    });
  }

  function initInsights() { if (document.documentElement.dataset.insightsReady === "true") return; document.documentElement.dataset.insightsReady = "true"; try { initChecklist(); } catch (error) { console.error("Nearloom component failed: checklist", error); } try { initServiceFilterGallery(); } catch (error) { console.error("Nearloom component failed: service filter gallery", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initInsights); else initInsights();
}());
