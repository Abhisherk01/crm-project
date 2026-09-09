import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../lib/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  // Results + UI states
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);       // very first load only
  const [refreshing, setRefreshing] = useState(false); // filter refetches
  const [error, setError] = useState("");

  // Filter controls
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");

  // Makes the very first fetch instant; every fetch after that is debounced.
  const isFirstRender = useRef(true);

  useEffect(() => {
    const controller = new AbortController();

    // First load: fetch immediately. Afterwards (typing / filtering):
    // wait 400ms of quiet before fetching — that's the debounce.
    const delay = isFirstRender.current ? 0 : 400;
    isFirstRender.current = false;

    const timer = setTimeout(() => {
      loadTickets(controller.signal);
    }, delay);

    // Cleanup: runs before every re-run of this effect and on unmount.
    // Cancels the pending timer AND any request still in flight, so a slow
    // older response can never arrive late and overwrite newer results.
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchInput, status]);

  async function loadTickets(signal) {
    setRefreshing(true);
    try {
      const data = await getTickets({ status, search: searchInput.trim() }, signal);
      setTickets(data); // ⚠️ same as Step 12: if your API wraps the list, use data.tickets
      setError("");
    } catch (err) {
      if (err.name === "AbortError") return; // superseded by a newer request — ignore
      setError(err.message);
    } finally {
      if (!signal.aborted) {
        setRefreshing(false);
        setLoading(false);
      }
    }
  }

  const filtersActive = searchInput.trim() !== "" || status !== "";

  function clearFilters() {
    setSearchInput("");
    setStatus("");
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Support<span className="text-yellow-400">Desk</span>
            </h1>
            <p className="mt-1 text-zinc-400">Customer support tickets</p>
          </div>
          <Link
            to="/new"
            className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-300"
          >
            + New Ticket
          </Link>
        </div>

        {/* Search + status filter bar */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search ID, customer, email, subject, description..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none transition-colors focus:border-yellow-400 sm:w-44"
          >
            <option value="">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              Clear
            </button>
          )}
        </div>

        {/* Loading state (first load only) */}
        {loading && <p className="mt-10 text-zinc-400">Loading tickets...</p>}

        {/* Error state */}
        {error && (
          <div className="mt-8 rounded-lg border border-red-500/50 bg-zinc-900 p-4 text-red-400">
            Could not load tickets: {error}
          </div>
        )}

        {/* Empty states — two different messages */}
        {!loading && !error && tickets.length === 0 && (
          <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900 p-10 text-center">
            {filtersActive ? (
              <>
                <p className="text-zinc-300">No tickets match your search.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-300"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="text-zinc-300">No tickets yet.</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Create your first ticket with the button above.
                </p>
              </>
            )}
          </div>
        )}

        {/* Result count + subtle refresh indicator */}
        {!loading && !error && tickets.length > 0 && (
          <p className="mt-4 text-sm text-zinc-500">
            Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
            {refreshing && <span className="ml-2 text-yellow-400">· updating…</span>}
          </p>
        )}

        {/* Ticket table (same as Step 12) */}
        {!loading && !error && tickets.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Ticket</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {tickets.map((ticket) => (
                  <tr key={ticket.ticket_id} className="hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/tickets/${ticket.ticket_id}`}
                        className="font-mono font-semibold text-yellow-400 hover:underline"
                      >
                        {ticket.ticket_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-100">{ticket.customer_name}</td>
                    <td className="px-4 py-3">
                      <span className="block max-w-xs truncate text-zinc-300">
                        {ticket.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatDate(ticket.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}