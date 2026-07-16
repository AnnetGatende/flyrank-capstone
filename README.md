# Kitabu ya Deni — FlyRank Capstone Project

A digital credit ledger for small Kenyan shopkeepers, built during the FlyRank AI Internship (2026 cohort), Frontend AI Engineering track.

## About

Kitabu ya Deni ("book of debt") replaces the paper ledger many shopkeepers use to track customer debts. Planned features include voice-based debt logging, partial payments, WhatsApp reminders, and a customer trust score — layered in across the internship as the project develops.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Status

🚧 In active development — Week 3, Foundations phase. Routed placeholders exist for all planned screens; features are being built incrementally.

## Author

Annet Gatende — [Annet's Tech Journey](#)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

\`\`\`
git clone https://github.com/AnnetGatende/flyrank-capstone.git
cd flyrank-capstone
npm install
npm run dev
\`\`\`

The app will be available at http://localhost:3000.

## Live Preview

https://flyrank-capstone-blush.vercel.app/

## Routes

- `/` — Dashboard
- `/add-debt` — Add Debt
- `/customers` — Customers list
- `/customers/[id]` — Customer ledger detail
- `/settings` — Settings
- `/health` — Health check (fetches and renders live data; not linked in nav, verifies deployment health)