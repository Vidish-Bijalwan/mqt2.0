/**
 * Team notification for new leads via WhatsApp Cloud API.
 *
 * Uses a pre-approved UTILITY template (Meta requires templates for
 * business-initiated messages outside the 24h customer-service window).
 * Vidish must approve a template in the WhatsApp Manager dashboard and set
 * WHATSAPP_TEMPLATE_NAME to match it. Default template body variables:
 *   1. lead name
 *   2. lead phone
 *   3. package / destination (or "General enquiry")
 *   4. timestamp (IST)
 *
 * Suggested template body (create this verbatim in WhatsApp Manager):
 *   "New MQT enquiry from {{1}} ({{2}}) for {{3}} at {{4}}. Check the enquiries database."
 *
 * All credentials come from env vars only. When any are absent, this module
 * reports "not configured" and the caller skips notification gracefully.
 */

interface NotifyInput {
  name: string;
  phone: string;
  packageName: string | null;
  createdAt: string;
}

export function isWhatsappConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_TEAM_NUMBER
  );
}

function istTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Send the template notification. Returns true on success.
 * Never throws — failures are returned as false and logged by the caller.
 */
export async function notifyTeamOnWhatsapp(input: NotifyInput): Promise<boolean> {
  if (!isWhatsappConfigured()) return false;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const token = process.env.WHATSAPP_ACCESS_TOKEN!;
  const to = process.env.WHATSAPP_TEAM_NUMBER!;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "mqt_lead_alert";
  const templateLang = process.env.WHATSAPP_TEMPLATE_LANG || "en";

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: templateLang },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: input.name.slice(0, 100) },
            { type: "text", text: input.phone.slice(0, 30) },
            { type: "text", text: (input.packageName || "General enquiry").slice(0, 100) },
            { type: "text", text: istTimestamp(input.createdAt) },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[lead-notify] WhatsApp API error", res.status, detail.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[lead-notify] WhatsApp request failed", err instanceof Error ? err.message : err);
    return false;
  }
}
