import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { FileText, Globe, PenTool, PlusCircle, Menu } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboardPage() {
  const { onMenuClick } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  async function fetchOverview() {
    try {
      setLoading(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('id, title, slug, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin overview.');
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const published = posts.filter((p) => p.status === 'published').length;
    const draft = posts.length - published;
    return {
      total: posts.length,
      published,
      draft
    };
  }, [posts]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage SEO content and publishing workflow</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-rose-gold/20 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          New Blog Post
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Posts</p>
          <p className="text-2xl font-serif font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-serif font-bold text-emerald-600 mt-2">{stats.published}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Drafts</p>
          <p className="text-2xl font-serif font-bold text-amber-600 mt-2">{stats.draft}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent Posts</h2>
          <Link to="/admin/blog" className="text-xs font-medium text-rose-gold hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-6 animate-pulse space-y-3">
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No posts yet. Create your first article.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.slice(0, 8).map((post) => (
              <div key={post.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-400 truncate">/blog/{post.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${
                      post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {post.status === 'published' ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <Link
                    to={`/admin/blog/${post.id}/edit`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit post"
                  >
                    <PenTool className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
