# Vercel Deployment Guide

This guide will help you deploy the dashboard to Vercel using Supabase environment variables.

## Step 1: Set Up Vercel Environment Variables

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variables:

**Required:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

## Step 2: Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import your GitHub repository
5. Vercel will automatically detect it's a Vite project
6. Click **Deploy**

### Method 2: Vercel CLI

```bash
# In your project directory
vercel
```

## Step 3: Verify Deployment

1. After deployment, visit your Vercel URL
2. The login screen should appear
3. If you see errors, check:
   - Environment variables are set correctly
   - Supabase project is reachable
   - RLS policies allow access

## Security Notes

⚠️ **Security Best Practices:**
- Use the anon key only (never service role keys)
- Keep `.env.local` out of version control

