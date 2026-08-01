(function () {
  "use strict";

  function getValue(source, path) {
    return path.split(".").reduce(function (value, key) {
      return value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined;
    }, source);
  }

  function renderText(config) {
    document.querySelectorAll("[data-config]").forEach(function (element) {
      var value = getValue(config, element.dataset.config);
      if (typeof value === "string") element.textContent = value;
    });
  }

  function renderAttributes(config) {
    document.querySelectorAll("[data-config-href]").forEach(function (element) {
      var value = getValue(config, element.dataset.configHref);
      if (typeof value === "string") element.setAttribute("href", value);
    });
    var favicon = document.querySelector('link[rel="icon"]');
    if (favicon && config.brand && config.brand.favicon) favicon.href = config.brand.favicon;
  }

  function renderEmail(config) {
    document.querySelectorAll("[data-config-email]").forEach(function (element) {
      element.textContent = config.contact.recipientEmail;
      if (element.tagName === "A") element.href = "mailto:" + config.contact.recipientEmail;
    });
  }

  function renderNavigation(config) {
    var current = document.body.dataset.navSection || window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-index]").forEach(function (link) {
      var item = config.navigation.items[Number(link.dataset.navIndex)];
      if (!item) return;
      link.textContent = item.label;
      link.href = item.href;
      if (item.href === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function renderStructuredData(config) {
    var script = document.querySelector("[data-organization-json]");
    if (!script) return;
    var canonicalOrigin = "https://nearloomlocal.com/";
    var organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": config.brand.legalName,
      "alternateName": config.brand.name,
      "url": canonicalOrigin,
      "logo": new URL(config.brand.logoDark, canonicalOrigin).href,
      "email": config.contact.recipientEmail,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": config.contact.address
      },
      "description": config.brand.tagline
    };
    script.textContent = JSON.stringify(organization);
  }

  function renderServices(config) {
    document.querySelectorAll("[data-service-index]").forEach(function (link) {
      var service = config.services[Number(link.dataset.serviceIndex)];
      if (!service) return;
      link.textContent = service.name;
      link.href = service.href;
    });
  }

  function renderLegal(config) {
    document.querySelectorAll("[data-legal-index]").forEach(function (link) {
      var item = config.legal.links[Number(link.dataset.legalIndex)];
      if (!item) return;
      link.textContent = item.label;
      link.href = item.href;
    });
  }

  function renderSelect(select, values, placeholder) {
    if (!select || !Array.isArray(values)) return;
    var selected = select.value;
    select.innerHTML = "";
    var first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
    if (values.indexOf(selected) !== -1) select.value = selected;
  }

  function renderForm(config) {
    renderSelect(document.querySelector("[data-inquiry-select]"), config.forms.inquiryTypes, "Select an inquiry type");
    renderSelect(document.querySelector("[data-service-select]"), config.forms.serviceOptions, "Select a service");
    var consent = document.querySelector("[data-config-consent]");
    if (consent) consent.textContent = config.forms.privacyLabel;
  }

  function initConfigRender() {
    var config = window.SITE_CONFIG;
    if (!config || document.documentElement.dataset.configReady === "true") return;
    document.documentElement.dataset.configReady = "true";
    renderText(config);
    renderAttributes(config);
    renderEmail(config);
    renderNavigation(config);
    renderServices(config);
    renderLegal(config);
    renderForm(config);
    renderStructuredData(config);
    document.dispatchEvent(new CustomEvent("nearloom:config-ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initConfigRender);
  else initConfigRender();
}());
