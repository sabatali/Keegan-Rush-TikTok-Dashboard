# Important Setup Instructions

## ⚠️ Critical: Share Your Spreadsheet

Before the dashboard can access your Google Sheets, you **MUST** share the spreadsheet with the service account email:

**Service Account Email:**
```
tiktok-downloading-project@feisty-reporter-443010-t9.iam.gserviceaccount.com
```

### How to Share:

1. Open your Google Sheets: https://docs.google.com/spreadsheets/d/1cr_N4vN2VJaKJhGr9H6dyeySz-nVwIIyCOyRaNnv4w0/edit

2. Click the **"Share"** button (top right)

3. In the "Add people and groups" field, paste:
   ```
   tiktok-downloading-project@feisty-reporter-443010-t9.iam.gserviceaccount.com
   ```

4. Set permission to **"Editor"** (required for read and write operations)

5. Click **"Send"** (you can uncheck "Notify people" since it's a service account)

### Verify Setup:

- ✅ Spreadsheet is shared with the service account email
- ✅ Service account has "Editor" permission
- ✅ Google Sheets API is enabled in Google Cloud Console
- ✅ Sheets are named exactly: `video_info` and `profiles_url`

## Current Configuration

- **Spreadsheet ID:** `1cr_N4vN2VJaKJhGr9H6dyeySz-nVwIIyCOyRaNnv4w0`
- **Spreadsheet Name:** Keegan Rush TikTok
- **Service Account:** Pre-configured in `src/config/serviceAccount.js`

The dashboard will automatically connect when you run it - no credentials needed!

