(function () {
  "use strict";

  function initInquiryRoutes() {
    var select = document.querySelector("[data-inquiry-select]");
    if (!select) return;
    document.querySelectorAll("[data-inquiry-route]").forEach(function (route) {
      route.addEventListener("click", function () {
        var value = route.dataset.inquiryRoute;
        window.setTimeout(function () { select.value = value; select.dispatchEvent(new Event("change", { bubbles: true })); }, 0);
      });
    });
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form || form.dataset.formReady === "true") return;
    form.dataset.formReady = "true";
    var config = window.SITE_CONFIG || {};
    var messages = config.forms || {};
    var submitButton = form.querySelector("[data-submit-button]");
    var submitLabel = form.querySelector("[data-submit-label]");
    var status = form.querySelector("[data-form-status]");
    var sourcePage = form.querySelector("[data-source-page]");
    var initialLabel = messages.submitLabel || "Send Your Request";
    if (sourcePage) sourcePage.value = window.location.pathname.split("/").pop() || "contact.html";

    function setError(name, message) {
      var field = form.elements[name];
      var target = form.querySelector('[data-error-for="' + name + '"]');
      if (target) target.textContent = message || "";
      if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function clearErrors() {
      form.querySelectorAll("[data-error-for]").forEach(function (target) { target.textContent = ""; });
      form.querySelectorAll("[aria-invalid]").forEach(function (field) { field.setAttribute("aria-invalid", "false"); });
    }

    function validate() {
      clearErrors();
      var errors = {};
      var data = new FormData(form);
      if (!String(data.get("fullName") || "").trim()) errors.fullName = "Enter your full name.";
      var email = String(data.get("email") || "").trim();
      if (!email) errors.email = "Enter your email address.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
      if (!String(data.get("businessName") || "").trim()) errors.businessName = "Enter the business name.";
      var website = String(data.get("website") || "").trim();
      if (website) {
        try { new URL(website); } catch (error) { errors.website = "Enter a complete website address, including https://."; }
      }
      if (!String(data.get("serviceArea") || "").trim()) errors.serviceArea = "Enter the city or service area.";
      if (!String(data.get("inquiryType") || "")) errors.inquiryType = "Select an inquiry type.";
      if (!String(data.get("service") || "")) errors.service = "Select a service.";
      if (String(data.get("message") || "").trim().length < 20) errors.message = "Enter at least 20 characters so we can understand the request.";
      if (data.get("privacyConsent") !== "accepted") errors.privacyConsent = "Privacy consent is required before sending the request.";
      Object.keys(errors).forEach(function (name) { setError(name, errors[name]); });
      var first = Object.keys(errors)[0];
      if (first && form.elements[first]) form.elements[first].focus();
      return Object.keys(errors).length === 0;
    }

    function setLoading(loading) {
      if (submitButton) submitButton.disabled = loading;
      if (submitLabel) submitLabel.textContent = loading ? (messages.loadingLabel || "Sending Your Request…") : initialLabel;
      form.setAttribute("aria-busy", String(loading));
    }

    function showStatus(message, state) {
      if (!status) return;
      status.textContent = message;
      status.dataset.state = state;
      status.focus();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate() || form.getAttribute("aria-busy") === "true") return;
      showStatus("", "");
      setLoading(true);
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" }, credentials: "same-origin" })
        .then(function (response) { return response.json().catch(function () { throw new Error("The server returned an unreadable response."); }).then(function (payload) { return { response: response, payload: payload }; }); })
        .then(function (result) {
          if (!result.response.ok || !result.payload.success) {
            if (result.payload.errors) Object.keys(result.payload.errors).forEach(function (name) { setError(name, result.payload.errors[name]); });
            throw new Error(result.payload.message || messages.errorMessage || "Your request could not be sent. Please try again.");
          }
          form.reset();
          if (sourcePage) sourcePage.value = window.location.pathname.split("/").pop() || "contact.html";
          showStatus(result.payload.message, "success");
        })
        .catch(function (error) {
          showStatus(error.message || messages.networkErrorMessage || "A network error interrupted the request. Your information is still in the form; please try again.", "error");
        })
        .finally(function () { setLoading(false); });
    });
  }

  function initContact() {
    if (document.documentElement.dataset.contactReady === "true") return;
    document.documentElement.dataset.contactReady = "true";
    try { initInquiryRoutes(); } catch (error) { console.error("Nearloom component failed: inquiry routes", error); }
    try { initContactForm(); } catch (error) { console.error("Nearloom component failed: contact form", error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initContact); else initContact();
}());
