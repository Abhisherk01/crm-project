import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";

// Shared chrome (navbar + footer) wrapped around every page.
// <Outlet /> marks the spot where the matched child route renders.
function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        SupportDesk — Customer Support Ticketing CRM
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewTicket />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}