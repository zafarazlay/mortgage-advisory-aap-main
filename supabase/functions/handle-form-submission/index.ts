import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface FormData {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  credit: string;
  message: string;
}

const GOOGLE_SHEETS_WEBHOOK = Deno.env.get("GOOGLE_SHEETS_WEBHOOK");
const SLACK_WEBHOOK = Deno.env.get("SLACK_WEBHOOK");
const AIRTABLE_TOKEN = Deno.env.get("AIRTABLE_TOKEN");
const AIRTABLE_BASE_ID = Deno.env.get("AIRTABLE_BASE_ID");
const AIRTABLE_TABLE_ID = Deno.env.get("AIRTABLE_TABLE_ID");

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const formData: FormData = await req.json();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const timestamp = new Date().toISOString();
    const promises = [];

    // 1. Save to Google Sheets via webhook
    if (GOOGLE_SHEETS_WEBHOOK) {
      promises.push(
        fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            values: [
              [
                timestamp,
                formData.name,
                formData.email,
                formData.phone,
                formData.purpose,
                formData.credit,
                formData.message,
              ],
            ],
          }),
        }).catch((err) => console.error("Google Sheets error:", err))
      );
    }

    // 2. Send Slack notification
    if (SLACK_WEBHOOK) {
      const slackMessage = {
        text: "New Mortgage Application Received 📋",
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: "New Application Submission" },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${formData.name}`,
              },
              {
                type: "mrkdwn",
                text: `*Email:*\n${formData.email}`,
              },
              {
                type: "mrkdwn",
                text: `*Phone:*\n${formData.phone}`,
              },
              {
                type: "mrkdwn",
                text: `*Loan Purpose:*\n${formData.purpose}`,
              },
              {
                type: "mrkdwn",
                text: `*Credit Score:*\n${formData.credit || "Not provided"}`,
              },
              {
                type: "mrkdwn",
                text: `*Submission Time:*\n${timestamp}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Message:*\n${formData.message || "No message provided"}`,
            },
          },
          {
            type: "divider",
          },
        ],
      };

      promises.push(
        fetch(SLACK_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slackMessage),
        }).catch((err) => console.error("Slack error:", err))
      );
    }

    // 3. Save to Airtable
    if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID && AIRTABLE_TABLE_ID) {
      const airtableRecord = {
        records: [
          {
            fields: {
              Name: formData.name,
              Email: formData.email,
              Phone: formData.phone,
              "Loan Purpose": formData.purpose,
              "Credit Score": formData.credit,
              Message: formData.message,
              "Submission Date": timestamp,
              Status: "New",
            },
          },
        ],
      };

      promises.push(
        fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${AIRTABLE_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(airtableRecord),
          }
        ).catch((err) => console.error("Airtable error:", err))
      );
    }

    // Wait for all integrations to complete
    await Promise.all(promises);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Form submitted successfully",
        timestamp,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Form submission error:", err);
    return new Response(
      JSON.stringify({
        error: (err as Error).message || "Failed to process form submission",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
