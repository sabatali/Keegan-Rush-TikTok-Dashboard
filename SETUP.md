# TikTok Dashboard Setup Guide

This is a frontend-only React dashboard that connects directly to Google Sheets using the Google Sheets API.

## Prerequisites

1. A Google Cloud Project with Google Sheets API enabled
2. A Google Sheets document with two sheets:
   - `video_info` - Contains video data
   - `profiles_url` - Contains profile URLs

## Google Cloud Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 2. Enable Google Sheets API

1. Navigate to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click **Enable**

### 3. Create API Key (for read operations)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key
4. (Optional) Restrict the API key to Google Sheets API for security

### 4. Create OAuth 2.0 Client ID (for write operations)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (for production)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain (for production)
6. Copy the **Client ID**

## Google Sheets Setup

### 1. Create Your Spreadsheet

Create a Google Sheets document with the following structure:

#### Sheet 1: `video_info`

Headers (exact):
- `video_url`
- `title`
- `uploader`
- `uploader_id`
- `view_count`
- `like_count`
- `comment_count`
- `upload_date`
- `duration`
- `description`
- `video_id`
- `file_path`

#### Sheet 2: `profiles_url`

Headers:
- `url` (or `profile_url` - the app will auto-detect)

### 2. Share Your Spreadsheet

**Important:** For the API to access your spreadsheet:

1. If using API Key only (read-only):
   - Make your spreadsheet **Public** (View access)
   - Or use a service account email (see below)

2. If using OAuth (read + write):
   - Share the spreadsheet with the Google account you'll sign in with
   - Give it **Editor** access

### 3. Get Your Spreadsheet ID

From your Google Sheets URL:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

Copy the `SPREADSHEET_ID` part.

## Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Configure the App

1. Open the app in your browser (usually `http://localhost:5173`)
2. You'll see the setup page
3. Enter:
   - **Google API Key**: Your API key from step 3 above
   - **Spreadsheet ID**: Your spreadsheet ID
   - **OAuth Client ID**: (Optional) Your OAuth client ID for write operations

### 4. Sign In (for write operations)

If you want to add/delete profiles:
1. Click "Sign in with Google"
2. Authorize the app to access your Google Sheets
3. You'll be redirected to the dashboard

## Features

### Profiles Management
- View all profile URLs
- Add new profile URLs
- Delete profile URLs
- Changes sync immediately to Google Sheets

### Videos Dashboard
- View all video data in a table
- Sort by:
  - Views (high to low)
  - Upload date (newest first)
  - Random order
- Filter by:
  - All videos
  - High-performing (above average views)
  - Average & below

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Key**: Never commit your API key to version control. The app stores it in localStorage (browser only).

2. **OAuth Client ID**: This is safe to expose in frontend code, but restrict it to your domain in Google Cloud Console.

3. **Service Account**: The provided service account JSON file should **NOT** be used in frontend code. It's a security risk. Use OAuth 2.0 instead.

4. **Spreadsheet Access**: 
   - For public spreadsheets: Anyone with the API key can read
   - For private spreadsheets: Only authorized users can access

## Troubleshooting

### "Failed to initialize Google API"
- Check that your API key is correct
- Ensure Google Sheets API is enabled in your project
- Check browser console for detailed errors

### "Failed to load profiles/videos"
- Verify the spreadsheet ID is correct
- Check that sheet names match exactly: `video_info` and `profiles_url`
- Ensure the spreadsheet is shared properly (public or with your account)

### "Failed to add/delete profile"
- Make sure you're signed in with OAuth
- Verify OAuth client ID is configured
- Check that the spreadsheet is shared with your Google account with Editor access

### CORS Errors
- Ensure your OAuth client ID has the correct authorized origins
- Check that you're accessing the app from the correct domain

## Production Deployment

1. Update OAuth client ID with production domain
2. Build the app: `npm run build`
3. Deploy the `dist` folder to your hosting service
4. Update authorized origins/redirects in Google Cloud Console

