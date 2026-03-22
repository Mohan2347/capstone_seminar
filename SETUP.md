# SmartMatch — Setup Guide

Complete setup instructions for **Windows** and **Ubuntu/Linux**.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18.17+ | LTS recommended |
| npm | 9+ | Comes with Node |
| Git | Any | For cloning |
| PostgreSQL | Serverless via NeonDB | No local install needed |

---

## Part 1 — External Services Setup

You need four free accounts before running the project locally. Do this first.

### 1.1 NeonDB (PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → **Sign Up**
2. Create a new project → name it `smartmatch`
3. Copy the **Connection String** (it looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)
4. Save it — this is your `DATABASE_URL`

### 1.2 Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com) → **Sign Up**
2. Create a new application → name it `SmartMatch`
3. Choose **Email + Password** and **Google** as sign-in methods
4. Go to **API Keys** tab → copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)
5. Go to **Webhooks** → **Add Endpoint**:
   - URL: `https://your-domain.com/api/webhooks/clerk` (use ngrok for local dev — see step 3.3)
   - Subscribe to events: `user.created`, `user.deleted`
   - Copy the **Signing Secret** → this is `CLERK_WEBHOOK_SECRET`

### 1.3 Google Gemini API

1. Go to [aistudio.google.com](https://aistudio.google.com) → **Sign In**
2. Click **Get API Key** → **Create API Key**
3. Copy the key → this is `GEMINI_API_KEY`

### 1.4 Uploadthing (Optional — for file uploads)

1. Go to [uploadthing.com](https://uploadthing.com) → **Sign Up**
2. Create a new app
3. Copy `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` from the dashboard

---

## Part 2 — Windows Setup

### 2.1 Install Node.js

**Option A — Recommended (nvm-windows)**
```powershell
# Download and run the nvm-windows installer from:
# https://github.com/coreybutler/nvm-windows/releases
# Then in PowerShell (as Administrator):

nvm install 20
nvm use 20
node --version   # should print v20.x.x
npm --version    # should print 10.x.x
```

**Option B — Direct installer**

Download from [nodejs.org](https://nodejs.org/en/download) → choose the LTS `.msi` installer → run it → restart terminal.

### 2.2 Install Git

Download from [git-scm.com](https://git-scm.com/download/win) → run installer → use all defaults.

### 2.3 Clone and Install

Open **PowerShell** or **Windows Terminal**:

```powershell
git clone https://github.com/your-username/internship-recommendation.git
cd internship-recommendation
npm install
```

### 2.4 Configure Environment Variables

```powershell
copy .env .env.local
notepad .env.local
```

Fill in all values (replace the placeholders):

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx
```

Save and close Notepad.

### 2.5 Set Up Database

```powershell
# Generate Prisma client
npx prisma generate

# Push schema to NeonDB (creates all tables)
npx prisma db push

# Seed initial data
npx prisma db seed
```

> **Note:** `db push` is faster than `migrate dev` for initial setup. Use `migrate dev` if you want migration history.

### 2.6 Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2.7 Webhook Testing on Windows (Optional)

To test Clerk webhooks locally, you need a tunnel:

```powershell
# Install ngrok
winget install ngrok.ngrok
# OR download from https://ngrok.com/download

# Authenticate (one-time setup)
ngrok config add-authtoken YOUR_NGROK_TOKEN

# In a separate terminal, start tunnel:
ngrok http 3000
```

Copy the `https://xxxx.ngrok-free.app` URL → go back to Clerk dashboard → update your webhook endpoint to `https://xxxx.ngrok-free.app/api/webhooks/clerk`.

---

## Part 3 — Ubuntu / Linux Setup

### 3.1 Install Node.js via nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc
# or if using zsh:
source ~/.zshrc

# Install Node.js LTS
nvm install 20
nvm use 20

# Verify
node --version   # v20.x.x
npm --version    # 10.x.x
```

### 3.2 Install Git

```bash
sudo apt update
sudo apt install git -y
git --version
```

### 3.3 Clone and Install

```bash
git clone https://github.com/your-username/internship-recommendation.git
cd internship-recommendation
npm install
```

### 3.4 Configure Environment Variables

```bash
cp .env .env.local
nano .env.local
# or: vim .env.local
```

Fill in all values:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X` (nano) or `:wq` (vim).

### 3.5 Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to NeonDB
npx prisma db push

# Seed initial data
npx prisma db seed
```

### 3.6 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3.7 Webhook Testing on Ubuntu (Optional)

```bash
# Install ngrok
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update
sudo apt install ngrok

# Authenticate (one-time)
ngrok config add-authtoken YOUR_NGROK_TOKEN

# In a separate terminal:
ngrok http 3000
```

---

## Part 4 — Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma db push` | Push schema changes to database (no migration history) |
| `npx prisma migrate dev` | Create and apply migration (with history) |
| `npx prisma studio` | Open visual database browser at localhost:5555 |
| `npx prisma db seed` | Run seed script |
| `npx prisma db reset` | Drop all tables and re-seed (dev only!) |

---

## Part 5 — Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### "Environment variable not found: DATABASE_URL"

Make sure your `.env.local` file exists and is in the project root. Next.js loads `.env.local` automatically.

Also check that `prisma.config.ts` uses the correct env file. If Prisma can't find the variable during `db push`, pass it explicitly:

```bash
DATABASE_URL="your-url-here" npx prisma db push
```

### "Invalid API Key" (Gemini)

Ensure `GEMINI_API_KEY` starts with `AIza`. Go to [aistudio.google.com](https://aistudio.google.com) to verify the key is active.

### Clerk webhook returns 400

- Verify `CLERK_WEBHOOK_SECRET` matches the **Signing Secret** in Clerk dashboard (not the API key)
- Make sure the webhook URL is correct and publicly accessible (use ngrok for local dev)
- Check that you subscribed to `user.created` and `user.deleted` events

### "prisma db seed" not found

Make sure your `package.json` has the seed configuration:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Or run it directly:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### Port 3000 already in use (Ubuntu)

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill it
sudo kill -9 $(sudo lsof -t -i:3000)

# Or run on a different port
npm run dev -- --port 3001
```

### Port 3000 already in use (Windows)

```powershell
# Find process
netstat -ano | findstr :3000

# Kill by PID (replace XXXX with the PID shown)
taskkill /PID XXXX /F

# Or use a different port
$env:PORT=3001; npm run dev
```

### Slow recommendation generation (first run)

The first time recommendations are generated, every internship embedding must be computed via Gemini API. With 20+ internships, this can take 10–30 seconds. Subsequent requests use cached embeddings and complete in under 2 seconds.

---

## Part 6 — Production Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project** → select your repo
3. Add all environment variables in the Vercel dashboard (Settings → Environment Variables)
4. Deploy — Vercel auto-detects Next.js

After deploying, update your Clerk webhook endpoint from the ngrok URL to your production URL:
```
https://your-app.vercel.app/api/webhooks/clerk
```

---

## Quick Start Checklist

```
[ ] NeonDB account + database created + connection string copied
[ ] Clerk account + app created + API keys copied
[ ] Clerk webhook configured (ngrok for local, production URL for deploy)
[ ] Gemini API key obtained
[ ] .env.local file created with all values filled in
[ ] npm install completed
[ ] npx prisma generate run
[ ] npx prisma db push run (tables created)
[ ] npx prisma db seed run (demo data loaded)
[ ] npm run dev started — app running on localhost:3000
[ ] Sign up as a student → complete profile → view recommendations
```
