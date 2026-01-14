import { KJUR } from 'jsrsasign';
import { serviceAccount, SPREADSHEET_ID } from '../config/serviceAccount';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
let accessToken = null;
let tokenExpiry = null;

// Generate JWT for service account authentication
const generateJWT = () => {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    scope: SCOPES,
    aud: serviceAccount.token_uri,
    exp: now + 3600, // Token expires in 1 hour
    iat: now
  };

  const privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');
  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(payload);
  
  const token = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, privateKey);
  return token;
};

// Get access token using JWT
const getAccessToken = async () => {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const jwt = generateJWT();
    
    const response = await fetch(serviceAccount.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get access token: ${error}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute before expiry
    
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Make authenticated API request
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAccessToken();
  
  const response = await fetch(`https://sheets.googleapis.com/v4/${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      const errorText = await response.text();
      error = { error: { message: errorText } };
    }
    throw new Error(error.error?.message || error.message || `API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Initialize (no-op for service account, but kept for compatibility)
export const initGoogleAPI = async () => {
  // Service account is pre-configured, just verify we can get a token
  try {
    await getAccessToken();
    return true;
  } catch (error) {
    throw new Error(`Failed to initialize: ${error.message}`);
  }
};

// Sign in (no-op for service account)
export const signIn = async () => {
  return true; // Service account is always "signed in"
};

// Check if signed in (always true for service account)
export const isSignedIn = () => {
  return true;
};

// Sign out (no-op for service account)
export const signOut = async () => {
  accessToken = null;
  tokenExpiry = null;
};

// Read data from a sheet
export const readSheet = async (sheetName) => {
  try {
    const response = await apiRequest(
      `spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A:Z`
    );

    const rows = response.values || [];
    if (rows.length === 0) {
      return { headers: [], data: [] };
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return { headers, data };
  } catch (error) {
    console.error('Error reading sheet:', error);
    throw error;
  }
};

// Append a row to a sheet
export const appendRow = async (sheetName, values) => {
  try {
    const response = await apiRequest(
      `spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        body: JSON.stringify({
          values: [values],
        }),
      }
    );
    return response;
  } catch (error) {
    console.error('Error appending row:', error);
    throw error;
  }
};

// Delete a row from a sheet
export const deleteRow = async (sheetName, rowIndex) => {
  try {
    // First, get the sheet metadata to find the sheet ID
    const spreadsheet = await apiRequest(`spreadsheets/${SPREADSHEET_ID}`);
    
    const sheet = spreadsheet.sheets.find(
      (s) => s.properties.title === sheetName
    );

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const sheetId = sheet.properties.sheetId;

    // Delete the row using batchUpdate
    await apiRequest(
      `spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex - 1, // Convert to 0-based index
                  endIndex: rowIndex,
                },
              },
            },
          ],
        }),
      }
    );
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
};

// Get all profile URLs
export const getProfiles = async () => {
  const { data, headers } = await readSheet('username');
  // Find the URL column (could be 'url', 'profile_url', or first column)
  const urlColumn = headers.find(h => 
    h.toLowerCase().includes('url') || 
    h.toLowerCase().includes('profile')
  ) || headers[0] || 'url';
  
  return data.map((row, index) => ({
    id: index + 2, // +2 because index 0 is header, index 1 is first data row
    url: row[urlColumn] || Object.values(row)[0] || '',
  }));
};

// Add a profile URL
export const addProfile = async (url) => {
  // Get headers to determine the correct column structure
  const { headers } = await readSheet('username');
  const urlColumn = headers.find(h => 
    h.toLowerCase().includes('url') || 
    h.toLowerCase().includes('profile')
  ) || headers[0] || 'url';
  
  // Create row with proper structure
  const row = new Array(headers.length).fill('');
  const urlIndex = headers.indexOf(urlColumn);
  if (urlIndex >= 0) {
    row[urlIndex] = url;
  } else {
    row[0] = url;
  }
  
  return await appendRow('username', row);
};

// Delete a profile URL
export const deleteProfile = async (rowIndex) => {
  return await deleteRow('username', rowIndex);
};

// Get all videos
export const getVideos = async () => {
  const { data } = await readSheet('video_info');
  return data.map((row, index) => ({
    id: index + 2,
    // Core fields
    video_url: row.video_url || '',
    title: row.title || '',
    uploader: row.uploader || '',
    uploader_id: row.uploader_id || '',
    view_count: parseInt(row.view_count) || 0,
    like_count: parseInt(row.like_count) || 0,
    comment_count: parseInt(row.comment_count) || 0,
    upload_date: row.upload_date || '',
    duration: row.duration || '',
    description: row.description || '',
    video_id: row.video_id || '',
    file_path: row.file_path || '',
    drive_url: row.drive_url || '',
    // Additional fields from Apify
    source: row.source || '',
    direct_play_url: row.direct_play_url || '',
    wmplay_url: row.wmplay_url || '',
    cover_url: row.cover_url || '',
    region: row.region || '',
    aweme_id: row.aweme_id || '',
    create_time: row.create_time || '',
    share_count: parseInt(row.share_count) || 0,
    collect_count: parseInt(row.collect_count) || 0,
    download_count: parseInt(row.download_count) || 0,
    music_title: row.music_title || '',
    music_author: row.music_author || '',
    music_url: row.music_url || '',
  }));
};
