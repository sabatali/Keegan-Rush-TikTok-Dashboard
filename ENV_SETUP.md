# Environment Variables Setup Guide

## Quick Setup

### For Local Development:

Create a `.env.local` file and set:
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   - **SUPABASE_URL**
   - **SUPABASE_ANON_KEY**
4. Redeploy after saving

## Important Notes

⚠️ **Never commit `.env.local` to Git** - It's already in `.gitignore`

🔒 **Use the anon key only** - never expose service role keys in the frontend

