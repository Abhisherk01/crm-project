import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTicket, updateTicket } from "../lib/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

// Mirrors the backend's ALLOWED_STATUSES — the dropdown shows exactly
// what the API accepts, so a valid-looking choice never 400s.
const ALLOWED_STATUSES = ["Open", "In Progress", "Closed"];

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketDetail() {
  const { ticketId } = useParams();

  // Page-level state (the ticket itself)
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action-level state (status update)
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // Action-level state (add note)
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Load the ticket. Re-runs if the URL's :ticketId ever changes.
  useEffect(() => {
    async function loadTicket() {
      setLoading(true);
      setError("");
      try {
        const data = await getTicket(ticketId);
        setTicket(data); // ⚠️ If your API wraps it, use: setTicket(data.ticket);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [ticketId]);

  // After a successful update, re-fetch so the page always shows
  // exactly what the database has (PUT only returns success + timestamp).
  async function reloadTicket() {
    const data = await getTicket(ticketId);
    setTicket(data);
  }

  async function handleStatusChange(event) {
    const newStatus = event.target.value;
    if (!newStatus || newStatus === ticket.status) return; // no-op guard

    setStatusSaving(true);
    setStatusMessage("");
    setActionError("");
    try {
      await updateTicket(ticketId, { status: newStatus });
      await reloadTicket();
      setStatusMessage(`Status updated to "${newStatus}".`);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleAddNote(event) {
    event.preventDefault();
    if (addingNote) return; // double-submit guard
    if (!noteText.trim()) {
      setNoteError("Note cannot be empty.");
      return;
    }

    setAddingNote(true);
    setNoteError("");
    setActionError("");
    try {
      await updateTicket(ticketId, { note: noteText.trim() });
      setNoteText("");
      await reloadTicket(); // new note appears at the bottom of the timeline
    } catch (err) {
      setActionError(err.message);
    } finally {
      setAddingNote(false);
    }
  }

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <p className="text-zinc-400">Loading ticket...</p>
      </div>
    );
  }

  // ---- Error state (includes the 404 "not found" case) ----
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="mx-auto max-w-xl">
          <div className="rounded-lg border border-red-500/50 bg-zinc-900 p-8 text-center">
            <p className="text-red-400">{error}</p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-300"
            >
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Success state: the full ticket workspace ----
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="text-sm text-zinc-400 hover:text-yellow-400">
          ← Back to dashboard
        </Link>

        {/* Header: ID, badge, subject, timestamps */}
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-lg font-bold text-yellow-400">
              {ticket.ticket_id}
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">{ticket.subject}</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Created {formatDateTime(ticket.created_at)} · Updated{" "}
            {formatDateTime(ticket.updated_at)}
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN: description + notes */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-zinc-100">
                {ticket.description}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Notes ({ticket.notes ? ticket.notes.length : 0})
              </h2>

              {ticket.notes && ticket.notes.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {ticket.notes.map((note) => (
                    <li
                      key={note.id}
                      className="rounded-lg border-l-4 border-yellow-400 bg-zinc-950 p-4"
                    >
                      <p className="text-zinc-100">{note.note_text}</p>
                      <p className="mt-2 text-xs text-zinc-500">
                        {formatDateTime(note.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">
                  No notes yet. Add the first one below.
                </p>
              )}

              {/* Add-note form */}
              <form onSubmit={handleAddNote} className="mt-6" noValidate>
                <label
                  htmlFor="note_text"
                  className="mb-1.5 block text-sm font-medium text-zinc-200"
                >
                  Add a note
                </label>
                <textarea
                  id="note_text"
                  rows={3}
                  value={noteText}
                  onChange={(event) => {
                    setNoteText(event.target.value);
                    if (noteError) setNoteError("");
                  }}
                  placeholder="Internal notes about this ticket..."
                  className={`w-full resize-y rounded-lg border bg-zinc-950 px-3 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 ${
                    noteError ? "border-red-500" : "border-zinc-700"
                  }`}
                />
                {noteError && (
                  <p className="mt-1 text-sm text-red-400">{noteError}</p>
                )}
                <button
                  type="submit"
                  disabled={addingNote}
                  className="mt-3 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingNote ? "Adding..." : "Add Note"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: customer details + status control */}
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Customer
              </h2>
              <p className="mt-3 font-medium text-white">{ticket.customer_name}</p>
              <a
                href={`mailto:${ticket.customer_email}`}
                className="mt-1 block break-all text-sm text-yellow-400 hover:underline"
              >
                {ticket.customer_email}
              </a>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Status
              </h2>
              <select
                value={ticket.status}
                onChange={handleStatusChange}
                disabled={statusSaving}
                className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none transition-colors focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ALLOWED_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {statusSaving && (
                <p className="mt-2 text-sm text-zinc-400">Saving...</p>
              )}
              {statusMessage && (
                <p className="mt-2 text-sm text-yellow-400">{statusMessage}</p>
              )}

              {/* Action-level error: ticket stays visible, only this banner shows */}
              {actionError && (
                <p className="mt-2 text-sm text-red-400">
                  {actionError} — your change was not saved.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}