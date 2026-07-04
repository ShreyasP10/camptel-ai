# 1. Application Overview – Pages & Routes
The app has 4 distinct pages accessible via a top navigation bar:

Route	Page Name	Purpose
/	Dashboard	Tabbed view: Academic Risk, Placement Readiness, Classrooms
/assistant	AI Assistant	Conversational Q&A interface with Gemini
/performance	Performance	GPU acceleration proof with benchmarks
(none)	404 Page	Simple custom “Page not found”
All pages share a persistent top navigation bar and a consistent footer. Layout is centered and responsive.

# 2. Global Design System
Color Palette
Primary: Blue 600 (#2563EB) – buttons, active tabs, links

Success: Green 500 (#22C55E) – safe/low‑risk states

Warning: Yellow 500 (#EAB308) – medium risk

Danger: Red 500 (#EF4444) – high risk, alerts

Background: Gray 50 (#F9FAFB) – page body

Surface: White (#FFFFFF) – cards, panels

Text: Gray 900 (#111827) for headings, Gray 700 (#374151) for body

Border: Gray 200 (#E5E7EB)

Typography
Font: Inter (Google Fonts), loaded via next/font

Headings: font-semibold, sizes text-2xl (page titles), text-lg (card titles), text-sm (labels)

Body: text-base, text-sm for tables

Spacing & Sizing
Max content width: max-w-7xl (1280px), centered with mx-auto

Padding: p-6 (24px) for page sections, p-4 for cards

Gaps: gap-6 between major sections, gap-4 between elements

Shadows & Rounded Corners
Cards: rounded-xl shadow-sm border border-gray-200

Buttons: rounded-lg

Modals/overlays: rounded-2xl shadow-xl

# 3. Common Components
Navbar
Fixed top, full width, background white with bottom border.

Left: Logo (icon + “CampusPulse AI” text, link to home).

Right: Navigation links – Dashboard, AI Assistant, Performance.

Active link highlighted with primary color and subtle underline.

Mobile: Hamburger menu (icon) that toggles a vertical dropdown with the same links.

Sticky position: sticky top-0 z-50.

Footer
Simple, thin footer at the bottom of each page: “© 2026 CampusPulse AI. Built for Google Cloud Gen AI Academy.”

Gray text, small size (text-xs), centered.

Loading Spinner
Centered within the content area: animated SVG circle (h-8 w-8) in primary color.

Text below: “Loading insights…”

Error State
Full‑width card with a red border and an exclamation icon.

Message: “Something went wrong while fetching data. Please try again.”

Retry button (outlined, primary color) that re‑triggers the fetch.

Empty State
Illustration (placeholder icon, e.g., a checkmark or folder) and friendly message: “No students at risk in this category.”

Suggestion: “Try adjusting the filters.”

Data Cards (Summary)
Small rectangle card, white, shadow.

Top line: label (gray, text-sm), bottom line: large number (bold, text-3xl).

Optional color: green/red background tint if value indicates severity.

# 4. Page 1: Dashboard (/)
This is the landing page. It contains three tabs that the user switches between. No page refresh; state managed client‑side.

Top Section
Page heading: “Decision Intelligence Dashboard” (h2).

Subtitle: “Real‑time insights across academic, placement, and infrastructure data.”

Tab Bar
Three horizontal tabs: Academic Risk (active by default), Placement Readiness, Classroom Utilisation.

Styled as pill‑shaped buttons or underlined tabs. Active tab: white background, primary text, shadow. Inactive: gray‑100 background, gray‑500 text.

Responsive: scrollable horizontally on small screens.

Tab Content Panels
A) Academic Risk Panel
Filter Bar (horizontal, sticky below tab bar):

Dropdown: Course (Computer Science, Electrical, Mechanical, etc.)

Slider: Minimum Risk Score (0–100), with live number display (e.g., “50%”).

Auto‑fetches data on change (debounced).

Summary Cards Row (three cards):

“Total Students” (blue icon) – total count after filters.

“High Risk (>75%)” (red icon) – count with danger color.

“Average Risk Score” (yellow/blue) – numeric with one decimal.

Bar Chart (Recharts <BarChart>):

Horizontal or vertical bars showing top 10 at‑risk students (name vs. risk score).

Tooltip on hover: full name, risk %, attendance, marks.

Y-axis (names) truncated if too long.

Student Table (full width, scrollable):

Columns: Name, Roll No., Attendance %, Avg Marks, Risk Score.

Risk Score cell text colored: green (<30%), yellow (30‑70%), red (>70%).

Rows hover with light gray background.

Sorting arrows on columns (optional, nice to have).

Maximum 50 rows shown; “Load more” button if needed.

B) Placement Readiness Panel
Similar structure to Academic Risk but with different filters: Branch, Minimum Readiness Index.

Summary cards: “Students Ready (Index >75)”, “Need Improvement”, “Avg Readiness Score”.

Bar chart: readiness index distribution (buckets: 0–25, 26–50, 51–75, 76–100).

Table: Name, Branch, CGPA, Technical Score, Communication Score, Readiness Index. Color‑coded index.

C) Classroom Utilisation Panel
Filter: Date picker (or week selector).

Summary: “Rooms Booked”, “Available Rooms”, “Over‑capacity Alerts” (count).

Heatmap or grid: days of the week as columns, time slots as rows. Each cell is a room utilization % with a color gradient (green: low, yellow: medium, red: full/over). Hover reveals room details.

Below the heatmap, a list of specific rooms with booking conflicts (if any), shown as alert cards.

# 5. Page 2: AI Assistant (/assistant)
Layout
Centered narrow container (max width md or lg).

Heading: “Ask CampusPulse AI” with a sparkle icon.

Subtitle: “Ask questions about student performance, placements, or resources in plain English.”

Chat Interface
Message List area: takes up most of vertical space, h-[500px] with overflow-y-auto. Background light gray (bg-gray-50) with rounded corners.

User messages: aligned right, blue background (bg-blue-500 text-white), rounded bubble (rounded-2xl rounded-br-none), max width 70%.

Assistant messages: aligned left, white background with border, rounded bubble (rounded-2xl rounded-bl-none), max width 70%.

SQL Code Block: after assistant text, a collapsible <details> element with summary “Show SQL”. Code in <pre><code> with dark background (bg-gray-800 text-green-400), monospaced font, padding.

Smooth auto‑scroll to the latest message using useEffect and a dummy div at bottom.

Input Area (sticky bottom of chat container):

Text input with placeholder “e.g., Which CS students have attendance below 60%?”

Send button (blue, with arrow icon) on the right.

Press Enter to send.

Disabled state while loading (button shows spinner).

Typing Indicator: when awaiting response, show animated three‑dot “thinking” indicator in assistant bubble.

Empty State (first load)
Instead of messages, show a friendly prompt: “👋 Hi Dean! I can help you identify at‑risk students, check placement readiness, or find classroom conflicts. Try asking a question above.”


Followed by 3–4 suggestion chips (clickable): “Show CS students with high risk”, “Who is placement‑ready in Electronics?”, etc. Clicking fills input and triggers send.



# 6. Page 3: Performance (/performance)
Layout
Centered container, similar to Assistant.

Heading: “⚡ GPU Acceleration Proof”.

Subtitle: “See how NVIDIA RAPIDS cuDF makes our insights lightning fast.”

Content
Dataset Info Card: “Dataset: 1.2 million attendance records from 50,000 students over 1 year.”

Comparison Cards (two side by side):

Left card: “Pandas (CPU)” – gray‑ish background, large text “45.2 seconds”, small text below “on 8‑core CPU”.

Right card: “cuDF (GPU)” – green‑tinted background, large text “4.1 seconds”, small text below “on NVIDIA T4 GPU”.

Arrow or vs. icon between them.

Speedup Highlight: A large, prominent metric in the center – “11x speedup” in bold text-6xl primary color, with a small label “real‑time risk analysis enabled”.

Bar Chart (Recharts): simple horizontal bar chart comparing pandas time vs cuDF time, same style as dashboard charts.

“How it works” Section (collapsible or static):

Brief step‑by‑step: “1. Raw CSV data loaded into memory. 2. Pandas applies group‑by on CPU – slow. 3. With import cudf.pandas, same code runs on GPU – massive parallelism. 4. Result: 11x faster feature engineering for risk scores.”

Live Demo Button (optional bonus): “Re‑run Benchmark” triggers a backend function (if implemented) that returns real‑time numbers from a GPU instance; otherwise, just shows a toast “This is a live demo from a pre‑computed benchmark.”

# 7. Responsive Behavior & Breakpoints
Desktop (≥1024px): Full layout as described. Dashboard uses grid of 3 summary cards, chart next to table on big screens (side by side).

Tablet (768–1023px): Summary cards stack 2‑per‑row, then 1. Chart and table stack vertically. Tabs remain horizontal.

Mobile (<768px):

Navbar becomes hamburger menu.

Dashboard tabs scroll horizontally.

Summary cards full width, single column.

Table becomes horizontally scrollable container with sticky first column (student name).

Chat messages take full width.

Performance comparison cards stack vertically.

# 8. Interactions & Micro‑UX
Filter changes trigger a loading skeleton (not a full spinner) inside the panel while fetching.

Navigation uses Next.js <Link> for instant client‑side page transitions.

Hover states on all interactive elements: buttons darken, table rows get light bg, nav links change color.

Toast notifications (optional) for actions like “Report exported” or benchmark re‑run.

Confetti animation (just for hackathon wow) when speedup is shown on the performance page (use canvas-confetti). Trigger once on page load.

# 9. States to Cover for Each Page
Page / Component	Loading	Empty	Error	Edge Cases
Academic Risk	Skeleton cards & chart	“No students found” with illustration	Error card with retry	Very long student names truncated; risk score = 0
Placement	Same	Same	Same	Students with missing scores show “N/A”
Classroom	Skeleton heatmap	“All rooms available”	Error card	No bookings on selected date
AI Assistant	Three‑dot typing indicator	Welcome suggestions	“Sorry, I couldn’t process that. Try rewording.”	Very long SQL query – collapsed by default
Performance	Spinner while fetching JSON	Pre‑computed data always exists, so no empty state; if fetch fails, show error	Error card with retry	None

# 10. Developer Handoff Checklist
Create Next.js 14 project with TypeScript and Tailwind.

Set up /app/layout.tsx with Navbar, Footer, and global font.

Build /app/page.tsx with tab state and three panel components.

Build /app/assistant/page.tsx chat interface.

Build /app/performance/page.tsx with metrics display.

Implement API routes (handlers) as described in previous spec.

Create reusable UI components: Card, Spinner, ErrorCard, EmptyState.

Use Recharts for charts; customise colors to match design system.

Test responsive layout at 375px, 768px, 1440px.

Add page transition animations (optional).

Deploy to Vercel with environment variables.
