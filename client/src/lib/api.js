// Central place for talking to the backend.
// Pages import from here — they never call fetch directly.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Small helper: adds the base URL + JSON headers, and converts API errors
// into normal JavaScript Errors that pages can catch and display.
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Our API always returns { error: "..." } on failures.
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  return data;
}

export function getTickets({ status = "", search = "" } = {}, signal) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  const query = params.toString();
  return request(`/tickets${query ? `?${query}` : ""}`, { signal });
}

export function getTicket(ticketId) {
  return request(`/tickets/${encodeURIComponent(ticketId)}`);
}

export function createTicket(ticketData) {
  return request("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });
}

export function updateTicket(ticketId, updateData) {
  return request(`/tickets/${encodeURIComponent(ticketId)}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
}