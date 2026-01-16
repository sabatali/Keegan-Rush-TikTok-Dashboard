# TikTok Dashboard Setup Guide

This is a frontend-only React dashboard that uses Supabase for authentication and data.

## Prerequisites

1. A Supabase project with RLS configured
2. Supabase tables:
   - `creators`
   - `videos`

## Supabase Setup

### 1. Create a Supabase project

1. Go to [Supabase](https://supabase.com/)
2. Create a new project or select an existing one

### 2. Configure environment variables

Create a `.env.local` file with:
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

## Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Sign In

1. Open the app in your browser (usually `http://localhost:5173`)
2. Sign in with your Supabase admin email and password

## Security Notes

⚠️ **Important Security Considerations:**

1. **Anon Key Only**: The frontend only uses the Supabase anon key.
2. **RLS**: All access control should be enforced by Supabase RLS policies.
3. **Secrets**: Never commit `.env.local` to version control.

## Production Deployment

1. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your hosting provider
2. Build the app: `npm run build`
3. Deploy the `dist` folder to your hosting service

