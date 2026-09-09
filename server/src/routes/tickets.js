import prisma from "../db.js";
import express from "express";

const router = express.Router();

// Helper: generate the next ticket ID (TKT-001, TKT-002, ...)
async function generateTicketId() {
  // Find the most recently created ticket (highest internal id)
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { id: "desc" },
  });

  let nextNumber = 1;
  if (lastTicket) {
    // "TKT-007" -> split -> "007" -> parseInt -> 7 -> +1 = 8
    nextNumber = parseInt(lastTicket.ticket_id.split("-")[1], 10) + 1;
  }

  // padStart(3, "0") turns 1 into "001", 12 into "012"
  return `TKT-${String(nextNumber).padStart(3, "0")}`;
}

// POST /api/tickets — create a new ticket
router.post("/", async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    // ---------- Validation ----------
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

    // If anything failed validation, stop here and explain why (400 = Bad Request)
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // ---------- Create the ticket ----------
    const ticket_id = await generateTicketId();

    const ticket = await prisma.ticket.create({
      data: {
        ticket_id,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim(),
        subject: subject.trim(),
        description: description.trim(),
        // status defaults to "Open" and timestamps are handled by Prisma
      },
    });

    // Spec response: { ticket_id, created_at } (201 = "Created")
    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Something went wrong while creating the ticket" });
  }
});

export default router;