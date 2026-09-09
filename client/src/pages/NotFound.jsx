import { Link } from "react-router-dom";

// Catch-all page for URLs that match no route (e.g. /hello).
// Rendered by the path="*" route in App.jsx.
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-10 text-center">
        <p className="font-mono text-5xl font-bold text-yellow-400">404</p>
        <h1 className="mt-3 text-xl font-bold text-white">Page not found</h1>
        <p className="mt-2 text-zinc-400">
          The page you&rsquo;re looking for doesn&rsquo;t exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-300"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}