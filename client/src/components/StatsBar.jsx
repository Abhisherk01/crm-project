import { useEffect, useState } from "react";
import { getTickets } from "../lib/api.js";

// Dashboard statistics — the bonus feature.
// Fetches the FULL, unfiltered ticket list once when the dashboard loads,
// so these counts are always global: search and status filters change the
// table below, but never these numbers.

// Counts tickets per status with plain, readable filters.
function countByStatus(tickets) {
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
  };
}

export default function StatsBar() {
  // null = "not loaded yet" (or failed — same quiet treatment)
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getTickets(); // no filters = every ticket
        setStats(countByStatus(data)); // ⚠️ wrapped response? use countByStatus(data.tickets) — same as your Dashboard.jsx line
      } catch {
        setStats(null); // no error UI here on purpose: the ticket table
      } // below already shows the error card when the API is down.
    }
    loadStats();
  }, []); // empty deps: runs once on mount. Fresh numbers come free —
  // the dashboard remounts (and this re-runs) on every navigation back.

  // Renders nothing while loading or on failure — no flash, no banners.
  if (!stats) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Total */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Total tickets
          </p>
        </div>
        <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
      </div>

      {/* Open — yellow, matching the Open badge */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Open
          </p>
        </div>
        <p className="mt-2 text-3xl font-bold text-yellow-400">{stats.open}</p>
      </div>

      {/* In Progress — white, matching the In Progress badge */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            In Progress
          </p>
        </div>
        <p className="mt-2 text-3xl font-bold text-white">{stats.inProgress}</p>
      </div>

      {/* Closed — grey, matching the Closed badge */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Closed
          </p>
        </div>
        <p className="mt-2 text-3xl font-bold text-zinc-400">{stats.closed}</p>
      </div>
    </div>
  );
}