# SmartMatch — AI Hybrid Internship Recommendation System

## What is SmartMatch?

SmartMatch is an intelligent internship recommendation platform that uses a multi-layered AI pipeline to match students with the most relevant internship opportunities. Unlike simple keyword search, SmartMatch understands the *semantic meaning* of a student's background and compares it deeply against internship requirements — then continuously improves those matches based on real user behavior.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Server components, file-based routing, API routes in one project |
| **Language** | TypeScript | Type safety across frontend and backend |
| **Styling** | TailwindCSS v4 + shadcn/ui | Utility-first styling with accessible pre-built components |
| **Database** | PostgreSQL via NeonDB | Serverless Postgres — scales to zero, instant connections |
| **ORM** | Prisma | Type-safe DB queries with auto-generated client |
| **Auth** | Clerk v7 | Managed auth with webhooks, middleware, and UI components |
| **AI / Embeddings** | Google Gemini API | `text-embedding-004` for BERT-style embeddings; `gemini-1.5-flash` for text generation |
| **File Uploads** | Uploadthing | Managed file storage (resumes, avatars) |
| **Forms** | react-hook-form v7 + Zod v4 | Schema-validated forms with minimal re-renders |
| **Notifications** | Sonner | Toast notifications |

---

## How the Algorithm Works — Step by Step

### Step 1 — Student Profile Analysis

When a student fills out their profile, SmartMatch collects 12+ data dimensions:

```
Academic:     major, university, GPA, graduation year
Skills:       technical and soft skills (e.g. Python, React, SQL)
Experience:   past internships/jobs with titles, companies, descriptions
Preferences:  desired roles, industries, locations, work types (remote/hybrid/onsite)
Personality:  Big Five traits (openness, conscientiousness, extraversion, agreeableness, neuroticism)
```

This multi-dimensional profile gives the algorithm a rich signal about who the student is and what they're looking for.

---

### Step 2 — BERT-Style Embedding Generation

All profile data is serialized into a single descriptive text, for example:

```
"Student profile: Jane Doe. Major: Computer Science. University: MIT. GPA: 3.8.
 Skills: Python, Machine Learning, SQL, React. Preferred roles: Data Scientist,
 ML Engineer. Preferred industries: FinTech, Healthcare. Experience: Data Science
 Intern at Google: built recommendation models. Personality traits: openness=85,
 conscientiousness=72..."
```

This text is fed into **Google Gemini's `text-embedding-004` model**, which produces a **768-dimensional vector** — a numerical representation that encodes the semantic meaning of the entire profile. The same is done for every internship description.

> **Why embeddings?** Two people who write "machine learning" and "ML" end up with similar vector positions. Embeddings capture meaning, not just keywords.

Embeddings are cached in the database (`embedding` JSON column) and invalidated whenever the profile or internship is updated, so they're only recomputed when needed.

---

### Step 3 — Content-Based Similarity Score

For each student–internship pair, the system computes a **content score** using three weighted sub-scores:

```
Content Score = 0.60 × embedding_cosine_similarity
              + 0.25 × skills_overlap_score
              + 0.15 × gpa_eligibility_score
```

**Cosine Similarity** (`lib/algorithm/similarity.ts`)

```
               A · B
sim(A, B) = ──────────
             |A| × |B|
```

Where A and B are the student and internship embedding vectors. Returns a value from −1 to 1 (practically 0–1 for text). A score of 1.0 means perfect semantic alignment.

**Skills Overlap Score**

```
skills_score = (number of required skills the student has) / (total required skills)
```

This is a hard-constraint bonus — if a student has 8 out of 10 required skills, they score 0.80.

**GPA Eligibility Score**

```
if student_gpa >= required_gpa → score = 1.0
if student_gpa < required_gpa  → score = 0.5 × (student_gpa / required_gpa)
if no GPA requirement           → score = 1.0
```

---

### Step 4 — Collaborative Filtering Score

Content-based matching only knows about the student's explicit profile. Collaborative filtering learns from *what similar users did*.

**Algorithm** (`lib/algorithm/collaborative.ts`):

1. Find all other students who interacted with the target internship
2. For each such "peer student", compute their **behavioral similarity** to our student using a cosine similarity over their shared interaction history
3. Weight each peer's positive/negative signal by their similarity score

**Reward values for actions:**
```
APPLIED    → +1.0  (strongest positive signal)
SAVED      → +0.7  (interested)
VIEWED     → +0.3  (mild interest)
DISMISSED  → −0.5  (negative signal)
```

This means: *"If students who have similar application histories all applied to this internship, you probably should too."*

---

### Step 5 — Hybrid Scoring

The two scores are combined using dynamically learned weights:

```
Hybrid Score = α × Content Score + β × Collaborative Score
```

Where `α + β = 1`. The initial weights are `α = 0.6`, `β = 0.4`, but they **update automatically** through reinforcement learning.

**Threshold Filtering**: Only internships with `Hybrid Score ≥ threshold` (default 0.3) are included. This filters out low-relevance noise.

**Top-K Ranking**: The filtered results are sorted descending by Hybrid Score and the top K (default 10) are returned.

All recommendations are persisted to the `Recommendation` table with their scores and ranks so they can be served from cache on subsequent requests.

---

### Step 6 — Reinforcement Learning Weight Updates

Every time a student interacts with a recommendation (apply, save, view, dismiss), the system runs a **policy gradient update** (`lib/algorithm/rl.ts`):

```
reward = action_reward (or explicit rating / 5)

α_new = α + lr × reward × (contentScore − hybridScore)
β_new = β + lr × reward × (collabScore  − hybridScore)
```

Then normalize: `α_new = α_new / (α_new + β_new)`

**Interpretation**: If a positive-reward action happened on a recommendation where the content score was high but the collaborative score was low, the algorithm increases `α` (trusts content more). If it was the collaborative score that drove the match, it increases `β`.

**Adaptive Threshold**: The threshold also adjusts — lowering when recommendations get positive feedback (be more inclusive) and rising when feedback is negative (be stricter).

This is a simplified **REINFORCE-style** policy gradient where the recommendation scoring function is the policy being optimized.

---

## Data Flow Diagram

```
Student fills profile
        │
        ▼
Profile text constructed (12+ fields serialized)
        │
        ▼
Gemini text-embedding-004
        │
        ▼ 768-dim vector
Stored in DB (cached)
        │
        ├─────────────────────────────────┐
        │                                 │
        ▼                                 ▼
Cosine Similarity              Collaborative Filtering
with each internship           (peer interaction matrix)
        │                                 │
        ▼                                 │
Skills Overlap Score                      │
        │                                 │
        ▼                                 │
GPA Eligibility Score                     │
        │                                 │
        ▼                                 ▼
  Content Score (0.0–1.0)     Collab Score (0.0–1.0)
        │                                 │
        └──────────────┬──────────────────┘
                       │
                       ▼
          Hybrid Score = α×content + β×collab
                       │
                       ▼
           Filter: score ≥ threshold (0.3)
                       │
                       ▼
           Sort desc → Top-K (10) results
                       │
                       ▼
         Persist to Recommendation table
                       │
                       ▼
          Displayed to student with scores
                       │
                       ▼
           User interacts (apply/save/dismiss)
                       │
                       ▼
        RL weight update (gradient step)
                       │
                       ▼
           α and β updated for next run
```

---

## Database Schema

```
User ──┬── Student ──┬── Recommendation ──┬── Feedback
       │             └── Feedback         │
       └── Company ──── Internship ───────┘
                                └── Recommendation
                                └── Feedback

ModelWeights (global — one row stores current α, β, threshold, topK)
```

---

## File Structure

```
internship-recommendation/
├── app/
│   ├── page.tsx                    ← Landing page
│   ├── layout.tsx                  ← Root layout with ClerkProvider
│   ├── middleware.ts               ← Clerk auth middleware
│   ├── onboarding/page.tsx         ← Role selection (Student / Company)
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/ ← Clerk sign-in
│   │   └── sign-up/[[...sign-up]]/ ← Clerk sign-up
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Sidebar + nav
│   │   ├── dashboard/page.tsx      ← Overview stats
│   │   ├── profile/page.tsx        ← Student profile editor
│   │   ├── recommendations/page.tsx← AI recommendations with scores
│   │   ├── internships/
│   │   │   ├── page.tsx            ← Browse + filter + paginate
│   │   │   └── [id]/page.tsx       ← Internship detail
│   │   └── company/page.tsx        ← Post/manage internships
│   └── api/
│       ├── students/route.ts       ← Student CRUD
│       ├── internships/route.ts    ← Internship CRUD (public GET)
│       ├── internships/[id]/route.ts
│       ├── recommendations/route.ts← Generate + serve recommendations
│       ├── feedback/route.ts       ← Record interactions + trigger RL
│       ├── company/route.ts        ← Company profile CRUD
│       ├── onboarding/route.ts     ← User upsert
│       └── webhooks/clerk/route.ts ← Clerk user lifecycle webhook
├── lib/
│   ├── db.ts                       ← Prisma singleton
│   ├── gemini.ts                   ← Gemini client (embeddings + chat)
│   └── algorithm/
│       ├── embeddings.ts           ← Build text → call Gemini embedding API
│       ├── similarity.ts           ← Cosine similarity, skills overlap, GPA score
│       ├── collaborative.ts        ← User-based collaborative filtering
│       ├── hybrid.ts               ← Main recommendation orchestrator
│       └── rl.ts                   ← Reinforcement learning weight updater
├── prisma/
│   ├── schema.prisma               ← Full database schema
│   └── seed.ts                     ← Initial seed data
├── components/ui/                  ← shadcn/ui component library
└── .env                            ← Environment variables (never commit)
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/students` | Required | Get current student profile |
| POST | `/api/students` | Required | Create student profile |
| PUT | `/api/students` | Required | Update student profile |
| GET | `/api/internships` | Public | Browse internships (search, filter, paginate) |
| POST | `/api/internships` | Company | Post new internship |
| GET | `/api/internships/[id]` | Public | Get internship details |
| PUT | `/api/internships/[id]` | Company (owner) | Update internship |
| DELETE | `/api/internships/[id]` | Company (owner) | Delete internship |
| GET | `/api/recommendations` | Student | Get AI recommendations (cached or fresh) |
| GET | `/api/recommendations?refresh=true` | Student | Force regenerate recommendations |
| POST | `/api/feedback` | Student | Record interaction (triggers RL update) |
| GET | `/api/company` | Company | Get company + internships |
| POST | `/api/company` | Required | Create company profile |
| PUT | `/api/company` | Company | Update company profile |
| POST | `/api/onboarding` | Required | Upsert user after first login |
| POST | `/api/webhooks/clerk` | Webhook | Clerk user lifecycle events |

---

## Key Design Decisions

### Why Gemini instead of local BERT?
Running BERT locally in a Next.js serverless environment is impractical (model size ~440MB, cold starts). Gemini's `text-embedding-004` provides equivalent or better quality embeddings via API call with sub-second latency.

### Why cache embeddings in PostgreSQL?
Embedding generation costs API credits and latency. A student's embedding only needs to be recomputed when their profile changes. Same for internships — only recompute when description/skills change.

### Why store recommendations in the DB?
Recommendation generation can take 2–10 seconds (multiple embedding calls). Caching recommendations for 1 hour means most page loads are instant. The `?refresh=true` query parameter forces regeneration.

### Why REINFORCE-style RL instead of a bandit/DQN?
The recommendation space is sparse (students don't interact with hundreds of internships daily). A simple policy gradient on the two mixing weights (content vs. collaborative) is interpretable, stable, and doesn't require a replay buffer or separate value network.
