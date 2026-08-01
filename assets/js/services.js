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
  function initServices() { if (document.documentElement.dataset.servicesReady === "true") return; document.documentElement.dataset.servicesReady = "true"; try { initScopeBuilder(); } catch (error) { console.error("Nearloom component failed: scope builder", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initServices); else initServices();
}());
