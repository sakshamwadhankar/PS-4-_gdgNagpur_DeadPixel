# Project: Local Civic-Engagement Hub
## Document Type: PRD & TRD
**Status:** Hackathon Draft

---

## 1. PRODUCT REQUIREMENTS DOCUMENT (PRD)

### 1.1 Problem Statement
Constituency planners (MLAs, city councils) lack data-driven methods to allocate local development funds. Current feedback systems are unstructured, plagued by duplicate complaints, and fail to verify if the feedback is coming from actual local constituents. Additionally, government tender and procurement data is scattered across multiple dynamic portals (GEM, CPPP, eProcure), making it nearly impossible for citizens and planners to track upcoming infrastructure projects and spending in their locality.

### 1.2 Target Audience
* **Citizens:** Individuals living within a specific local ward or constituency wanting to propose or vote on local infrastructure improvements.
* **Constituency Planners:** Government officials who need a prioritized, deduplicated dashboard of local issues to allocate their budget effectively.

### 1.3 Core Product Features
* **Geofenced Participation:** Users can view the platform from anywhere, but voting and submission capabilities are locked to verified local residents.
* **AI-Powered Deduplication:** Automatically merges redundant complaints (e.g., multiple reports of the same pothole) into a single, high-priority ticket.
* **Dynamic Priority Scoring:** A backend algorithm that ranks issues not just by popularity, but by severity and time open, ensuring critical infrastructure issues outrank popular but minor requests.
* **Accountability Timeline:** A public ledger showing the exact status of a project (Proposed -> Funded -> In Progress -> Resolved).
* **Government Tender Aggregation:** Automated scraping of government tender portals (GEM, CPPP, eProcure) using Playwright to surface relevant local tenders on the citizen dashboard — enabling transparency into planned government spending and upcoming infrastructure projects in the constituency.

### 1.4 Out of Scope (For Hackathon)
* Payment gateways for government vendors.
* Complex user profile management (keep authentication simple).
* Native mobile applications (stick to responsive web).

---

## 2. TECHNICAL REQUIREMENTS DOCUMENT (TRD)

### 2.1 System Architecture
The application follows a standard three-tier architecture with an integrated external LLM API for data processing and an automated scraping layer for government tender aggregation.
* **Client Layer:** Next.js (React) application deployed on Vercel.
* **API/Middleware Layer:** Node.js / Express server deployed on Render or Heroku.
* **Database Layer:** PostgreSQL relational database hosted on Supabase or Neon.
* **AI Processing:** Google Gemini API for semantic analysis of incoming text.
* **Scraper Layer:** Playwright (headless Chromium) running as a scheduled Node.js service for scraping government tender portals.

### 2.2 Core Algorithms & Logic

**A. Geofencing & Verification Logic**
* The client passes the user's postal code or GPS coordinates to the API during the initial sign-up payload.
* The backend validates the location against a predefined bounding box or valid postal code array for the target constituency.
* Unauthorized users receive a read-only JWT token; verified users receive a write-enabled JWT token.

**B. AI Deduplication Flow**
* User submits a new issue: "The water pipe on Main St is leaking."
* Node API sends the text and location data to the Gemini API with a prompt to compare it against open issues within a 500-meter radius.
* If semantic similarity > 85%, Gemini returns the `Issue_ID` of the existing ticket.
* Node API increments the vote count of the existing ticket instead of creating a new database row.

**C. Priority Allocation Algorithm**
The backend calculates a priority score for the planner's dashboard using the following mathematical model:

$$Priority Score = (V \times 1.5) + (S \times 2) - (T \times 0.5)$$

* **V:** Total verified local upvotes.
* **S:** Severity multiplier (AI assigns a value from 1 to 5; e.g., Water crisis = 5, Park bench = 1).
* **T:** Time elapsed in days since the issue was first reported.

**D. Government Tender Scraping Flow (Playwright)**

Government tender portals (GEM, CPPP, eProcure) are fully dynamic, JavaScript-rendered applications — data is not available in raw HTML. A headless browser approach using **Playwright** is required.

1. **Scheduled Trigger:** A CRON job fires the scraper at a configurable interval (default: every 6 hours).
2. **Browser Launch:** Playwright spins up a headless Chromium instance.
3. **Navigation & Filtering:** The scraper navigates to the target portal, applies location/category filters relevant to the constituency.
4. **Wait for Render:** Playwright waits for dynamic content to fully render (network idle + DOM selectors).
5. **Data Extraction:** Structured tender data is extracted from the rendered page: `tender_id`, `title`, `department`, `value`, `deadline`, `portal_url`.
6. **Pagination:** The scraper clicks through pagination controls, repeating extraction for each page.
7. **Upsert to DB:** Extracted tenders are upserted into the `Tenders` table (insert new, update existing, skip duplicates based on `portal_tender_id`).
8. **Browser Cleanup:** The headless browser is closed and resources are freed.

**Target Portals:**
* **GEM** (gem.gov.in) — Government e-Marketplace
* **CPPP** (eprocure.gov.in) — Central Public Procurement Portal
* **State eProcurement portals** — Configurable per constituency

### 2.3 Database Schema (PostgreSQL)

| Table Name | Primary Key | Foreign Keys | Key Columns |
| :--- | :--- | :--- | :--- |
| **Users** | `user_id` | None | `phone_number`, `postal_code`, `is_verified` |
| **Issues** | `issue_id` | `author_id` (Users) | `lat_lng`, `raw_text`, `ai_category`, `severity_score`, `status` |
| **Votes** | `vote_id` | `user_id` (Users), `issue_id` (Issues) | `timestamp` |
| **Tenders** | `tender_id` | None | `portal_tender_id`, `title`, `department`, `estimated_value`, `deadline`, `portal_url`, `source_portal`, `constituency`, `status`, `scraped_at` |

### 2.4 API Endpoint Map

| Endpoint | Method | Payload | Function |
| :--- | :--- | :--- | :--- |
| `/api/auth/verify` | POST | `{ phone, postal_code }` | Validates constituent location and returns JWT. |
| `/api/issues/new` | POST | `{ text, location }` | Triggers AI deduplication; creates or merges issue. |
| `/api/issues/vote` | POST | `{ issue_id }` | Validates JWT, checks for existing vote, increments count. |
| `/api/planner/dashboard`| GET | None | Runs priority algorithm; returns sorted list of active issues. |
| `/api/tenders` | GET | `?constituency=&status=` | Returns paginated list of scraped tenders filtered by constituency. |
| `/api/tenders/:id` | GET | None | Returns full details of a specific tender. |
| `/api/scraper/trigger` | POST | `{ portal, constituency }` | Admin-only: manually triggers a scrape run for a specific portal. |
| `/api/scraper/status` | GET | None | Admin-only: returns last scrape timestamp and run status per portal. |

### 2.5 Security & Environment Variables
* `DATABASE_URL`: Connection string for PostgreSQL.
* `JWT_SECRET`: Secret key for signing user authentication tokens.
* `GEMINI_API_KEY`: API key for Google Gemini AI deduplication and severity scoring.
* `SCRAPER_CRON_SCHEDULE`: CRON expression for scraper frequency (default: `0 */6 * * *` — every 6 hours).
* `SCRAPER_TARGET_PORTALS`: Comma-separated list of portal identifiers to scrape (e.g., `gem,cppp,state_mh`).
* `SCRAPER_ADMIN_SECRET`: Secret key to authenticate admin-only scraper trigger endpoints.

### 2.6 Scraper Technology Choice: Playwright

**Why Playwright over Cheerio + Axios:**

| Factor | Cheerio + Axios | Playwright ✅ |
| :--- | :--- | :--- |
| Dynamic JS content | ❌ Cannot execute JavaScript | ✅ Full browser rendering |
| Pagination & filters | ❌ Cannot interact with UI | ✅ Clicks, scrolls, fills forms |
| Bot protection | ❌ Easily detected & blocked | ✅ Mimics real browser behavior |
| Gov portals (GEM, CPPP) | ❌ Data not in raw HTML source | ✅ Reads fully rendered DOM |
| Node.js integration | ✅ Native | ✅ Native |

Indian government tender portals are **fully dynamic, JavaScript-rendered applications** with encrypted data transmission, session management, and anti-bot measures. A lightweight HTTP-only approach (Cheerio) would receive empty HTML shells with no tender data. Playwright is required to faithfully render these pages and extract structured data.