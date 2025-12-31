/**
 * Lead Capture Script
 * ------------------------------------------------
 * 1. Attaches to all forms on the page.
 * 2. Normalizes messy field names (e.g., "fname" -> "name").
 * 3. Sends data to automation webhook without blocking the user.
 */

(function (window, document) {
    'use strict';

    // 1. CONFIGURATION
    const CONFIG = {
        // We will replace this with the (Production) n8n Webhook URL
        webhookUrl: 'https://primary-production-4222.up.railway.app/webhook/lead-capture', 
        customerName: 'Industrial_Client_01'
    };

    // 2. FIELD NORMALIZER (The Brains)
    // Heuristic: looks at input types and names to guess the data type
    function getStandardKey(input) {
        const name = (input.name || input.id || '').toLowerCase();
        const type = input.type || 'text';

        if (type === 'email' || name.includes('email')) return 'email';
        if (type === 'tel' || name.includes('phone') || name.includes('mobile')) return 'phone';
        if (name.includes('name') || name.includes('first') || name.includes('last')) return 'name';
        return 'details'; // Catch-all for messages, company names, etc.
    }

    // 3. MAIN LOGIC
    function init() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', function (e) {
                // Note: We do NOT preventDefault() so the form still submits to the CMS normally.
                // We just "piggyback" on the event.

                const payload = {
                    sourceUrl: window.location.href,
                    timestamp: new Date().toISOString(),
                    customerName: CONFIG.customerName,
                    status: 'New Lead', // Default status for N8N
                    raw_data: {}
                };

                // Extract and Normalize Data
                const formData = new FormData(form);
                for (let [key, value] of formData.entries()) {
                    const input = form.querySelector(`[name="${key}"]`);
                    // Skip hidden fields or empty inputs
                    if (!value || (input && input.type === 'hidden')) continue;

                    const standardKey = input ? getStandardKey(input) : 'details';
                    
                    // If multiple fields match "details" (e.g. subject + message), combine them
                    if (payload[standardizedKey]) {
                        payload[standardKey] = payload[standardKey] + ' | ' + value.trim();
                    } else {
                        payload[standardKey] = value.trim();
                    }
                    
                    // Keep raw data for debugging
                    payload.raw_data[key] = value.trim();
                }

                // Send to N8N (Fire and Forget)
                if (navigator.sendBeacon) {
                    // Ideally use sendBeacon for reliability on page unload
                    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                    navigator.sendBeacon(CONFIG.webhookUrl, blob);
                } else {
                    // Fallback for older browsers
                    fetch(CONFIG.webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        keepalive: true
                    }).catch(err => console.error('Lead Capture Error:', err));
                }
            });
        });
    }

    // 4. INIT
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window, document);