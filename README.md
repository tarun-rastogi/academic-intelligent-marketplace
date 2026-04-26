# Digital Academic Marketplace (local MVP)

Monorepo: **Fastify + Prisma + PostgreSQL** API (`apps/api`) and **Next.js** web app (`apps/web`). Shared validation/types live in `packages/@dam/shared` for future React Native reuse.

## Prerequisites

- Node.js 20+
- Docker Desktop (for PostgreSQL), or any PostgreSQL 16 instance
- Razorpay **test** keys for end-to-end payments ([Dashboard → API Keys](https://dashboard.razorpay.com/app/keys))

## Quick start

1. **Start database**

   ```bash
   docker compose up -d
   ```

   Default URL in `apps/api/.env.example` uses port **5433** to avoid clashing with a local Postgres on 5432.

2. **Install dependencies**

   ```bash
   npm install
   npm run build -w @dam/shared
   ```

3. **Configure environment**

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

   Add your Razorpay test `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `apps/api/.env`.

4. **Schema & seed**

   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Run API + web**

   ```bash
   npm run dev
   ```

   - Web: [http://localhost:3001](http://localhost:3001)
   - API: [http://localhost:4000/api/health](http://localhost:4000/api/health)

6. **After code changes (clean restart)** — stops **all** prior `concurrently` / `tsx watch` / `next dev` instances for this repo, frees **3001** and **4000**, rebuilds `@dam/shared`, then starts both servers:

   ```bash
   npm run dev:restart
   ```

   Use this when you hit `EADDRINUSE`, duplicate `tsx watch` processes, a stuck Next.js `500`, or after API edits that did not hot-reload. **Only one** `npm run dev` (or `dev:restart`) should run at a time for this project.

## Auth (local)

- Request OTP, then verify. In **development**, OTP is always **`123456`** (or whatever you set as `DEV_OTP`). The API also returns a `devHint` after `/auth/otp/request`.
- Session is an **HTTP-only cookie** backed by the `ACTIVE_SESSIONS` table.

## Payments

1. Sign in → browse **Fields → Exams → Institutes → Apply**.
2. Submit the application form (documents are **deferred** per MVP).
3. On `/payment/[applicationId]`, **Pay with Razorpay** uses the Checkout script; the server verifies the signature via `POST /api/payments/confirm`.
4. Partner institutes: application status becomes **`ENROLLMENT_PENDING`**. Non-partner: **`LEAD_SENT`**.

## NPM scripts (root)

| Script        | Purpose                          |
|---------------|----------------------------------|
| `npm run dev` | API (4000) + Next (3001)         |
| `npm run db:push` | `prisma db push` (dev schema) |
| `npm run db:seed` | Seed fields, exams, institutes |
| `npm run db:migrate` | `prisma migrate dev`        |
| `npm run build`    | shared + api + web          |

## Folder structure

```
apps/api          Fastify API, Prisma schema & seed
apps/web          Next.js App Router UI
packages/shared   Zod schemas + shared constants
```

## Mandatory tables (implemented)

- `User` (UUID PK) — `USERS` concept
- `ActiveSession` — `ACTIVE_SESSIONS`
- `PaymentPlan` — `PAYMENT_PLANS`
- `PaymentDetail` — `PAYMENT_DETAILS`
- `Application` — `APPLICATIONS`

Plus catalog tables: `AcademicField`, `Exam`, `Institute`, `Program`.

## Digi deck & Executive Inputs (HTML + Excel)

- Static deck: [docs/digi.html](docs/digi.html) — go to the **Executive inputs** slide, answer per section, then **Submit to workbook (Excel)**.
- Workbook: [docs/Merrakii_Business_Capture.xlsx](docs/Merrakii_Business_Capture.xlsx) — one sheet per section (Company content, Brand and contact, …). Column **A** is the question, column **B** is the answer. (An older [docs/Executive_Inputs_Questionnaire.xlsx](docs/Executive_Inputs_Questionnaire.xlsx) in the tree is a separate legacy export; the deck and server use **Merrakii_Business_Capture.xlsx**.) Re-submit from the page at any time; answers overwrite column **B** for the same questions.
- Browsers cannot write to disk without a small server. Run the helper app and open the deck at its URL (same origin so submit works without extra config):

  ```bash
  python3 -m venv .venv
  . .venv/bin/activate
  pip install -r executive-inputs-server/requirements.txt
  python executive-inputs-server/app.py
  ```

  Then open [http://127.0.0.1:5050/digi.html](http://127.0.0.1:5050/digi.html) (or [http://127.0.0.1:5050/](http://127.0.0.1:5050/) for the same page). Optional: `EXECUTIVE_INPUTS_SUBMIT_TOKEN` and header `X-Submit-Token` (see [executive-inputs-server/app.py](executive-inputs-server/app.py)).

- Regenerate the Excel from the generator script and re-export the JS the deck uses:

  ```bash
  . .venv/bin/activate  # with openpyxl installed
  python scripts/generate_merrakii_business_questionnaire.py
  python scripts/export_merrakii_capture_js.py
  ```

## GitHub (host the repo)

1. Create a new empty repository in your GitHub account (no README/license if you will push an existing history).
2. From this folder:

   ```bash
   git init
   git add -A
   git commit -m "Initial commit: digital academic marketplace"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

3. If you also want the static **digi** deck on **GitHub Pages** (read-only, no submit): enable Pages from branch `main` and folder `docs/`, and open `https://<user>.github.io/<repo>/digi.html`. **Submit to Excel** still requires a server with the workbook (local Flask, or deploy `executive-inputs-server` to any host and set the workbook path with `EXECUTIVE_INPUTS_XLSX`).

## Production notes

- Move from `db push` to **`prisma migrate`** for versioned migrations.
- Add real SMS for OTP; never return OTP hints in production (see `apps/api/src/routes/auth.ts`).
- Configure Razorpay **webhooks** with raw-body signature verification for redundancy (client confirm is implemented for MVP).
