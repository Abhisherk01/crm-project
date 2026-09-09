import { useParams } from "react-router-dom";

export default function TicketDetail() {
  const { ticketId } = useParams();

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <h1 className="text-3xl font-bold text-white">
        Ticket <span className="text-yellow-400">{ticketId}</span>
      </h1>
      <p className="mt-2 text-zinc-400">Detail page arrives in Step 14.</p>
    </div>
  );
}