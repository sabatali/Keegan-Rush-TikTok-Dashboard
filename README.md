# TikTok Dashboard

A frontend-only React dashboard that uses Supabase for authentication and data.

## Features

- 📊 **Videos Dashboard**: Group videos into weekly buckets with upload status
- 👤 **Creator Tabs**: Switch between creators quickly
- ✅ **Upload Status**: Toggle uploaded status per video
- 🎨 **Modern UI**: Built with React and Tailwind CSS
- 🔐 **Supabase Auth**: Email + password login for admins

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Configure Supabase:**
   - See [SETUP.md](./SETUP.md) for detailed setup instructions
   - You'll need:
     - SUPABASE_URL
     - SUPABASE_ANON_KEY

## Tech Stack

- **React** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Supabase** - Auth + database
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   ├── LoginPage.jsx     # Admin login page
│   ├── Navigation.jsx    # Navigation bar
│   ├── AccountPage.jsx   # Change password form
│   └── VideosPage.jsx    # Videos dashboard
├── services/
│   └── supabaseClient.js # Supabase client
├── App.jsx               # Main app component with routing
└── main.jsx              # Entry point
```

## Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## License

MIT
