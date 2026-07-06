# 🏫 Camptel AI — Campus Decision Intelligence Platform

> **Built for Gen AI Academy APAC Edition — Google Cloud Hackathon 2026**  
> *Leveraging Google BigQuery, Gemini AI, and NVIDIA RAPIDS cuDF for real-time campus analytics*

<p align="center">
  <img src="https://storage.googleapis.com/gweb-cloudblog-publish/images/GenAI_Academy_APAC.max-1000x1000.png" alt="Gen AI Academy APAC Edition" width="400"/>
</p>

Camptel AI is a next-generation decision intelligence platform for higher education institutions. It transforms raw campus data into actionable insights — identifying at-risk students, tracking placement readiness, optimising classroom utilisation, and answering natural-language questions about institutional data — all powered by Google Cloud's AI and data stack.

---

## 🚀 Features

### 1. Decision Intelligence Dashboard (`/`)
A multi-tabbed dashboard with three analytical panels:

| Panel | Description |
|-------|-------------|
| **Academic Risk** | Filter by course and minimum risk score. Summary cards (total students, high-risk count, average risk). Top-10 horizontal bar chart. Color-coded student table with Low/Moderate/High risk badges. CSV export. |
| **Placement Readiness** | Filter by branch and minimum readiness index. Readiness distribution bar chart (4 buckets). Student table with Ready/Needs Work/At Risk badges. CSV export. |
| **Classroom Utilisation** | Date-picker with utilisation heatmap (time slots × days). Summary cards (rooms booked, available, over-capacity alerts). Conflict alerts for rooms at ≥90% utilisation. |

### 2. AI Assistant (`/assistant`)
A conversational Q&A interface that translates plain English into SQL, executes it against BigQuery, and returns a human-readable summary:

- **Natural Language → SQL**: Gemini 2.5 Flash generates BigQuery-compatible SQL from your question
- **Live Execution**: Runs the SQL against your BigQuery dataset
- **AI Summarisation**: Gemini summarises query results with actionable recommendations
- **Transparency**: Collapsible SQL code block and raw data table shown alongside the answer
- **Suggestion Chips**: One-click starter questions for common scenarios
- **Graceful Fallback**: Works with mock data when BigQuery is not configured

### 3. Decision Challenges (`/challenges`)
A library of pre-built analytical scenarios across three categories:

- 📊 **Academic** — "Top 10 at-risk students", "Low attendance in CS"
- 🎯 **Placement** — "Placement readiness summary", "Skill gap analysis"
- 🏛️ **Infrastructure** — "Overbooked classrooms"

Each challenge runs a live query against your data and offers follow-up actions.

### 4. GPU Acceleration Proof (`/performance`)
A showcase page demonstrating **11.5x speedup** using NVIDIA RAPIDS cuDF over standard Pandas on a 1.2-million-row student attendance dataset:

- Side-by-side comparison: Pandas (CPU — 45.2s) vs cuDF (GPU — 4.1s)
- Animated speedup metric with confetti effect
- Step-by-step explanation of the acceleration pipeline
- Recharts bar chart comparison

### Additional Features
- 🌓 **Dark Mode** — Full light/dark theme with system preference detection and manual toggle
- 📱 **Responsive** — Adapts to mobile, tablet, and desktop (375px → 1440px+)
- 📤 **CSV Export** — One-click download on all dashboard panels
- ⚡ **Skeleton Loading** — Animated pulse placeholders during data fetches
- 🛡️ **Error Recovery** — Error cards with retry buttons on all data-dependent components
- 🎨 **Premium UI** — Gradient hero section, backdrop blur, glassmorphism, micro-animations

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 3.4 |
| **Charts** | Recharts 2.12 |
| **Database** | Google BigQuery (`@google-cloud/bigquery` v7) |
| **AI** | Google Gemini 2.5 Flash (`@google/genai` v2) |
| **Forms** | React Hook Form 7.51 |
| **Font** | Inter (via `next/font`) |
| **Date Utils** | date-fns 3.6 |
| **Unique IDs** | uuid 9.0 |
| **Syntax** | ESLint 8 + TypeScript 5.4 |

---

## 📂 Project Structure

```
camptel-ai/
├── app/                          # Next.js 14 App Router
│   ├── api/
│   │   ├── acceleration/         # GET — returns GPU benchmark JSON
│   │   ├── ask-gemini/           # POST — NL → SQL → BigQuery → summary
│   │   ├── at-risk/              # GET — filtered at-risk student data
│   │   ├── classroom/            # GET — classroom utilisation by date
│   │   └── placement/            # GET — filtered placement readiness data
│   ├── assistant/
│   │   └── page.tsx              # AI Assistant page (renders ChatInterface)
│   ├── challenges/
│   │   └── page.tsx              # Challenge library with live query runner
│   ├── performance/
│   │   └── page.tsx              # GPU benchmark showcase with confetti
│   ├── globals.css               # Tailwind directives, custom utilities, keyframes
│   ├── layout.tsx                # Root layout: Navbar, ThemeProvider, footer
│   └── page.tsx                  # Dashboard entry (renders DashboardTabs)
│
├── components/
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Card.tsx              # Versatile card (bordered, glass variants)
│   │   ├── EmptyState.tsx        # Empty state with icon + message
│   │   ├── ErrorCard.tsx         # Error state with retry button
│   │   └── Spinner.tsx           # Animated loading spinner
│   ├── AcademicRiskPanel.tsx     # Academic risk tab — filters, chart, table
│   ├── ChatInterface.tsx         # Full chat UI with message bubbles, SQL viewer
│   ├── ClassroomPanel.tsx        # Classroom tab — heatmap, conflicts
│   ├── DashboardTabs.tsx         # Tab manager + gradient hero header
│   ├── Navbar.tsx                # Responsive nav with theme toggle
│   ├── PlacementPanel.tsx        # Placement tab — distribution chart, table
│   └── ThemeProvider.tsx         # React context for light/dark theme
│
├── lib/
│   ├── BigQuery.ts               # BigQuery client singleton & parameterised query helper
│   ├── export.ts                 # CSV & JSON export utilities (browser-side)
│   ├── types.ts                  # Shared TypeScript interfaces
│   └── vertexai.ts               # Gemini client singleton via @google/genai
│
├── data/
│   ├── benchmark.json            # Pre-computed GPU benchmark (45.2s vs 4.1s, 11.5x)
│   └── challenges.json           # 5 challenge scenarios with follow-up questions
│
├── keys/                         # Service account key files (gitignored)
├── generate_data.py              # Synthetic data generator (50K students, 10K rooms)
├── .env.local                    # Environment variables (gitignored)
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── next-env.d.ts
```

---

## 🗄️ API Routes

### `GET /api/at-risk`
Returns filtered at-risk student data.

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `course` | string | `"All Courses"` | Course filter (`"Computer Science"`, `"Electrical"`, `"Mechanical"`) |
| `minRisk` | number | `0` | Minimum risk score threshold (0–100) |

**Response:** `{ students: [{ rollNo, name, course, attendance, marks, riskScore }] }`

**SQL:** Queries `student_risk` table, filters by `risk_score >= @minRisk` and optional `course = @course`, orders by `riskScore DESC`, limits to 50.

### `GET /api/placement`
Returns filtered placement readiness data.

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `branch` | string | `"All Branches"` | Branch filter |
| `minReadiness` | number | `0` | Minimum readiness index threshold (0–100) |

**Response:** `{ readiness: [{ name, branch, cgpa, technical, communication, readiness }] }`

**SQL:** Queries `placement_readiness` table, filters by `readiness_index >= @minReadiness`, orders by `readiness DESC`, limits to 50.

### `GET /api/classroom`
Returns classroom utilisation grouped by day.

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `date` | string | *(required)* | Date string (`"2026-07-06"`) |

**Response:** `{ utilization: [{ day, slots: [{ time, utilization, room, status }] }], date }`

**SQL:** Queries `classroom_utilization` table, filters by `date = @date`, orders by `time_slot`.

### `GET /api/acceleration`
Returns pre-computed GPU benchmark data.

**Response:** `{ task, pandas_time_sec, cudf_time_sec, speedup, dataset_size }`

### `POST /api/ask-gemini`
Natural-language query → SQL → BigQuery → AI summary pipeline.

| Body Param | Type | Description |
|------------|------|-------------|
| `question` | string | Natural-language question about campus data |

**Response:** `{ answer: string, sql: string, rows: object[], mock?: boolean }`

**Pipeline:**
1. Injects database schema into a prompt for Gemini 2.5 Flash
2. Gemini generates a BigQuery SQL query
3. SQL is validated (must start with `SELECT`)
4. SQL is executed against BigQuery
5. Results (first 5 rows) are passed to Gemini for a plain-English summary
6. Returns the summary, SQL, and data rows

If BigQuery is unavailable, returns a mock response with the generated SQL.

---

## 🛠️ Setup Guide

### Prerequisites

- **Node.js** 18.17+ (LTS recommended)
- **npm** 9+
- **Google Cloud Project** with BigQuery enabled (optional for full functionality)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/) (required for AI Assistant)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd camptel-ai
npm install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
# Required — Get from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Required for BigQuery integration
GCP_PROJECT_ID=your_gcp_project_id
BIGQUERY_DATASET=campus_data

# Optional — If not set, falls back to Application Default Credentials
GCP_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...",...}
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new key (free tier available with generous quota)
4. Copy the key into `GEMINI_API_KEY`

**Setting up BigQuery (optional, for live data):**
1. Create a Google Cloud Project
2. Enable the BigQuery API
3. Create a dataset named `campus_data`
4. Upload the CSV files (see Data Generation below)
5. Create a service account, download JSON key, and set `GCP_SERVICE_ACCOUNT_KEY` or point `GOOGLE_APPLICATION_CREDENTIALS` to the key file

### 3. Generate Synthetic Data

```bash
python generate_data.py
```

This creates three CSV files with realistic campus data:

| File | Rows | Description |
|------|------|-------------|
| `student_risk.csv` | 50,000 | Student attendance, marks, LMS engagement, risk scores |
| `placement_readiness.csv` | 50,000 | CGPA, technical/communication scores, internship experience |
| `classroom_utilization.csv` | 10,000 | Room bookings with capacity, occupancy, utilisation % |

**Upload to BigQuery (if using BigQuery):**
1. Go to GCP Console → BigQuery → your dataset
2. Click "Create table" → Upload → Select file
3. Set table names: `student_risk`, `placement_readiness`, `classroom_utilization`
4. Enable "Auto-detect schema"

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production Build

```bash
npm run build
npm start
```

### 6. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Set all environment variables in the Vercel dashboard (Settings → Environment Variables).

---

## 🎨 Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Brand 600 | `#2563EB` | Buttons, active tabs, links, primary accents |
| Emerald 500 | `#22C55E` | Safe/low risk states, success indicators |
| Amber 500 | `#EAB308` | Medium risk, warnings |
| Red 500 | `#EF4444` | High risk, alerts, danger |
| Surface 50 | `#F9FAFB` | Page background |
| Surface 900 | `#111827` | Headings |
| Surface 700 | `#374151` | Body text |
| Surface 500 | `#64748B` | Secondary/label text |

### Typography

- **Font**: Inter (Google Fonts, loaded via `next/font`)
- **Scale**: `text-xs` (labels), `text-sm` (body/tables), `text-base`, `text-lg` (card titles), `text-2xl`/`text-3xl` (page titles)
- **Weights**: `font-medium`, `font-semibold`, `font-bold`

### Components

- **Cards**: `rounded-xl shadow-sm border border-surface-200 bg-white`
- **Buttons**: `rounded-lg` with hover darken, disabled states
- **Badges**: `rounded-full px-2.5 py-0.5 text-xs font-semibold`
- **Inputs**: `rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5`
- **Modals/Overlays**: `rounded-2xl shadow-xl`
- **Max width**: `max-w-7xl` (1280px), centered via `mx-auto`

### Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| **Desktop** (≥1024px) | Full layout, 3-column summary cards, side-by-side chart & table |
| **Tablet** (768–1023px) | 2-column then 1-column cards, stacked chart & table |
| **Mobile** (<768px) | Hamburger nav, scrollable tabs, full-width cards, scrollable tables |

---

## 🧪 Data Schemas (BigQuery)

### `student_risk`
| Column | Type | Description |
|--------|------|-------------|
| `roll_no` | STRING | Student roll number |
| `name` | STRING | Student name |
| `course` | STRING | Course name |
| `semester` | STRING | Current semester |
| `attendance_pct` | FLOAT | Attendance percentage |
| `avg_marks` | FLOAT | Average marks |
| `lms_engagement_score` | FLOAT | LMS engagement score (0–100) |
| `risk_score` | FLOAT | Computed risk score (0–100) |

**Risk formula:** `100 - (attendance * 0.4 + avg_marks * 0.4 + lms_engagement * 0.2)`

### `placement_readiness`
| Column | Type | Description |
|--------|------|-------------|
| `roll_no` | STRING | Student roll number |
| `name` | STRING | Student name |
| `branch` | STRING | Branch name |
| `cgpa` | FLOAT | Cumulative GPA (5.0–10.0) |
| `technical_score` | FLOAT | Technical assessment score (0–100) |
| `communication_score` | FLOAT | Communication assessment score (0–100) |
| `internship_experience` | INTEGER | Number of internships (0–3) |
| `readiness_index` | FLOAT | Computed readiness index (0–100) |

**Readiness formula:** `technical * 0.4 + communication * 0.3 + cgpa * 10 * 0.2 + internship * 10 * 0.1`

### `classroom_utilization`
| Column | Type | Description |
|--------|------|-------------|
| `room_no` | STRING | Room identifier |
| `date` | DATE | Booking date |
| `time_slot` | STRING | Time slot |
| `booked_by` | STRING | Course booking the room |
| `capacity` | INTEGER | Room capacity |
| `occupancy` | INTEGER | Actual occupancy |
| `utilization_pct` | FLOAT | Utilization percentage |

---

## 🤖 AI Assistant Examples

Try these questions in the AI Assistant:

- *"Show the top 10 students by risk_score, with their name, course, attendance_pct, avg_marks"*
- *"List CS students with attendance_pct < 60, show name, semester, attendance_pct, and risk_score"*
- *"List rooms, dates, and time slots where utilization_pct > 90 for the next 7 days"*
- *"For each branch, show the number of students and average readiness_index"*
- *"List students from all branches with readiness_index > 70 but communication_score < 50"*

---

## 🏆 Hackathon Context

This project was built for the **Gen AI Academy APAC Edition — Google Cloud Hackathon 2026**, a competition focused on leveraging Google Cloud's generative AI and data platform to solve real-world problems across the Asia-Pacific region.

### Problem Statement
Higher education institutions collect vast amounts of data — attendance records, academic performance, placement metrics, and infrastructure usage — but struggle to convert this data into timely, actionable decisions. Traditional dashboards require technical skills to query and often lack predictive or conversational capabilities.

### Solution
Camptel AI bridges this gap by combining:
1. **Google BigQuery** — Scalable, serverless data warehouse powering all analytical queries
2. **Gemini 2.5 Flash** — Natural language understanding, SQL generation, and AI-powered insight summarisation
3. **NVIDIA RAPIDS cuDF** — GPU-accelerated data processing demonstrated in the Performance page
4. **Next.js 14** — Modern React framework with server components, streaming, and edge deployment on Vercel

### Impact
- **Academic**: Early identification of at-risk students enables timely intervention, improving retention
- **Placement**: Track readiness across branches to focus training resources effectively
- **Operations**: Optimise classroom allocation and detect scheduling conflicts proactively
- **Accessibility**: Non-technical staff can query institutional data in plain English

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Built for **Gen AI Academy APAC Edition — Google Cloud Hackathon 2026**. All rights reserved.
