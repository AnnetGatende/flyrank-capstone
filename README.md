# Kitabu ya Deni 📖 — FlyRank Capstone Project

A digital credit ledger designed to help local Kenyan shopkeepers (*mamambogas* and kiosk owners) manage customer debts, track Pochi la Biashara payments, and send AI-drafted SMS reminders. 

Built as the capstone project for the FlyRank AI Internship (2026 cohort), Frontend AI Engineering track.

## About

Kitabu ya Deni ("book of debt") replaces the traditional paper ledger. It provides a secure, digital environment for shopkeepers to log debts, accept partial or full payments, and maintain a clear transaction history. It leverages AI to handle the awkwardness of debt collection by generating polite, contextual SMS reminders in Kiswahili, English, or Sheng.

## Features

* **Secure Authentication:** Complete user login and route protection managed via Clerk.
* **Financial Dashboard:** Real-time tracking of total outstanding debts, weekly payment trends, and top debtors.
* **Transaction Management:** Record new debts and log partial or full payments (e.g., via Pochi la Biashara) with automatic balance deductions.
* **Inline Editing:** Instantly update past transaction descriptions directly from the UI.
* **AI SMS Generator:** Leverages Google's Gemini 3.5 Flash Lite model to draft contextual payment reminders.
* **WhatsApp Integration:** Send generated drafts directly to clients via WhatsApp Web with one click.

## Tech Stack

* **Frontend:** Next.js 16 (App Router), React, Tailwind CSS
* **Backend:** Next.js Server Actions
* **Database:** PostgreSQL (Supabase) via Prisma ORM
* **Authentication:** Clerk Core 3
* **AI Integration:** Vercel AI SDK (`@ai-sdk/google`)
* **Deployment:** Vercel

## Author

**Annet Gatende** — Full-Stack Developer & AI Engineer

## Getting Started

### Prerequisites
* Node.js 18+
* npm

### Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/AnnetGatende/flyrank-capstone.git](https://github.com/AnnetGatende/flyrank-capstone.git)
   cd flyrank-capstone


Install dependencies:

npm install

Environment Variables:

Create a .env file in the root directory and add your keys:


# Database (Supabase)
DATABASE_URL="your_transaction_pooler_url"
DIRECT_URL="your_session_pooler_url"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# AI (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
Initialize the database:


npx prisma generate
npx prisma db push
Run the development server:


npm run dev
The app will be available at http://localhost:3000.

Routes
/ — Redirects to Dashboard

/dashboard — Main financial overview

/customers — Master list of all debtors

/customers/[id] — Individual customer ledger, payment logging, and inline editing

/add-debt — Interface for recording new transactions

/sms-generator — AI-powered SMS drafting tool

/settings — Manage shop profile, Pochi la Biashara details, and AI language preferences