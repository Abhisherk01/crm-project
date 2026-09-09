import { Link, NavLink } from "react-router-dom";

// NavLink's className can be a function receiving { isActive },
// so we can highlight the page the user is currently on.
// `end` on the "/" link stops it from matching every URL
// (every path starts with "/", so without `end` it would always be active).
function navLinkClass({ isActive }) {
  return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-yellow-400 text-black"
      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
  }`;
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link to="/" className="text-lg font-bold text-white">
          Support<span className="text-yellow-400">Desk</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/new" className={navLinkClass}>
            New Ticket
          </NavLink>
        </nav>
      </div>
    </header>
  );
}