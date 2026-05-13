"use server";

/**
 * Lead magnet email capture.
 *
 * SWAP-FRIENDLY: To replace Kit with Mailchimp / Beehiiv / ConvertKit / etc.,
 * replace the body of `subscribeToProvider` below. The `subscribe` action
 * stays unchanged.
 */

export async function subscribe(prevState, formData) {
  const email = formData.get("email")?.toString().trim();
  const firstName = formData.get("firstName")?.toString().trim();

  if (!email) {
    return { success: false, error: "Please enter your email." };
  }

  return await subscribeToProvider({ email, firstName });
}

// ──────────────────────────────────────────────────────────────────
// Provider — Kit (formerly ConvertKit)
// Replace the body of this function to use a different email service.
// ──────────────────────────────────────────────────────────────────
async function subscribeToProvider({ email, firstName }) {
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  // No keys = demo mode. Form returns success so the UI flow works,
  // but nothing is delivered. See .env.local.example for setup.
  if (!apiKey || !formId) {
    console.warn(
      "[Lead Magnet] KIT_API_KEY / KIT_FORM_ID not set. Form is in demo mode. See .env.local.example."
    );
    return { success: true, mocked: true };
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          first_name: firstName,
        }),
      }
    );

    if (!response.ok) {
      console.error("[Lead Magnet] Kit responded with", response.status);
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[Lead Magnet] Kit subscription failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
