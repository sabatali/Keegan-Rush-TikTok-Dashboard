import { useState, useEffect } from 'react';
import { initGoogleAPI, signIn, isSignedIn } from '../services/googleSheets';

const AuthPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load saved credentials from localStorage
    const savedApiKey = localStorage.getItem('google_api_key');
    const savedSpreadsheetId = localStorage.getItem('google_spreadsheet_id');
    const savedClientId = localStorage.getItem('google_client_id') || '';
    
    if (savedApiKey && savedSpreadsheetId) {
      setApiKey(savedApiKey);
      setSpreadsheetId(savedSpreadsheetId);
      setClientId(savedClientId);
      handleInitialize(savedApiKey, savedSpreadsheetId, savedClientId);
    }
  }, []);

  const handleInitialize = async (key, id, cId = '') => {
    if (!key || !id) {
      setError('Please provide both API Key and Spreadsheet ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await initGoogleAPI(key, id, cId);
      localStorage.setItem('google_api_key', key);
      localStorage.setItem('google_spreadsheet_id', id);
      if (cId) {
        localStorage.setItem('google_client_id', cId);
      }
      setInitialized(true);
    } catch (err) {
      setError(err.message || 'Failed to initialize Google API');
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleInitialize(apiKey, spreadsheetId, clientId);
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const success = await signIn();
      if (success) {
        window.location.reload();
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  if (initialized && isSignedIn()) {
    return null; // User is authenticated, redirect will happen
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Google Sheets Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Configure your Google Sheets API connection
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!initialized ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="api-key" className="sr-only">
                  Google API Key
                </label>
                <input
                  id="api-key"
                  name="api-key"
                  type="text"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Google API Key"
                />
              </div>
              <div>
                <label htmlFor="spreadsheet-id" className="sr-only">
                  Spreadsheet ID
                </label>
                <input
                  id="spreadsheet-id"
                  name="spreadsheet-id"
                  type="text"
                  required
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Spreadsheet ID (from Google Sheets URL)"
                />
              </div>
              <div>
                <label htmlFor="client-id" className="sr-only">
                  OAuth Client ID (Optional)
                </label>
                <input
                  id="client-id"
                  name="client-id"
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="OAuth Client ID (Optional, for write operations)"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <div>
                <p className="mb-1 font-semibold">How to get your Spreadsheet ID:</p>
                <p>
                  From your Google Sheets URL:
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
                  </code>
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold">OAuth Client ID (Optional):</p>
                <p className="text-xs">
                  Required only for write operations (adding/deleting profiles). 
                  Get it from Google Cloud Console → APIs & Services → Credentials.
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Initializing...' : 'Initialize API'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              API initialized successfully!
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-4">
                For write operations (adding/deleting profiles), you need to sign in with Google OAuth.
              </p>
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

