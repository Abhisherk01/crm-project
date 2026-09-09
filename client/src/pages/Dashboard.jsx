import { useEffect, useState } from "react";
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
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets();
        setTickets(data); // ⚠️ If your API wraps the list, use: setTickets(data.tickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

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

        {/* Loading state */}
        {loading && <p className="mt-10 text-zinc-400">Loading tickets...</p>}

        {/* Error state */}
        {error && (
          <div className="mt-10 rounded-lg border border-red-500/50 bg-zinc-900 p-4 text-red-400">
            Could not load tickets: {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && tickets.length === 0 && (
          <div className="mt-10 rounded-lg border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-zinc-300">No tickets yet.</p>
            <p className="mt-1 text-sm text-zinc-500">
              Create your first ticket with the button above.
            </p>
          </div>
        )}

        {/* Ticket table */}
        {!loading && !error && tickets.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
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