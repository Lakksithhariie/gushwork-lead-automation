#### Assessment Summary: Lead Automation

**Role Applied:** Associate Product Manager

**Submission Date:** January 1, 2026

#### Assignment Overview

The objective was to build an end-to-end lead capture and qualification system that serves industrial manufacturers and local businesses. The system needed to solve three core challenges:

1. **Fragmentation:** Capturing data from diverse client websites (WordPress, Wix, Custom HTML) without custom code for each.
2. **Quality Control:** Filtering out spam and bots before they reach the sales team.
3. **Reliability:** Ensuring no lead is lost, even if the user closes the browser immediately.

#### System Architecture

<img width="591" height="1268" alt="image" src="https://github.com/user-attachments/assets/c64e287b-1606-4ef8-8dd4-0643aa996757" />


---

#### Tasks Completed

**Part 1: Universal Lead Capture Script**

**File:** `client-script/lead-capture.js`

I built a lightweight, "write-once, deploy-everywhere" JavaScript snippet.

* **Approach:** Instead of relying on specific field IDs (which vary by client), the script uses **Heuristic Normalization**. It scans the input *type* (e.g., checks for `@` symbols or number patterns) to identify emails and phone numbers automatically.
* **Resilience:** It uses `Navigator.sendBeacon` to transmit data asynchronously, ensuring leads are captured even if the user closes the tab immediately after clicking submit.

**Part 2: Automation & Filtration Workflow**

**File:** `automation/gushwork-workflow.json`

I designed an N8N workflow that acts as a digital mailroom, processing leads in real-time using the **Groq (OpenAI GPT-OSS-120B)** model for decision-making.

**The Workflow Logic:**

1. **The Filter (Ingestion):** The AI reads the message content to judge intent.
* *Spam:* Filed silently to a spreadsheet archive.
* *Valid:* Logged as a "New Lead" and triggers an immediate email alert to sales.


2. **The Safety Net (Correction Loop):** A separate monitor watches the spreadsheet. If a human manually changes a lead status from "Spam" to "Valid," the system detects the change and triggers the email alert, ensuring no customer is lost due to an automation error.

**Part 3: Strategic Documentation**

**File:** `docs/strategic-rollout.md` & `docs/implementation-guide.md`

I delivered a strategic roadmap focused on revenue generation rather than just maintenance.

* **Rollout Strategy:** A centralized hosting plan that allows us to update the script for all customers simultaneously without touching their websites.
* **Future Roadmap:** Defined three key initiatives for the next sprint:
1. **Enrichment:** Auto-fetching company size/revenue data (Clearbit).
2. **AISDR:** Instant WhatsApp engagement to qualify leads 24/7.
3. **Attribution:** Closing the loop with Google Ads to optimize marketing spend.

---

#### Key Technical Decisions

* **Groq Inference Engine:** Selected for millisecond-latency, ensuring the "Speed to Lead" remains near instant.
* **OpenAI GPT-OSS-120B:** Chosen for its reasoning depth (Mixture of Experts), significantly reducing false positives compared to smaller 8B models.
* **Native N8N Agents:** Utilized structured output parsers to force the AI to return strict JSON, preventing workflow failures caused by unstructured text responses.
