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
  function initInsights() { if (document.documentElement.dataset.insightsReady === "true") return; document.documentElement.dataset.insightsReady = "true"; try { initChecklist(); } catch (error) { console.error("Nearloom component failed: checklist", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initInsights); else initInsights();
}());
