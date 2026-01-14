# Vercel Deployment Guide

This guide will help you deploy the dashboard to Vercel using environment variables for secure credential storage.

## Step 1: Add JSON File to .gitignore

The service account JSON file is already added to `.gitignore` to prevent it from being committed to GitHub.

## Step 2: Set Up Vercel Environment Variables

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variables:

#### Required Environment Variables:

**1. `VITE_SERVICE_ACCOUNT_JSON`** (Recommended - Single Variable)
   - **Value**: Copy the entire contents of `feisty-reporter-443010-t9-7a6a2c9eb04f.json`
   - **Type**: Plain text (paste the full JSON as a single string)
   - **Environments**: Production, Preview, Development

**OR use individual variables:**

**2. `VITE_PROJECT_ID`**
   - **Value**: `feisty-reporter-443010-t9`
   - **Environments**: Production, Preview, Development

**3. `VITE_PRIVATE_KEY_ID`**
   - **Value**: `7a6a2c9eb04f065a441f27e2497cd470ad77d581`
   - **Environments**: Production, Preview, Development

**4. `VITE_PRIVATE_KEY`**
   - **Value**: The entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Keep the newlines (`\n`) in the key
   - **Environments**: Production, Preview, Development

**5. `VITE_CLIENT_EMAIL`**
   - **Value**: `tiktok-downloading-project@feisty-reporter-443010-t9.iam.gserviceaccount.com`
   - **Environments**: Production, Preview, Development

**6. `VITE_CLIENT_ID`**
   - **Value**: `107584894656702349625`
   - **Environments**: Production, Preview, Development

**7. `VITE_SPREADSHEET_ID`**
   - **Value**: `1cr_N4vN2VJaKJhGr9H6dyeySz-nVwIIyCOyRaNnv4w0`
   - **Environments**: Production, Preview, Development

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_SERVICE_ACCOUNT_JSON
# Paste the entire JSON content when prompted

# Or set individual variables
vercel env add VITE_PROJECT_ID
vercel env add VITE_PRIVATE_KEY_ID
vercel env add VITE_PRIVATE_KEY
vercel env add VITE_CLIENT_EMAIL
vercel env add VITE_CLIENT_ID
vercel env add VITE_SPREADSHEET_ID
```

## Step 3: Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub (without the JSON file)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import your GitHub repository
5. Vercel will automatically detect it's a Vite project
6. Click **Deploy**
7. After deployment, go to **Settings** → **Environment Variables** and add the variables
8. Redeploy the project (or it will auto-redeploy on next push)

### Method 2: Vercel CLI

```bash
# In your project directory
vercel

# Follow the prompts
# When asked about environment variables, you can add them now or later in the dashboard
```

## Step 4: Verify Deployment

1. After deployment, visit your Vercel URL
2. The dashboard should load and connect to Google Sheets
3. If you see errors, check:
   - Environment variables are set correctly
   - Spreadsheet is shared with the service account email
   - Google Sheets API is enabled in Google Cloud Console

## Important Notes

⚠️ **Security Best Practices:**
- Never commit the JSON file to GitHub
- Use environment variables for all sensitive data
- The `.gitignore` file is configured to exclude the JSON file
- Environment variables in Vercel are encrypted at rest

📝 **For Local Development:**
- Create a `.env.local` file (already in `.gitignore`)
- Add the same environment variables with `VITE_` prefix
- Example:
  ```
  VITE_SPREADSHEET_ID=1cr_N4vN2VJaKJhGr9H6dyeySz-nVwIIyCOyRaNnv4w0
  VITE_PROJECT_ID=feisty-reporter-443010-t9
  # ... etc
  ```

## Troubleshooting

### Error: "Failed to initialize"
- Check that all environment variables are set in Vercel
- Verify the service account JSON is valid
- Ensure the spreadsheet is shared with the service account email

### Error: "API request failed"
- Verify Google Sheets API is enabled in Google Cloud Console
- Check that the service account has proper permissions
- Ensure the spreadsheet ID is correct

### Environment Variables Not Working
- Make sure variables start with `VITE_` prefix
- Redeploy after adding environment variables
- Check Vercel build logs for any errors

