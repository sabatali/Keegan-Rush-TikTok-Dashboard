import { useState, useEffect, useMemo } from 'react';
import { getVideos } from '../services/googleSheets';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('views');
  const [filterBy, setFilterBy] = useState('all');
  const [filterByUsername, setFilterByUsername] = useState('all');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      setError(err.message || 'Failed to load videos');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique usernames for filter dropdown
  const uniqueUsernames = useMemo(() => {
    const usernames = new Set();
    videos.forEach((video) => {
      if (video.uploader) {
        usernames.add(video.uploader);
      }
    });
    return Array.from(usernames).sort();
  }, [videos]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalViews = videos.reduce((sum, v) => sum + (v.view_count || 0), 0);
    const totalLikes = videos.reduce((sum, v) => sum + (v.like_count || 0), 0);
    const totalComments = videos.reduce((sum, v) => sum + (v.comment_count || 0), 0);
    const totalShares = videos.reduce((sum, v) => sum + (v.share_count || 0), 0);
    const avgViews = videos.length > 0 ? totalViews / videos.length : 0;
    const topVideo = videos.length > 0 
      ? videos.reduce((max, v) => (v.view_count > max.view_count ? v : max), videos[0])
      : null;

    return {
      totalVideos: videos.length,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      avgViews,
      topVideo,
      uniqueCreators: uniqueUsernames.length,
    };
  }, [videos, uniqueUsernames]);

  // Calculate average views for filtering
  const averageViews = useMemo(() => {
    if (videos.length === 0) return 0;
    return stats.avgViews;
  }, [videos, stats.avgViews]);

  // Sort and filter videos
  const processedVideos = useMemo(() => {
    let filtered = [...videos];

    // Apply username filter
    if (filterByUsername !== 'all') {
      filtered = filtered.filter((video) => video.uploader === filterByUsername);
    }

    // Apply performance filter
    if (filterBy === 'high') {
      filtered = filtered.filter((video) => video.view_count > averageViews);
    } else if (filterBy === 'average') {
      filtered = filtered.filter((video) => video.view_count <= averageViews);
    }

    // Apply sorting
    if (sortBy === 'views') {
      filtered.sort((a, b) => b.view_count - a.view_count);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.upload_date);
        const dateB = new Date(b.upload_date);
        return dateB - dateA;
      });
    } else if (sortBy === 'random') {
      filtered = filtered.sort(() => Math.random() - 0.5);
    }

    return filtered;
  }, [videos, sortBy, filterBy, filterByUsername, averageViews]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading video data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📊 Video Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Comprehensive insights and analytics for your TikTok video collection
              </p>
            </div>
            <button
              onClick={loadVideos}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <span>🔄</span> Refresh Data
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              <div>
                <p className="font-semibold">Error Loading Data</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Videos Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Videos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalVideos}</p>
                <p className="text-xs text-gray-500 mt-1">{uniqueUsernames.length} creators</p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <span className="text-3xl">🎬</span>
              </div>
            </div>
          </div>

          {/* Total Views Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                <p className="text-xs text-gray-500 mt-1">Avg: {formatNumber(Math.round(stats.avgViews))}</p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <span className="text-3xl">👁️</span>
              </div>
            </div>
          </div>

          {/* Total Engagement Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Engagement</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats.totalLikes + stats.totalComments + stats.totalShares)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatNumber(stats.totalLikes)} likes, {formatNumber(stats.totalComments)} comments
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <span className="text-3xl">❤️</span>
              </div>
            </div>
          </div>

          {/* Top Video Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Top Video</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.topVideo ? formatNumber(stats.topVideo.view_count) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                  {stats.topVideo?.uploader || 'N/A'}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-4">
                <span className="text-3xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🔍</span>
            <h2 className="text-xl font-bold text-gray-900">Filters & Sorting</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Filter By Username
              </label>
              <select
                value={filterByUsername}
                onChange={(e) => setFilterByUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
              >
                <option value="all">All Usernames ({uniqueUsernames.length})</option>
                {uniqueUsernames.map((username) => (
                  <option key={username} value={username}>
                    @{username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
              >
                <option value="views">Views (High to Low)</option>
                <option value="date">Upload Date (Newest First)</option>
                <option value="random">Random / Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⚡ Filter By Performance
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
              >
                <option value="all">All Videos</option>
                <option value="high">High Performing (Above Avg)</option>
                <option value="average">Average & Below</option>
              </select>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{processedVideos.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{videos.length}</span> videos displayed
                {filterByUsername !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    @{filterByUsername}
                  </span>
                )}
                {filterBy !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {filterBy === 'high' ? 'High Performer' : 'Average'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Videos Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">📹</span> Video Collection
              </h2>
              <span className="text-sm text-gray-600 font-medium">
                {processedVideos.length} video{processedVideos.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Cover
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Title
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Creator
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Views
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Likes
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Comments
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Shares
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Duration
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedVideos.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-6xl mb-4">📭</div>
                      <p className="text-gray-600 text-lg font-medium">No videos found</p>
                      <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  processedVideos.map((video, index) => (
                    <tr
                      key={video.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        {video.cover_url ? (
                          <img
                            src={video.cover_url}
                            alt="Cover"
                            className="h-20 w-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium shadow-inner">
                            No Cover
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-semibold text-gray-900 truncate" title={video.title}>
                            {video.title || 'N/A'}
                          </div>
                          {video.video_url && (
                            <a
                              href={video.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                            >
                              View on TikTok →
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">@{video.uploader || 'N/A'}</div>
                            {video.uploader_id && (
                              <div className="text-xs text-gray-500 font-mono">ID: {video.uploader_id.slice(0, 8)}...</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatNumber(video.view_count)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {video.view_count > stats.avgViews ? '🔥' : '📊'} 
                          {video.view_count > stats.avgViews ? ' Above avg' : ' Below avg'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatNumber(video.like_count)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatNumber(video.comment_count)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatNumber(video.share_count || 0)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatDate(video.upload_date)}</div>
                        {video.create_time && (
                          <div className="text-xs text-gray-500">
                            {new Date(parseInt(video.create_time) * 1000).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                          {video.duration ? `${video.duration}s` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {video.direct_play_url && (
                            <a
                              href={video.direct_play_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-center"
                              title={video.direct_play_url}
                            >
                              ▶ Play
                            </a>
                          )}
                          {video.source && (
                            <span className={`text-xs px-2 py-1 rounded text-center font-medium ${
                              video.source === 'apify' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {video.source}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
