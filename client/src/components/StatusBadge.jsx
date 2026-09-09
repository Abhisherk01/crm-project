// Small colored pill that shows a ticket's status.
const BADGE_STYLES = {
    Open: "bg-yellow-400 text-black",
    "In Progress": "bg-white text-black",
    Closed: "bg-zinc-700 text-zinc-300",
  };
  
  export default function StatusBadge({ status }) {
    const style = BADGE_STYLES[status] || "bg-zinc-700 text-zinc-300";
  
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
        {status}
      </span>
    );
  }