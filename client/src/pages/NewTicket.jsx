import { useState } from "react";
import { Link } from "react-router-dom";
import { createTicket } from "../lib/api.js";

// Same rule the backend enforces: something@something.something
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  customer_name: "",
  customer_email: "",
  subject: "",
  description: "",
};

export default function NewTicket() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // One handler for all four inputs — each input's `name` attribute
  // matches a key in our form state, so we can update generically.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    // Clear this field's error as soon as the user starts fixing it
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  // Mirrors the backend's POST validation rules.
  function validate() {
    const newErrors = {};
    if (!form.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required.";
    }
    if (!form.customer_email.trim()) {
      newErrors.customer_email = "Customer email is required.";
    } else if (!EMAIL_REGEX.test(form.customer_email.trim())) {
      newErrors.customer_email = "Enter a valid email address.";
    }
    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }
    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser's full-page reload
    if (submitting) return; // guard against double-submits (e.g. Enter key)
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // invalid → don't call the API at all
    }

    setSubmitting(true);
    try {
      const data = await createTicket({
        customer_name: form.customer_name.trim(),
        customer_email: form.customer_email.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
      });
      setSuccessData(data); // { ticket_id, created_at }
    } catch (err) {
      setApiError(err.message); // readable message from lib/api.js
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setApiError("");
    setSuccessData(null);
  }

  // ---- SUCCESS SCREEN (replaces the form after a successful create) ----
  if (successData) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="mx-auto max-w-xl">
          <div className="rounded-lg border border-yellow-400/50 bg-zinc-900 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-2xl font-bold text-black">
              ✓
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Ticket created!</h1>
            <p className="mt-2 text-zinc-400">
              Ticket ID:{" "}
              <span className="font-mono text-lg font-semibold text-yellow-400">
                {successData.ticket_id}
              </span>
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to={`/tickets/${successData.ticket_id}`}
                className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-300"
              >
                View ticket
              </Link>
              <button
                onClick={resetForm}
                className="rounded-lg border border-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                Create another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- FORM SCREEN ----
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-xl">
        <Link to="/" className="text-sm text-zinc-400 hover:text-yellow-400">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">New Ticket</h1>
        <p className="mt-1 text-zinc-400">Log a new customer support request.</p>

        {/* API-level error (e.g. server down) */}
        {apiError && (
          <div className="mt-6 rounded-lg border border-red-500/50 bg-zinc-900 p-4 text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="customer_name" className="mb-1.5 block text-sm font-medium text-zinc-200">
              Customer name <span className="text-yellow-400">*</span>
            </label>
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              value={form.customer_name}
              onChange={handleChange}
              placeholder="e.g. Sarah Mitchell"
              className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 ${
                errors.customer_name ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {errors.customer_name && (
              <p className="mt-1 text-sm text-red-400">{errors.customer_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="customer_email" className="mb-1.5 block text-sm font-medium text-zinc-200">
              Customer email <span className="text-yellow-400">*</span>
            </label>
            <input
              id="customer_email"
              name="customer_email"
              type="email"
              value={form.customer_email}
              onChange={handleChange}
              placeholder="e.g. sarah.mitchell@example.com"
              className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 ${
                errors.customer_email ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {errors.customer_email && (
              <p className="mt-1 text-sm text-red-400">{errors.customer_email}</p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-zinc-200">
              Subject <span className="text-yellow-400">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="Short summary of the issue"
              className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 ${
                errors.subject ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-200">
              Description <span className="text-yellow-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Full details of the problem..."
              className={`w-full resize-y rounded-lg border bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 ${
                errors.description ? "border-red-500" : "border-zinc-700"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-yellow-400 px-5 py-2 font-semibold text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Ticket"}
            </button>
            <Link
              to="/"
              className="rounded-lg border border-zinc-700 px-5 py-2 font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}