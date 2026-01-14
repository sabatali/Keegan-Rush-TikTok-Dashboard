import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ProfilesPage from './components/ProfilesPage';
import VideosPage from './components/VideosPage';
import { initGoogleAPI } from './services/googleSheets';
import './App.css';

function App() {
  const [apiInitialized, setApiInitialized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize with service account (pre-configured)
    const initialize = async () => {
      try {
        await initGoogleAPI();
        setApiInitialized(true);
      } catch (err) {
        setError(err.message || 'Failed to initialize Google Sheets API');
        console.error('Initialization error:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    initialize();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Google Sheets connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-bold mb-2">Initialization Error</h2>
            <p>{error}</p>
          </div>
          <div className="text-sm text-gray-600 mt-4">
            <p className="font-semibold mb-2">Please ensure:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>The spreadsheet is shared with the service account email</li>
              <li>Google Sheets API is enabled in your Google Cloud project</li>
              <li>The service account has proper permissions</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/videos" replace />} />
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/videos" element={<VideosPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
