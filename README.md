## SupportDesk — Customer Support Ticketing CRM

A full-stack customer support ticketing system. Support agents can view, search, and filtertickets, create new ones, update status, and attach internal notes through to resolution.

Live demo: [hhttps://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app/https://crm-project-gamma-flax.vercel.app](https://crm-project-gamma-flax.vercel.app/) health check: [https://crm-project-2wdv.onrender.com/api/health](https://crm-project-2wdv.onrender.com/api/health)

Both services run on free tiers — if the demo hasn't been visited recently, the firstrequest can take up to a minute to wake the API. Give it a moment; everything is fast after that.

Features
Create tickets — validated form (name, email, subject, description) with instant client-side feedback and auto-generated IDs (TKT-001, TKT-002, ...)

Dashboard — all tickets newest-first, with global statistics (Total / Open / In Progress / Closed)

Live search — debounced, server-side, case-insensitive across ticket ID, customer name, email, subject, and description

Status filtering — Open / In Progress / Closed, combinable with search

Ticket workspace — full details, status updates, and a timestamped notes timeline

Robust UI states — loading, error, and empty states throughout, friendly 404s at both the route and data level

Responsive — dark black/yellow/white theme, usable from phone to desktop

Tech Stack
Layer	        Technology
Frontend	    React (Vite), Tailwind CSS v4, React Router v6
Backend	        Node.js, Express
Database	    SQLite via Prisma ORM (Prisma 6)
Hosting	        Render (API), Vercel (frontend)

Project Structure
support-crm/├── client/                 # React + Vite frontend│   ├── src/│   │   ├── components/     # Navbar, StatusBadge, StatsBar, ScrollToTop│   │   ├── pages/          # Dashboard, NewTicket, TicketDetail, NotFound│   │   └── lib/api.js      # Single API client module (all fetch calls)│   ├── vercel.json         # SPA rewrite: serve index.html for all routes│   └── .env.example├── server/                 # Express API│   ├── src/│   │   ├── index.js        # App entry: middleware, routes, 404 handler│   │   ├── db.js           # Prisma client singleton│   │   ├── routes/tickets.js│   │   └── seed.js         # Resets DB to 6 demo tickets│   ├── prisma/schema.prisma│   └── .env.example└── docs/TESTING.md         # End-to-end test results (27 checks)

API Reference
Base URL (local): [http://localhost:5000](http://localhost:5000)

Method	    Endpoint	                    Description
GET	    /api/health	                Service + database health check
POST	/api/tickets	            Create a ticket
GET	    /api/tickets	            List tickets (newest first) — supports ?status= and ?search=
GET	    /api/tickets/:ticket_id	    Full ticket including notes (oldest first)
PUT	    /api/tickets/:ticket_id	    Update status and/or add a note

Create a ticket — all fields required, email format validated; returns 201:
POST /api/tickets{  "customer_name": "Sarah Mitchell",  "customer_email": "[sarah.mitchell@example.com](mailto:sarah.mitchell@example.com)",  "subject": "Unable to reset my password",  "description": "Clicked 'Forgot password' three times, no email arrives."}→ 201{  "ticket_id": "TKT-007",  "created_at": "2026-09-10T10:30:00.000Z"}

List with filters:

GET /api/tickets?status=Open&search=password
Each list item: ticket_id, customer_name, subject, status, created_at.

Update a ticket — accepts { "status" } and/or { "note" }; status must be one ofOpen, In Progress, Closed; an empty body, invalid status, or empty note returns 400:

PUT /api/tickets/TKT-007{ "status": "In Progress", "note": "Reproduced on two machines." }→ 200{ "success": true, "updated_at": "2026-09-10T10:31:00.000Z" }
Invalid input and missing tickets return { "error": "..." } with an appropriate status code.

Running Locally
Prerequisites: Node.js 18+, Git.

git clone [https://github.com/Abhisherk01/crm-project.gitcd](https://github.com/Abhisherk01/crm-project.gitcd) crm-project
Backend:

cd servernpm install# create .env (see .env.example) with:#   PORT=5000#   DATABASE_URL="file:./dev.db"npx prisma db push      # create the SQLite database from the schemanode src/seed.js        # optional: load 6 demo ticketsnpm run dev             # API on [http://localhost:5000](http://localhost:5000)

Frontend (new terminal):

cd clientnpm install# create .env (see .env.example) with:#   VITE_API_URL=[http://localhost:5000npm](http://localhost:5000npm) run dev             # app on [http://localhost:5173](http://localhost:5173)
server/src/seed.js wipes and reloads the demo data (6 tickets across all statuses) —run it anytime for a clean slate.

Testing
Manual end-to-end testing was performed across the full stack — user journeys, APIregression, failure paths, and recovery. The complete 27-check results table is indocs/TESTING.md.

Deployment
Both services auto-deploy on every push to main.

API — Render (free web service, Root Directory server):

Build: npm install && npx prisma generate && npx prisma db push && node src/seed.js
Start: node src/index.js
Env var: DATABASE_URL=file:./dev.db
The build creates the schema and seeds demo data on a fresh disk every deploy.
Frontend — Vercel (Root Directory client):

Env var: VITE_API_URL=[https://crm-project-2wdv.onrender.com](https://crm-project-2wdv.onrender.com) (baked in at build time)
client/vercel.json rewrites all routes to index.html so deep links andrefreshes work with React Router.

Known Limitations:

Ephemeral database (by design, for this demo). Render's free tier has no persistentdisk: the SQLite file is recreated (and re-seeded) on every deploy, and tickets createdafter a deploy are lost when the service restarts or redeploys. During any singlesession, everything works and persists normally. The production fix — a Renderpersistent disk or migrating to managed Postgres (a provider swap inschema.prisma plus a connection string) — is deliberately documented rather thanimplemented, to keep this assessment on the free tier.
Cold starts. After ~15 minutes idle, the free API sleeps; the next request takes~30–60 seconds while it wakes.
No authentication. Any visitor can manage tickets. Auth (e.g. agent login) was outof scope for this assessment.
Open CORS. The API allows all origins for simplicity; a production deployment wouldrestrict this to the known frontend origin.
Search implementation. SQLite's contains is case-sensitive, so search filtering isperformed in application code (case-insensitive, in memory) — perfectly adequate at thisscale, and a good candidate to move into the database if the data grows.

Future Improvements:

Migrate to PostgreSQL for real persistence across deploys
Agent authentication and role-based access
Pagination for large ticket lists
Automated tests (API integration tests + frontend component tests)
Email notifications on status changes

Beginner-friendly explanation of the key choices:

The blockquote at the top — Markdown renders it as a visually distinct callout, so "demo link" and "first load may be slow" land together. That one sentence converts your biggest free-tier weakness into documented, expected behavior.
your-app-name.vercel.app is the only placeholder — it appears exactly once (top). Replace it with your real Vercel URL before committing.
The structure tree — shows a reviewer your architecture in 5 seconds without reading code. It also proves the monorepo layout was a deliberate choice.
API docs show the contract, not the code — request/response examples with validation rules. A reviewer can test your API from the README alone, using nothing but a browser or PowerShell.
Known Limitations leads with the ephemeral-disk story — written as decision → behavior → production fix. Same facts as an apology, completely different impression.
Four-backtick outer fence — the README itself contains triple-backtick code blocks; that's why I wrapped it in ```` so it copies cleanly. Paste the contents as-is.

How to run/test

1. Replace the placeholder: open the README, swap [https://your-app-name.vercel.app](https://your-app-name.vercel.app) for your real Vercel URL (you recorded it in Step 22).
2. Verify no placeholder remains:

powershell:
Select-String -Path README.md -Pattern "your-app-name"

No output = good. Output = you missed one.

1. Preview it: with README.md open in VS Code, press Ctrl+Shift+V — check the tables render, the code blocks look right, and the docs/TESTING.md link works (it should jump into that file).
2. Check the URLs by clicking them in the preview: health link returns JSON; demo link loads your app.
3. Commit and push (commands below), then view [https://github.com/Abhisherk01/crm-project](https://github.com/Abhisherk01/crm-project) in a browser — this is how your reviewer will see it. Check the rendered page top to bottom once.

