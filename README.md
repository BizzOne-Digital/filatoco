# FilatoCo.ca

Full-stack MERN ecommerce site for FilatoCo — handmade crochet, tapestry and sewn bags.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + React Router
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Image storage:** Cloudinary
- **Email:** Nodemailer via Gmail App Password SMTP

## Folder Structure

```
root/
├── frontend/            React app (customer site + /admin panel)
│   └── src/
│       ├── admin/       Admin portal (pages, components, layouts, routes)
│       ├── components/  Shared UI
│       ├── context/     Auth, Cart, Wishlist state
│       ├── pages/       Public pages
│       └── services/    Axios API client
└── backend/              Express API
    ├── config/           DB + Cloudinary config
    ├── controllers/
    ├── middleware/       auth, upload, error handling
    ├── models/           Mongoose schemas
    ├── routes/
    ├── services/         emailService.js (Nodemailer)
    └── utils/
```

## 1. Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2. Environment Variables

Copy `.env.example` to `.env` in both `backend/` and `frontend/`, then fill in real values.

**backend/.env**
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — long random string
- `CLOUDINARY_*` — from your Cloudinary dashboard
- `SMTP_USER` / `SMTP_APP_PASSWORD` — a Gmail address + a 16-character [Google App Password](https://myaccount.google.com/apppasswords) (requires 2FA enabled on the Gmail account)
- `ADMIN_EMAIL` — where contact/order/custom-request notifications are sent

**frontend/.env**
- `VITE_API_BASE_URL` — e.g. `http://localhost:5000/api`

The site runs without Cloudinary/SMTP credentials — uploads and outgoing email are simply skipped with a console warning until you add real keys, so you can develop and test everything else immediately.

## 3. MongoDB Atlas Setup

1. Create a free cluster at mongodb.com/cloud/atlas.
2. Create a database user and allow your IP (or `0.0.0.0/0` for development).
3. Copy the connection string into `MONGODB_URI`.

## 4. Cloudinary Setup

1. Create a free account at cloudinary.com.
2. Copy Cloud Name, API Key and API Secret from the dashboard into `backend/.env`.

## 5. Gmail App Password Setup

1. Enable 2-Step Verification on the Gmail account.
2. Go to Google Account → Security → App Passwords, generate one for "Mail".
3. Use that 16-character password as `SMTP_APP_PASSWORD` (not the normal Gmail password).

## 6. Run Locally

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

## 7. Create the First Admin Account

Register a normal customer account via the site, or run:

```bash
cd backend
node utils/seedAdmin.js admin@filatoco.ca YourStrongPassword123 Mirella Scarcelli
```

Then sign in at `/admin/login`.

## 8. Production Build

```bash
cd frontend && npm run build   # outputs frontend/dist
cd backend && npm start
```

Deploy `frontend/` and `backend/` as two separate Vercel projects (both folders are already set up for it — see section 8a below). Backend can also go on Render/Railway instead if preferred; nothing here locks it to Vercel.

## 8a. Deploying Both to Vercel

Both folders are Vercel-ready:

- `backend/app.js` holds the Express app with no `app.listen()` — reusable by both local dev and serverless.
- `backend/server.js` is the local dev entry point (`npm run dev` / `npm start`) — connects to Mongo once, then calls `app.listen()`.
- `backend/api/index.js` is the **Vercel serverless entry point** — Vercel auto-detects any file under `api/` as a function. It reuses a cached Mongo connection across warm invocations instead of reconnecting every request.
- `backend/vercel.json` rewrites every request to that one function, so all `/api/...` routes keep working exactly as they do locally.
- `frontend/vercel.json` rewrites every path to `index.html` so React Router's client-side routes (e.g. `/shop`, `/product/:slug`) don't 404 on refresh.

**Steps:**

1. Push the repo to GitHub (or connect the local folder directly with the Vercel CLI).
2. **Backend project**: in Vercel, "Add New Project" → set the **Root Directory to `backend`**. Framework preset: "Other". Add all variables from `backend/.env.example` as Environment Variables (real values — `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `SMTP_*`, `ADMIN_EMAIL`, `FRONTEND_URL`). Deploy. Note the resulting URL, e.g. `https://filatoco-api.vercel.app`.
3. **Frontend project**: "Add New Project" again → **Root Directory to `frontend`**. Framework preset: Vite (auto-detected). Set `VITE_API_BASE_URL=https://filatoco-api.vercel.app/api` (the backend URL from step 2, with `/api`). Deploy. Note this URL too, e.g. `https://filatoco.vercel.app`.
4. Go back to the **backend** project's environment variables and set `FRONTEND_URL` to the frontend URL from step 3 (comma-separate multiple origins if needed, e.g. staging + production). Set `NODE_ENV=production`. Redeploy the backend so CORS and the auth cookie's `SameSite=None; Secure` settings pick up the real frontend origin.
5. Visit the frontend URL, register/log in, and confirm `/admin/login` works — this is the real test that the cross-domain cookie is being accepted.

**Two things to know about this setup:**
- The auth cookie is cross-domain (`frontend.vercel.app` → `backend.vercel.app`), so it's set with `SameSite=None; Secure`, which only works over HTTPS — exactly what Vercel gives you, but it means the cookie won't be sent if you test the deployed backend from `http://localhost`.
- Vercel's Hobby plan caps serverless function request bodies around 4.5MB. Product image uploads in Admin are capped at 5MB/file server-side (`backend/middleware/upload.js`) — on Hobby, uploads close to that ceiling may be rejected by Vercel before they reach the app. Lower the multer limit or upgrade the Vercel plan if that becomes an issue.

## 9. Payments

Checkout currently creates orders in `pending` payment status without charging a card — no payment provider is wired in. To add Stripe: implement a Stripe Checkout Session/Payment Intent endpoint in `backend/controllers/orderController.js`, keep the secret key in `backend/.env` (`PAYMENT_SECRET_KEY`) only, and never expose it to the frontend.

## 10. API Overview

All routes are under `/api`: `auth`, `users`, `products`, `categories`, `orders`, `contact`, `custom-requests`, `appointments`, `testimonials`, `gallery`, `newsletter`, `settings`, `admin`. Admin-only routes are protected by JWT + role check on the backend — the frontend `/admin` UI is a convenience layer only, not the security boundary.

## Notes

- Roles (`customer` / `admin`) live on a single `User` model; there is no separate `Admin` collection.
- Cart and guest wishlist persist in `localStorage`; a signed-in user's wishlist syncs to the database.
- Product/category/testimonial/gallery images upload directly to Cloudinary from the backend; replacing or deleting an image also deletes the old Cloudinary asset.
