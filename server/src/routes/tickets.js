import express from "express";
import prisma from "../db.js";

const router = express.Router();

// Valid statuses a ticket can have (spec: Open / In Progress / Closed)
const ALLOWED_STATUSES = ["Open", "In Progress", "Closed"];

// Helper: generate the next ticket ID (TKT-001, TKT-002, ...)
async function generateTicketId() {
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { id: "desc" },
  });

  let nextNumber = 1;
  if (lastTicket) {
    nextNumber = parseInt(lastTicket.ticket_id.split("-")[1], 10) + 1;
  }

  return `TKT-${String(nextNumber).padStart(3, "0")}`;
}

// POST /api/tickets — create a new ticket
router.post("/", async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    const errors = [];

    if (!customer_name || typeof customer_name !== "string" || !customer_name.trim()) {
      errors.push("customer_name is required");
    }

    if (!customer_email || typeof customer_email !== "string" || !customer_email.trim()) {
      errors.push("customer_email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(customer_email.trim())) {
      errors.push("customer_email must be a valid email address");
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      errors.push("subject is required");
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      errors.push("description is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const ticket_id = await generateTicketId();

    const ticket = await prisma.ticket.create({
      data: {
        ticket_id,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim(),
        subject: subject.trim(),
        description: description.trim(),
      },
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Something went wrong while creating the ticket" });
  }
});

// GET /api/tickets — list all tickets
// Optional query params: ?status=Open  ?search=raj  (can be combined)
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;

    // Validate the status filter if it was provided
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    // Status filtering: exact match, done by the DATABASE
    const where = {};
    if (status) {
      where.status = status;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { created_at: "desc" }, // newest first
    });

    // Search: done in JAVASCRIPT because SQLite's "contains" is
    // case-sensitive, and users expect search to ignore UPPER/lower case.
    // Searches across: ticket ID, name, email, subject, description (per spec)
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.ticket_id.toLowerCase().includes(term) ||
          t.customer_name.toLowerCase().includes(term) ||
          t.customer_email.toLowerCase().includes(term) ||
          t.subject.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term)
      );
    }

    // Shape the response to exactly what the spec asks for
    const result = tickets.map((t) => ({
      ticket_id: t.ticket_id,
      customer_name: t.customer_name,
      subject: t.subject,
      status: t.status,
      created_at: t.created_at,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error listing tickets:", error);
    res.status(500).json({ error: "Something went wrong while fetching tickets" });
  }
});

// GET /api/tickets/:ticket_id — full ticket details including its notes
router.get("/:ticket_id", async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id },
      include: {
        notes: {
          orderBy: { created_at: "asc" }, // oldest first, like a conversation
        },
      },
    });

    // findUnique returns null when nothing matches -> send 404
    if (!ticket) {
      return res.status(404).json({ error: `Ticket "${ticket_id}" not found` });
    }

    // Shape the response (skip the internal auto-increment id)
    res.json({
      ticket_id: ticket.ticket_id,
      customer_name: ticket.customer_name,
      customer_email: ticket.customer_email,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      notes: ticket.notes,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Something went wrong while fetching the ticket" });
  }
});

export default router;