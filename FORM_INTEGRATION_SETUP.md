# Form Submission Integration Setup

This guide explains how to set up automated form submission storage to Google Sheets, Slack notifications, and Airtable for your Mortgage Advisory App.

## Overview

When users submit the inquiry form, their data is automatically:
1. **Saved to Google Sheets** - For easy spreadsheet management
2. **Notified via Slack** - For instant team notifications
3. **Stored in Airtable** - For CRM and database management

All integrations are optional - configure only what you need.

---

## 1. Google Sheets Setup

### Method A: Using Google Forms (Recommended)

**Easiest approach - auto-saves to Google Sheet**

1. Create a Google Form at https://forms.google.com
2. Create fields matching the form:
   - Name
   - Email
   - Phone
   - Loan Purpose
   - Credit Score
   - Message
3. Click the "Responses" tab → Click the Sheet icon to auto-create a Google Sheet
4. Copy your **Form ID** from the URL:
   ```
   https://docs.google.com/forms/d/YOUR_FORM_ID/edit
   ```

5. Get the **Form Response URL**:
   - In Google Form, click the three dots (⋯) → "Get pre-filled link"
   - Or construct it as:
   ```
   https://docs.google.com/forms/u/0/d/YOUR_FORM_ID/formResponse
   ```

6. Add to `.env`:
   ```
   GOOGLE_SHEETS_WEBHOOK="https://docs.google.com/forms/u/0/d/YOUR_FORM_ID/formResponse"
   ```

### Method B: Using Zapier Integration

If you prefer more control:

1. Create a Zap on https://zapier.com
2. Trigger: Webhook (Custom Request)
3. Action: Google Sheets → Create Spreadsheet Row
4. Get the Webhook URL from Zapier
5. Use that URL as your `GOOGLE_SHEETS_WEBHOOK`

---

## 2. Slack Setup

### Get Your Slack Webhook

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Give it a name (e.g., "Mortgage App Notifications")
4. Select your Slack workspace
5. Go to "Incoming Webhooks" from the left menu
6. Toggle "Activate Incoming Webhooks" to **ON**
7. Click "Add New Webhook to Workspace"
8. Select the channel where you want notifications (or create a new one)
9. Click "Allow"
10. Copy your **Webhook URL** - looks like:
    ```
    https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
    ```

11. Add to `.env`:
    ```
    SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
    ```

### Test Your Webhook

```bash
curl -X POST -H 'Content-type: application/json' \
  -d '{"text":"Test message"}' \
  YOUR_WEBHOOK_URL
```

---

## 3. Airtable Setup

### Get Your Airtable Credentials

#### Step 1: Create Access Token

1. Go to https://airtable.com/account/tokens
2. Click "Create token" (or "Generate" if existing)
3. Name it "Mortgage App"
4. Grant these permissions:
   - `data.records:read`
   - `data.records:write`
   - `data.records:create`
5. Copy your **API Token**
6. Add to `.env.local`:
   ```
   AIRTABLE_TOKEN="patXXXXXXXXXXXXXXXXXX"
   ```

#### Step 2: Get Base ID

1. Open your Airtable workspace
2. Right-click on any base → "Copy base ID"
3. Or check the URL: `https://airtable.com/{BASE_ID}/...`
4. Add to `.env.local`:
   ```
   AIRTABLE_BASE_ID="appXXXXXXXXXXXXXX"
   ```

#### Step 3: Get Table ID

1. Open your base
2. Right-click on the table name → "Copy table ID"
3. Or use the API to list tables:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.airtable.com/v0/meta/bases/{BASE_ID}/tables
   ```
4. Add to `.env.local`:
   ```
   AIRTABLE_TABLE_ID="tblXXXXXXXXXXXX"
   ```

#### Step 4: Create Table Fields

In your Airtable table, create these fields:

| Field Name | Field Type |
|-----------|-----------|
| Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Loan Purpose | Single select (Home Purchase, Refinance) |
| Credit Score | Single line text |
| Message | Long text |
| Submission Date | Created time |
| Status | Single select (New, Contacted, In Progress, Closed) |

---

## 4. Environment Variables Summary

### Public Variables (.env)
```bash
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_key"
VITE_SUPABASE_URL="https://xxx.supabase.co"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
VITE_APP_URL="http://localhost:5173"
GOOGLE_SHEETS_WEBHOOK="https://docs.google.com/forms/.../formResponse"
SLACK_WEBHOOK="https://hooks.slack.com/services/..."
```

### Secret Variables (.env.local - Never Commit!)
```bash
STRIPE_SECRET_KEY="sk_test_..."
AIRTABLE_TOKEN="patXXXXXXXXXXXXXX"
AIRTABLE_BASE_ID="appXXXXXXXXXXXXXX"
AIRTABLE_TABLE_ID="tblXXXXXXXXXXXXXX"
```

---

## 5. Deploy Supabase Functions

The form submissions are processed by the Edge Function:
- **Location**: `supabase/functions/handle-form-submission/index.ts`

To deploy with your integration credentials:

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Deploy function with environment variables
supabase functions deploy handle-form-submission \
  --env STRIPE_SECRET_KEY=sk_test_YOUR_KEY \
  --env GOOGLE_SHEETS_WEBHOOK=... \
  --env SLACK_WEBHOOK=... \
  --env AIRTABLE_TOKEN=... \
  --env AIRTABLE_BASE_ID=... \
  --env AIRTABLE_TABLE_ID=...
```

Or just deploy - the function will use environment variables from your project settings in Supabase dashboard.

---

## 6. Test the Integration

1. Go to your application's inquiry form
2. Fill in sample data:
   - Name: Test User
   - Email: test@example.com
   - Phone: (555) 123-4567
   - Loan Purpose: Home Purchase
   - Credit Score: Excellent (750+)
   - Message: Test message

3. Click "Submit Application"
4. Check:
   - ✅ Google Sheet - New row added
   - ✅ Slack Channel - Notification received
   - ✅ Airtable - Record created

---

## 7. Troubleshooting

### Google Sheets Not Receiving Data
- Verify Form ID is correct
- Check the webhook URL is correctly formatted
- Test with `curl` to verify the endpoint works

### Slack Webhook Not Working
- Verify webhook URL starts with `https://hooks.slack.com`
- Check channel isn't archived
- Review Slack app permissions in workspace

### Airtable Not Saving Records
- Verify API token is valid (not expired)
- Check Base ID and Table ID are correct
- Ensure table fields match the field names in the code
- Verify token has `records:create` permission

### Function Deployment Issues
```bash
# Check function logs
supabase functions download handle-form-submission

# Redeploy
supabase functions deploy handle-form-submission
```

---

## 8. Production Checklist

- [ ] All API keys stored in `.env.local` (not `.env`)
- [ ] `.env.local` added to `.gitignore`
- [ ] Supabase functions deployed with live credentials
- [ ] Slack webhook verified with team channel
- [ ] Airtable table structure matches field names
- [ ] Google Sheets/Forms receiving test data
- [ ] Toast notifications display correctly
- [ ] Error handling working (try invalid email)
- [ ] CORS properly configured on functions
- [ ] Form validation working before submission

---

## Quick Links

- [Google Forms Documentation](https://support.google.com/forms)
- [Slack API - Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [Airtable API Documentation](https://airtable.com/api)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

