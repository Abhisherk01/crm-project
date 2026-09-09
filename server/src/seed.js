// server/src/seed.js
// Fills the database with realistic demo tickets across all 3 statuses.
// Run from inside the server folder:  node src/seed.js
// WARNING: wipes all existing tickets/notes first, then creates fresh data.

import prisma from "./db.js";

const demoTickets = [
  {
    ticket_id: "TKT-001",
    customer_name: "Sarah Mitchell",
    customer_email: "sarah.mitchell@example.com",
    subject: "Unable to reset my password",
    description:
      "I clicked 'Forgot password' three times since yesterday but the reset email never arrives. Nothing in my spam folder either. I am completely locked out of my account.",
    status: "Open",
    notes: [],
  },
  {
    ticket_id: "TKT-002",
    customer_name: "James Okafor",
    customer_email: "james.okafor@example.com",
    subject: "Charged twice for order #4821",
    description:
      "My card was charged twice for the same order. Both charges are showing as pending on my bank statement. I need one of them reversed as soon as possible.",
    status: "In Progress",
    notes: [
      {
        note_text:
          "Confirmed the duplicate charge with the payments team. Refund has been initiated, 3-5 business days to appear.",
      },
    ],
  },
  {
    ticket_id: "TKT-003",
    customer_name: "Priya Sharma",
    customer_email: "priya.sharma@example.com",
    subject: "How do I export my invoices as CSV?",
    description:
      "I need last year's invoices for my accountant. Is there a way to download them all at once instead of one by one?",
    status: "Closed",
    notes: [
      {
        note_text:
          "Walked the customer through Settings > Billing > Export. They confirmed the CSV download worked.",
      },
    ],
  },
  {
    ticket_id: "TKT-004",
    customer_name: "Daniel Reyes",
    customer_email: "daniel.reyes@example.com",
    subject: "Dashboard shows a blank page on Safari",
    description:
      "Ever since this morning the dashboard is completely blank in Safari on my Mac. It works fine in Chrome. No error message, just white space.",
    status: "Open",
    notes: [],
  },
  {
    ticket_id: "TKT-005",
    customer_name: "Lena Fischer",
    customer_email: "lena.fischer@example.com",
    subject: "File upload fails for files over 50 MB",
    description:
      "Uploading attachments larger than about 50 MB fails with a generic error. Smaller files upload fine. This is blocking my team's monthly report submission.",
    status: "In Progress",
    notes: [
      {
        note_text: "Reproduced the issue locally with a 75 MB test file. Escalated to engineering.",
      },
      {
        note_text:
          "Engineering is investigating. Temporary workaround: split large files into parts under 50 MB.",
      },
    ],
  },
  {
    ticket_id: "TKT-006",
    customer_name: "Tom Bradley",
    customer_email: "tom.bradley@example.com",
    subject: "Refund request for cancelled subscription",
    description:
      "I cancelled my subscription on the 3rd but was still charged on the 5th. I would like a refund for this charge since I cancelled before the billing date.",
    status: "Closed",
    notes: [
      {
        note_text: "Refund processed in full. Confirmation email sent to the customer.",
      },
    ],
  },
];

async function main() {
  console.log("Clearing existing data...");
  // Deleting tickets automatically deletes their notes (cascade relation).
  await prisma.ticket.deleteMany();

  console.log("Creating demo tickets...");
  for (const { notes, ...ticketData } of demoTickets) {
    await prisma.ticket.create({
      data: {
        ...ticketData,
        notes: { create: notes },
      },
    });
    console.log(`  Created ${ticketData.ticket_id} [${ticketData.status}] with ${notes.length} note(s)`);
  }

  const total = await prisma.ticket.count();
  console.log(`Done. Database now has ${total} tickets.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });