# Ecoture — Full-Stack E-Commerce Platform

A fashion e-commerce web app built with React and .NET 8, featuring product browsing, cart & checkout, live chat support, a loyalty rewards system, and an admin dashboard.

**Live site:** https://ecoture.keonshu.com

> **Note:** The backend is hosted on a free-tier server that sleeps after inactivity. The first request after a period of inactivity may take **15–20 seconds** to respond while the server wakes up. Subsequent requests will be fast.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Material UI v6, React Router v6 |
| Backend | ASP.NET Core 8 (.NET 8) |
| Database | PostgreSQL (via Entity Framework Core) |
| Real-time | SignalR (live chat) |
| Auth | JWT Bearer tokens + 2FA (Twilio) |
| Storage | Cloudinary (product images) |
| Payments | Stripe (card processing) |

---

## Features

- **Product catalogue** — browsing, filtering by category / colour / size / fit / price, search
- **Cart & checkout** — multi-step checkout flow with address and payment management
- **Live chat** — real-time customer ↔ admin chat with offline message persistence
- **Loyalty programme** — points, tiers (Bronze / Silver / Gold), rewards redemption
- **Wishlist & reviews** — per-user wishlist, product reviews with ratings
- **Newsletter** — admin can create and send marketing emails
- **Enquiries** — customers raise support enquiries; staff respond in-app
- **Refund requests** — customers submit refunds; admin approves or rejects
- **Admin dashboard** — manage users, products, rewards, enquiries, refunds, live chat, and newsletters
- **Mobile-responsive** — optimised for phones and tablets across all customer and admin views

---

## Running Locally

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- PostgreSQL

### Frontend
```bash
cd Ecoture-Client
npm install
npm run dev
```

### Backend
```bash
cd Ecoture
dotnet restore
dotnet ef database update
dotnet run
```

Create an `appsettings.Development.json` (or update `appsettings.json`) with your connection string, JWT secret, Cloudinary credentials, and Twilio keys.

---

## Git Workflow (Team)

1. **Fetch and pull** origin before starting work.
2. **Merge main into your branch** first and resolve any conflicts.
3. **Push** to your own branch.
4. Open a **Pull Request** at https://github.com/Keonnnnn/Ecoture/compare — set `base: main`, `compare: <your-branch>`.
5. Review the **Files changed** tab, then merge when ready.

> Keep your branch in sync with main regularly — large divergences make merges painful.
