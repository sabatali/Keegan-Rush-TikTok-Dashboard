# TikTok Dashboard

A frontend-only React dashboard that connects directly to Google Sheets using the Google Sheets API. No backend required!

## Features

- 📊 **Videos Dashboard**: View and analyze video data with sorting and filtering
- 👤 **Profile Management**: Add and remove TikTok profile URLs
- 🔄 **Real-time Sync**: All changes sync immediately to Google Sheets
- 🎨 **Modern UI**: Built with React and Tailwind CSS
- 🔐 **OAuth Integration**: Secure authentication for write operations

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Configure Google Sheets API:**
   - See [SETUP.md](./SETUP.md) for detailed setup instructions
   - You'll need:
     - Google API Key
     - Spreadsheet ID
     - OAuth Client ID (optional, for write operations)

## Tech Stack

- **React** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Google Sheets API** - Data source
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   ├── AuthPage.jsx      # Initial setup and authentication
│   ├── Navigation.jsx    # Navigation bar
│   ├── ProfilesPage.jsx  # Profile management
│   └── VideosPage.jsx    # Videos dashboard
├── services/
│   └── googleSheets.js   # Google Sheets API integration
├── App.jsx               # Main app component with routing
└── main.jsx              # Entry point
```

## Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## License

MIT
