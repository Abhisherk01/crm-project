import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewTicket />} />
        <Route path="/tickets/:ticketId" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
}