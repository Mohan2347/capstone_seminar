# SmartMatch AI — Hybrid Internship Recommendation System

## Short Description

The **SmartMatch AI Hybrid Internship Recommendation Algorithm** is an intelligent recommendation system designed to match students with the most suitable internship opportunities. It analyzes multiple aspects of a student's profile — such as academic background, skills, experience, preferences, and personality — and compares them with internship requirements. Using BERT-based embeddings, cosine similarity, collaborative filtering, and reinforcement learning, the system calculates a hybrid score to rank internships and generate personalized recommendations for each student. The algorithm continuously improves its recommendations by incorporating user feedback and updating model weights.

---

## Key Features

| Feature                                 | Description                                                                                                                       |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Comprehensive Profile Analysis**      | Uses academic records, skills, experience, preferences, and personality traits to understand each student                         |
| **AI-Powered Feature Embeddings**       | Converts profiles and internship descriptions into vector representations using BERT embeddings for deeper semantic understanding |
| **Content-Based Similarity Matching**   | Calculates similarity between students and internships using cosine similarity                                                    |
| **Collaborative Filtering Integration** | Incorporates feedback and patterns from other users to improve recommendation accuracy                                            |
| **Hybrid Scoring Model**                | Combines content similarity and collaborative similarity using a weighted hybrid score                                            |
| **Reinforcement Learning Optimization** | Updates recommendation weights dynamically based on user feedback and rewards                                                     |
| **Threshold-Based Filtering**           | Only internships that meet a minimum relevance score are recommended                                                              |
| **Personalized Ranking System**         | Ranks all internships and selects the Top-K recommendations for each student                                                      |

---

## Tech Stack

### Frontend

| Technology          | Version         | Purpose                                                             |
| ------------------- | --------------- | ------------------------------------------------------------------- |
| **Next.js**         | 16 (App Router) | Full-stack React framework — server components, routing, API routes |
| **TypeScript**      | 5               | Type safety across the entire codebase                              |
| **TailwindCSS**     | v4              | Utility-first CSS with custom oklch theme tokens                    |
| **shadcn/ui**       | latest          | Pre-built accessible UI components (Cards, Badges, Buttons, etc.)   |
| **Lucide React**    | latest          | Icon library                                                        |
| **react-hook-form** | v7              | Form state management with validation                               |
| **Zod**             | v4              | Schema validation for forms and API inputs                          |

### Backend / API

| Technology              | Version | Purpose                                                    |
| ----------------------- | ------- | ---------------------------------------------------------- |
| **Next.js API Routes**  | 16      | REST API endpoints served from `/app/api/`                 |
| **Prisma ORM**          | latest  | Type-safe database client and schema management            |
| **NeonDB (PostgreSQL)** | latest  | Serverless PostgreSQL database                             |
| **Clerk**               | v7      | Authentication — sign in, sign up, user sessions, webhooks |

### AI / Machine Learning

| Technology                                   | Purpose                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| **Google Generative AI SDK**                 | SDK to interact with Gemini models                                      |
| **Gemini `gemini-embedding-001`**            | Generates 768-dimensional semantic embeddings from text (BERT-based)    |
| **Gemini `gemini-2.5-flash-lite`**           | Text generation for AI-powered features                                 |
| **Cosine Similarity**                        | Measures angular similarity between embedding vectors                   |
| **Collaborative Filtering**                  | User-based CF using interaction history and shared internship patterns  |
| **Reinforcement Learning (REINFORCE-style)** | Policy gradient updates to model weights based on user feedback rewards |

---

## Project Structure

```
internship-recommendation/
├── app/
│   ├── (auth)/                    # Sign-in / Sign-up pages (Clerk)
│   ├── (browse)/                  # Public pages — no auth required
│   │   ├── layout.tsx             # Topnav layout with conditional auth links
│   │   └── internships/
│   │       ├── page.tsx           # Browse all internships (search + filter)
│   │       └── [id]/
│   │           ├── page.tsx       # Internship detail page
│   │           └── feedback-buttons.tsx  # Save / Apply / Dismiss (client)
│   ├── (dashboard)/               # Protected pages — auth required
│   │   ├── layout.tsx             # Sidebar layout with user avatar topbar
│   │   ├── sidebar-nav.tsx        # Active-state aware nav (client component)
│   │   ├── dashboard/             # Main dashboard
│   │   ├── recommendations/       # AI-generated recommendations
│   │   ├── saved/                 # Saved internships list
│   │   ├── profile/               # Student profile CRUD
│   │   └── company/               # Company profile + internship management
│   ├── api/
│   │   ├── internships/           # GET (public browse) + POST (company create)
│   │   ├── internships/[id]/      # GET / PUT / DELETE single internship
│   │   ├── recommendations/       # GET — cached or freshly generated
│   │   ├── feedback/              # POST — record action + trigger RL update
│   │   ├── saved/                 # GET (list saved) + DELETE (unsave)
│   │   ├── students/              # GET / POST / PUT student profile
│   │   ├── company/               # GET / POST / PUT company profile
│   │   ├── onboarding/            # POST — user upsert on first login
│   │   └── webhooks/clerk/        # Clerk webhook handler
│   ├── globals.css                # Theme — oklch CSS custom properties
│   ├── layout.tsx                 # Root layout (Poppins font, Clerk provider)
│   └── page.tsx                   # Landing page
├── lib/
│   ├── db.ts                      # Prisma singleton
│   ├── gemini.ts                  # Gemini SDK setup (embedding + text models)
│   └── algorithm/
│       ├── embeddings.ts          # Build text → call Gemini → return vectors
│       ├── similarity.ts          # Cosine similarity, skills overlap, GPA score
│       ├── collaborative.ts       # User-based collaborative filtering
│       ├── hybrid.ts              # Main engine: content + CF → hybrid score
│       └── rl.ts                  # Reinforcement learning weight updater
├── prisma/
│   ├── schema.prisma              # Database models
│   └── seed.ts                    # 10 companies, 30 internships seed data
└── proxy.ts                       # Clerk middleware — public vs protected routes
```

## Algorithm — Step by Step

### Step 1 — Build Student Text Representation

**File:** `lib/algorithm/embeddings.ts` → `buildStudentText()`

The student's entire profile is serialized into a single rich text string:

```
"Student profile: John Doe. Major: Computer Science. University: IIT Delhi.
CGPA: 8.5. Skills: Python, Machine Learning, React. Preferred roles: SDE Intern,
ML Intern. Preferred industries: Technology, Healthcare. Work types: remote, hybrid.
Experience: ML Research Intern at DRDO: Built NLP pipeline for document classification.
Personality traits: openness=0.8, conscientiousness=0.9, extraversion=0.5"
```

This text captures academic background, skills, experience, preferences, and personality in a format the embedding model can semantically understand.

---

### Step 2 — Build Internship Text Representation

**File:** `lib/algorithm/embeddings.ts` → `buildInternshipText()`

Similarly, each internship is serialized:

```
"Internship: ML Engineer Intern. Industry: Technology. Description: Build NLP
pipelines for our platform... Required skills: Python, Machine Learning, PyTorch.
Preferred skills: TensorFlow, Docker. Location: Remote. Work type: remote.
Duration: 3 months. Minimum GPA: 3.0"
```

---

### Step 3 — Generate Embeddings (BERT-based via Gemini)

**File:** `lib/gemini.ts`, `lib/algorithm/embeddings.ts`

Both texts are passed to **Gemini `gemini-embedding-001`** (a BERT-based dense retrieval model) which returns a **768-dimensional float vector** for each. These vectors capture deep semantic meaning — similar concepts map to nearby points in vector space.

Embeddings are cached in the database (`Student.embedding`, `Internship.embedding`) and only recomputed when profiles change, keeping API costs low.

---

### Step 4 — Content-Based Score

**File:** `lib/algorithm/hybrid.ts` → `computeContentScore()`

Three sub-scores are combined:

#### 4a. Embedding Cosine Similarity

```
embeddingScore = (cosine(studentVec, internshipVec) + 1) / 2   → [0, 1]
```

**File:** `lib/algorithm/similarity.ts` → `cosineSimilarity()`

Cosine similarity measures the angle between two vectors. A score of 1.0 means perfectly aligned (semantically identical), 0 means orthogonal (unrelated). The `+1 / 2` normalization maps the `[-1, 1]` range to `[0, 1]`.

#### 4b. Skills Overlap Score

```
skillScore = matched_required_skills / total_required_skills   → [0, 1]
```

**File:** `lib/algorithm/similarity.ts` → `skillsOverlapScore()`

Counts how many of the internship's required skills the student explicitly lists in their profile. Case-insensitive matching.

#### 4c. GPA Eligibility Score

```
gpaScore = 1.0  if student.gpa >= internship.requiredGpa
         = 0.5 * (student.gpa / requiredGpa)  if below threshold
         = 0.5  if GPA unknown (neutral)
```

**File:** `lib/algorithm/similarity.ts` → `gpaScore()`

#### 4d. Weighted Combination

```
contentScore = 0.60 × embeddingScore
             + 0.25 × skillScore
             + 0.15 × gpaScore
```

---

### Step 5 — Collaborative Filtering Score

**File:** `lib/algorithm/collaborative.ts` → `collaborativeScore()`

User-based collaborative filtering finds students with similar feedback histories and uses their interactions to estimate how relevant an internship is for the current student.

#### Algorithm:

1. Fetch all feedback on the target internship from **other students** (peers)
2. For each peer, compute their **interaction similarity** to the current student:
   - Map each feedback action to a reward: `APPLIED=1.0`, `SAVED=0.7`, `VIEWED=0.3`, `DISMISSED=-0.5`
   - Compute cosine similarity on shared internship interaction vectors (like user-item matrix cosine similarity)
3. Compute each peer's **average reward** for the target internship
4. Aggregate:
   ```
   cfScore = Σ(similarity_i × reward_i) / Σ(similarity_i)
   ```
5. Normalize to `[0, 1]`

This means: _"Students who interacted similarly to you on other internships also liked this one → you probably will too."_

---

### Step 6 — Hybrid Score Calculation

**File:** `lib/algorithm/hybrid.ts` → `generateRecommendations()`

```
hybridScore = contentWeight × contentScore + collaborativeWeight × cfScore
```

Initial weights (stored in `ModelWeights` table):

- `contentWeight = 0.6`
- `collaborativeWeight = 0.4`

These weights are **not fixed** — they evolve via reinforcement learning (Step 8).

---

### Step 7 — Threshold Filtering + Top-K Ranking

```
if hybridScore >= threshold (default: 0.3):
    add to candidate list

sort candidates descending by hybridScore
return top-K results (default: K = 10)
```

Internships below the threshold are considered irrelevant and excluded. This prevents surfacing poor matches just to fill the list. Results are saved to the `Recommendation` table with their scores and rank.

---

### Step 8 — Reinforcement Learning Weight Update

**File:** `lib/algorithm/rl.ts` → `updateWeightsFromFeedback()`

Every time a student interacts with a recommendation (Save, Apply, Dismiss, or Rate), the system uses a **REINFORCE-style policy gradient** to update the model weights:

#### Reward Signal

```
reward = rating / 5                    if explicit rating given
reward = (ACTION_REWARD[action]+1) / 2  otherwise

APPLIED   → reward ≈ 1.0
SAVED     → reward ≈ 0.85
VIEWED    → reward ≈ 0.65
DISMISSED → reward ≈ 0.25
```

#### Policy Gradient Update

```
contentWeight   += lr × reward × (contentScore - hybridScore)
collabWeight    += lr × reward × (collabScore  - hybridScore)
```

This nudges the weight of whichever component contributed more toward the final score in the direction of the reward. If content similarity was the dominant driver of a good recommendation, `contentWeight` increases slightly.

#### Normalization

```
weights are clamped to [0.1, 0.9]
then re-normalized so: contentWeight + collabWeight = 1
```

#### Adaptive Threshold

```
if reward > 0.5:  threshold -= lr × 0.1   # lower bar on positive signals
if reward < 0.2:  threshold += lr × 0.1   # raise bar on negative signals
```

The learning rate is `lr = 0.01` (small, stable updates). Over many interactions across all students, the global weights shift to reflect what actually works.

---

### Step 9 — Recommendation Caching

**File:** `app/api/recommendations/route.ts`

To avoid hitting the Gemini API on every page load, recommendations are **cached in the database**:

- On `GET /api/recommendations`: check if a `Recommendation` record exists that is **less than 1 hour old**
- If fresh → return cached results immediately
- If stale or `?refresh=true` is passed → call `generateRecommendations()`, save new results to DB, return fresh data

This means the user sees instant results on revisit, and only pays the embedding cost when they explicitly ask for a refresh.

---

## Data Flow — Full End-to-End

```
Student fills profile (skills, GPA, preferences, personality)
           ↓
GET /api/recommendations
           ↓
   Check DB cache (< 1 hour old?)
   YES → return cached recommendations
   NO  ↓
           ↓
   Build student text → Gemini embedding → 768-dim vector (cached)
           ↓
   For each active internship:
     Build internship text → Gemini embedding → 768-dim vector (cached)
     contentScore  = 0.6×cosine + 0.25×skills + 0.15×GPA
     cfScore       = weighted average of peer interactions
     hybridScore   = contentWeight×contentScore + collabWeight×cfScore
           ↓
   Filter by threshold → Sort → Take Top-K
           ↓
   Save to Recommendation table (upsert)
           ↓
   Return to frontend → displayed with score breakdown
           ↓
Student clicks Save / Apply / Dismiss / Rates
           ↓
POST /api/feedback
           ↓
   Record Feedback row in DB
   Compute reward signal
   Run RL policy gradient → update ModelWeights in DB
           ↓
Next recommendation cycle uses updated weights
```

## Scoring Formula Summary

```
contentScore  = 0.60 × embeddingSimilarity
              + 0.25 × skillsOverlap
              + 0.15 × gpaEligibility

hybridScore   = contentWeight × contentScore
              + collaborativeWeight × cfScore

              (default: contentWeight=0.6, collaborativeWeight=0.4)

threshold     = 0.3   (minimum hybridScore to be recommended)
topK          = 10    (maximum recommendations returned)
learningRate  = 0.01  (RL weight update step size)
```
