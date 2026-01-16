# Important Setup Instructions

## ⚠️ Critical: Supabase Environment Variables

Before the dashboard can access Supabase, you **MUST** set:

```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

## Verify Setup

- ✅ Supabase anon key is set (not service role)
- ✅ RLS policies allow authenticated admin access
- ✅ Tables `creators` and `videos` exist

The dashboard will connect to Supabase at runtime using these variables.
