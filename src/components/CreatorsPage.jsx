import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const CreatorsPage = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState({});
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    username: '',
    display_name: '',
    is_active: true,
    notes: '',
  });

  const loadCreators = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('creators')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message || 'Failed to load creators.');
      setCreators([]);
    } else {
      setCreators(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCreators();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.username.trim()) {
      setError('Username is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      username: form.username.trim(),
      display_name: form.display_name.trim() || null,
      is_active: form.is_active,
      notes: form.notes.trim() || null,
    };

    const { error: insertError } = await supabase.from('creators').insert(payload);

    if (insertError) {
      setError(insertError.message || 'Failed to create creator.');
    } else {
      setForm({ username: '', display_name: '', is_active: true, notes: '' });
      await loadCreators();
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this creator?')) {
      return;
    }
    setDeleting((prev) => ({ ...prev, [id]: true }));
    setError(null);

    const { error: deleteError } = await supabase.from('creators').delete().eq('id', id);

    if (deleteError) {
      setError(deleteError.message || 'Failed to delete creator.');
    } else {
      setCreators((prev) => prev.filter((creator) => creator.id !== id));
    }

    setDeleting((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creators</h1>
          <p className="text-sm text-gray-600">Manage creators for the dashboard.</p>
        </div>
        <button
          onClick={loadCreators}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Creator</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="creator_username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="display_name">
              Display name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              value={form.display_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Creator Name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional notes"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Active
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Creator'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Creators ({creators.length})
          </h2>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-gray-500">Loading creators...</div>
        ) : creators.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500">
            No creators found. Add one above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {creators.map((creator) => (
              <li key={creator.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {creator.display_name || creator.username}
                    </p>
                    <p className="text-xs text-gray-500">@{creator.username}</p>
                    {creator.notes && (
                      <p className="text-xs text-gray-500 mt-1">{creator.notes}</p>
                    )}
                    <span
                      className={`inline-flex mt-2 px-2 py-1 text-xs rounded ${
                        creator.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {creator.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(creator.id)}
                    disabled={deleting[creator.id]}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting[creator.id] ? 'Deleting...' : 'Delete'}
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

export default CreatorsPage;
