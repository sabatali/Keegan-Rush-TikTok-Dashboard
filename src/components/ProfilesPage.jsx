import { useState, useEffect } from 'react';
import { getProfiles, addProfile, deleteProfile } from '../services/googleSheets';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProfileUrl, setNewProfileUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err.message || 'Failed to load profiles');
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    
    if (!newProfileUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      await addProfile(newProfileUrl.trim());
      setNewProfileUrl('');
      await loadProfiles();
    } catch (err) {
      setError(err.message || 'Failed to add profile');
      console.error('Error adding profile:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteProfile = async (rowIndex) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      setDeleting({ ...deleting, [rowIndex]: true });
      setError(null);
      await deleteProfile(rowIndex);
      await loadProfiles();
    } catch (err) {
      setError(err.message || 'Failed to delete profile');
      console.error('Error deleting profile:', err);
    } finally {
      setDeleting({ ...deleting, [rowIndex]: false });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage TikTok profile URLs stored in Google Sheets
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add Profile Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Profile</h3>
        <form onSubmit={handleAddProfile} className="flex gap-4">
          <input
            type="username"
            value={newProfileUrl}
            onChange={(e) => setNewProfileUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@username"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={adding}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding...' : 'Add Profile'}
          </button>
        </form>
      </div>

      {/* Profiles List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Profiles ({profiles.length})
          </h3>
        </div>
        {profiles.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No profiles found. Add your first profile above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <li key={profile.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {profile.url}
                  </a>
                  <button
                    onClick={() => handleDeleteProfile(profile.id)}
                    disabled={deleting[profile.id]}
                    className="ml-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting[profile.id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilesPage;

