import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const VideosPage = () => {
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [updatingFacebook, setUpdatingFacebook] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);

  const loadCreators = useCallback(async () => {
    setLoadingCreators(true);
    setError(null);

    const { data, error: creatorsError } = await supabase
      .from('creators')
      .select('*')
      .order('display_name', { ascending: true })
      .order('username', { ascending: true });

    if (creatorsError) {
      setError(creatorsError.message || 'Failed to load creators.');
      setCreators([]);
      setSelectedCreator(null);
    } else {
      const nextCreators = data || [];
      setCreators(nextCreators);
      setSelectedCreator((prev) => {
        if (prev) return prev;
        const first = nextCreators[0];
        if (!first) return null;
        if (first.uploader_id) {
          return { label: first.display_name || first.username || 'Creator', value: first.uploader_id, column: 'uploader_id' };
        }
        const name = first.username || first.display_name;
        return name ? { label: name, value: name, column: 'uploader' } : null;
      });
    }

    setLoadingCreators(false);
  }, []);

  const loadVideos = useCallback(async (creatorSelection) => {
    if (!creatorSelection?.value || !creatorSelection?.column) {
      setVideos([]);
      setLoadingVideos(false);
      return;
    }

    setLoadingVideos(true);
    setError(null);

    const { data, error: videosError } = await supabase
      .from('videos')
      .select('*')
      .eq(creatorSelection.column, creatorSelection.value)
      .order('created_at', { ascending: false });

    if (videosError) {
      setError(videosError.message || 'Failed to load videos.');
      setVideos([]);
    } else {
      setVideos(data || []);
    }

    setLoadingVideos(false);
  }, []);

  useEffect(() => {
    loadCreators();
  }, [loadCreators]);

  useEffect(() => {
    loadVideos(selectedCreator);
  }, [loadVideos, selectedCreator]);

  const columns = useMemo(
    () => [
      { key: 'title', label: 'Title' },
      { key: 'uploader', label: 'Uploader' },
      { key: 'upload_date', label: 'Upload Date' },
      { key: 'view_count', label: 'Views' },
      { key: 'like_count', label: 'Likes' },
      { key: 'drive_url', label: 'Drive URL' },
    ],
    []
  );

  const handleToggleUploadStatus = async (videoId, nextStatus) => {
    const previous = videos.find((video) => video.id === videoId)?.upload_status;

    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, upload_status: nextStatus } : video
      )
    );
    setUpdatingStatus((prev) => ({ ...prev, [videoId]: true }));

    const { error: updateError } = await supabase
      .from('videos')
      .update({ upload_status: nextStatus })
      .eq('id', videoId);

    if (updateError) {
      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, upload_status: previous } : video
        )
      );
      setError(updateError.message || 'Failed to update upload status.');
    }

    setUpdatingStatus((prev) => ({ ...prev, [videoId]: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (key === 'upload_status') return value ? 'Yes' : 'No';
    if (key === 'upload_on_facebook') return value ? 'Yes' : 'No';
    if (key === 'upload_date') return formatDate(value);
    if (key === 'create_time' || key === 'created_at') return formatDateTime(value);
    return value;
  };

  const truncateTitle = (title) => {
    if (!title) return 'Untitled';
    const words = String(title).trim().split(/\s+/);
    return words.length <= 3 ? words.join(' ') : `${words.slice(0, 3).join(' ')}...`;
  };

  const handleToggleFacebookStatus = async (videoId, nextStatus) => {
    const previous = videos.find((video) => video.id === videoId)?.upload_on_facebook;

    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, upload_on_facebook: nextStatus } : video
      )
    );
    setUpdatingFacebook((prev) => ({ ...prev, [videoId]: true }));

    const { error: updateError } = await supabase
      .from('videos')
      .update({ upload_on_facebook: nextStatus })
      .eq('id', videoId);

    if (updateError) {
      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, upload_on_facebook: previous } : video
        )
      );
      setError(updateError.message || 'Failed to update Facebook upload status.');
    }

    setUpdatingFacebook((prev) => ({ ...prev, [videoId]: false }));
  };

  if (loadingCreators) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading creators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Video Dashboard</h1>
            <p className="text-sm text-gray-600">Manage weekly uploads by creator.</p>
          </div>
          <button
            onClick={() => loadVideos(selectedCreator)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {creators.length === 0 ? (
              <p className="text-sm text-gray-500">No creators found.</p>
            ) : (
              creators.map((creator) => {
                const label =
                  creator.display_name || creator.username || 'Creator';
                const selection = creator.uploader_id
                  ? { label, value: creator.uploader_id, column: 'uploader_id' }
                  : creator.username
                  ? { label: creator.username, value: creator.username, column: 'uploader' }
                  : creator.display_name
                  ? { label: creator.display_name, value: creator.display_name, column: 'uploader' }
                  : null;
                const isActive =
                  selection &&
                  selectedCreator?.column === selection.column &&
                  selectedCreator?.value === selection.value;
                return (
                  <button
                    key={creator.id || label}
                    onClick={() => selection && setSelectedCreator(selection)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                    disabled={!selection}
                  >
                    {label}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {loadingVideos ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
            No videos found for this creator.
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-3 text-left whitespace-nowrap"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {videos.map((video) => (
                    <tr key={video.id} className="align-top">
                      {columns.map((column) => {
                        const value = formatValue(column.key, video[column.key]);
                        if (column.key === 'title') {
                          return (
                            <td key={column.key} className="px-4 py-3">
                              {truncateTitle(video.title)}
                            </td>
                          );
                        }
                        if (column.key === 'video_url' && video.video_url) {
                          return (
                            <td key={column.key} className="px-4 py-3">
                              <a
                                href={video.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Open
                              </a>
                            </td>
                          );
                        }
                        if (column.key === 'direct_play_url' && video.direct_play_url) {
                          return (
                            <td key={column.key} className="px-4 py-3">
                              <a
                                href={video.direct_play_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Open
                              </a>
                            </td>
                          );
                        }
                        if (column.key === 'drive_url' && video.drive_url) {
                          return (
                            <td key={column.key} className="px-4 py-3">
                              <a
                                href={video.drive_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Open
                              </a>
                            </td>
                          );
                        }
                        return (
                          <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                            {value}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={!!video.upload_status}
                              onChange={(event) =>
                                handleToggleUploadStatus(video.id, event.target.checked)
                              }
                              disabled={!!updatingStatus[video.id]}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            Uploaded
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={!!video.upload_on_facebook}
                              onChange={(event) =>
                                handleToggleFacebookStatus(video.id, event.target.checked)
                              }
                              disabled={!!updatingFacebook[video.id]}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            Upload on Facebook
                          </label>
                          <button
                            type="button"
                            onClick={() => setSelectedVideo(video)}
                            className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
                          >
                            View details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedVideo.title || 'Video details'}
                </h2>
                <p className="text-sm text-gray-500">
                  Created: {formatDateTime(selectedVideo.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(selectedVideo).map(([key, value]) => (
                <div key={key} className="border border-gray-100 rounded-md p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">{key}</p>
                  {String(key).includes('url') && value ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 break-all hover:underline"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-gray-800 break-all">
                      {formatValue(key, value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
