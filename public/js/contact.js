import { toast } from "./toast.js";

const endpoint = "/api/contact";

function setError(id, message) {
  const group = document.getElementById(`${id}Group`);
  const error = document.getElementById(`${id}Error`);
  const field = document.getElementById(id);
  group?.classList.add("has-error");
  if (error) error.textContent = message;
  field?.setAttribute("aria-invalid", "true");
}

function clearError(id) {
  document.getElementById(`${id}Group`)?.classList.remove("has-error");
  const error = document.getElementById(`${id}Error`);
  if (error) error.textContent = "";
  document.getElementById(id)?.removeAttribute("aria-invalid");
}

export function initContact() {
  const form = document.getElementById("projectForm");
  if (!form) return;

  const details = document.getElementById("details");
  const counter = document.getElementById("characterCount");
  const submit = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const formError = document.getElementById("formError");
  const formSuccess = document.getElementById("formSuccess");

  details?.addEventListener("input", () => {
    if (counter) counter.textContent = String(details.value.length);
    if (details.value.trim().length >= 20) clearError("details");
  });

  ["name", "email", "subject", "projectType"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", () => clearError(id));
    document.getElementById(id)?.addEventListener("change", () => clearError(id));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formError?.classList.remove("show");
    formSuccess?.classList.remove("show");
    ["name", "email", "subject", "projectType", "details"].forEach(clearError);

    if (form.website?.value.trim()) {
      formSuccess?.classList.add("show");
      form.reset();
      return;
    }

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject?.value.trim() || "",
      company: form.company?.value.trim() || "",
      projectType: form.projectType.value,
      budget: form.budget?.value || "",
      timeline: form.timeline.value,
      details: form.details.value.trim(),
      source: form.source.value
    };

    let first = "";
    if (!payload.name) { setError("name", "Please enter your name."); first = first || "name"; }
    if (!payload.email) { setError("email", "Please enter your email address."); first = first || "email"; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) { setError("email", "Please enter a valid email address."); first = first || "email"; }
    if (!payload.subject) { setError("subject", "Please add a subject."); first = first || "subject"; }
    if (!payload.projectType) { setError("projectType", "Please select a project type."); first = first || "projectType"; }
    if (!payload.details) { setError("details", "Please tell us about the project."); first = first || "details"; }
    else if (payload.details.length < 20) { setError("details", "Please provide at least 20 characters."); first = first || "details"; }

    if (first) {
      formError.classList.add("show");
      formError.querySelector("span").textContent = "Please fix the highlighted fields.";
      document.getElementById(first)?.focus();
      return;
    }

    submit.disabled = true;
    if (submitText) submitText.textContent = "Sending...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      let result = {};
      try { result = await response.json(); } catch { result = {}; }

      if (!response.ok) {
        throw new Error(result.message || "Unable to connect to the server.");
      }

      form.reset();
      if (counter) counter.textContent = "0";
      formSuccess?.classList.add("show");
      toast(result.message || "Message sent successfully.", "success");
      formSuccess?.scrollIntoView({ behavior: document.documentElement.dataset.motion === "reduced" ? "auto" : "smooth", block: "center" });
    } catch (error) {
      const message = navigator.onLine === false
        ? "You appear to be offline. Please try again."
        : (error.message || "Something went wrong. Please try again.");
      formError.classList.add("show");
      formError.querySelector("span").textContent = message;
      toast(message, "error");
    } finally {
      submit.disabled = false;
      if (submitText) submitText.textContent = "Send message";
    }
  });
}
