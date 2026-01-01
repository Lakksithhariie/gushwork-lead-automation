#### Lead Capture Script: Implementation Guide

**The Problem:** Gushwork serves diverse clients ranging from local service providers to industrial manufacturers. Their websites are built on a fragmented landscape of CMS platforms (WordPress, Wix, Squarespace, Custom HTML). Building a unique integration for every new client is unscalable. We need a ***"write once, deploy everywhere"*** solution that captures leads without requiring clients to change their website code or their backend infrastructure.

**First Principles Design:** To solve this, we applied the principle of ***Heuristic Normalization***. Instead of relying on specific field IDs (which change from site to site), we rely on the nature of the data. If an input accepts numbers and is named "cell," it is a **Phone Number**. If an input has an `@` symbol validation, it is an **Email**. By abstracting the input logic, we create a script that is **agnostic** to the technology stack it sits on.

**The Approach:** This solution works in three silent stages on the client’s browser: the script attaches a **global listener** to the document to capture any form submission event regardless of platform or structure, then intercepts the data and interprets it by scanning field names and types to map chaotic inputs like `fname_123` or `contact_tel` into a **standardized schema** (`name`, `phone`, `email`) based on semantic patterns rather than hardcoded IDs, finally bundling the clean normalized data alongside the raw original data for audit and firing it silently to our **n8n webhook** via `Navigator.sendBeacon` to ensure zero disruption to the user’s experience.

**Implementation Guide:**

**Step 1: Host the Script** Upload `lead-capture.js` to your CDN or a public server path (e.g., `/assets/js/lead-capture.js`).

**Step 2: Embed the Code** Place the following snippet immediately before the closing `</body>` tag of (Customer)'s website template. This ensures the script loads last and does not affect page render speed.

```html
<script src="https://your-domain.com/path/to/lead-capture.js" async></script>
```
**Step 3: Verification** 
1. Open your website's console (F12).
2. Submit a test form.
3. Look for the success message: `Lead Captured`.