import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Upload, Loader2, Menu } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Helper to create slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function AdminBlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onMenuClick } = useOutletContext();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    keywords: '',
    author: 'Wedora Team',
    publish_date: '',
    featured_image: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    affiliate_link: '',
    affiliate_label: '',
    status: 'draft'
  });

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        const tags = (data.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          category: data.category || tags[0] || '',
          keywords: data.keywords || '',
          author: data.author || 'Wedora Team',
          publish_date: data.published_at ? new Date(data.published_at).toISOString().slice(0, 10) : '',
          featured_image: data.featured_image || '',
          tags: data.category ? tags.filter((tag) => tag !== data.category).join(', ') : tags.slice(1).join(', '),
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          affiliate_link: data.affiliate_link || '',
          affiliate_label: data.affiliate_label || '',
          status: data.status || 'draft'
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleTitleChange(e) {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug only if not editing or slug is empty
      slug: (!isEditing || !prev.slug) ? generateSlug(newTitle) : prev.slug,
      meta_title: (!isEditing || !prev.meta_title) ? newTitle : prev.meta_title
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleFeaturedImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);
      const ext = file.name.split('.').pop();
      const path = `blog/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('blog-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('blog-images').getPublicUrl(path);
      setFormData((prev) => ({ ...prev, featured_image: publicUrlData.publicUrl || '' }));
    } catch (err) {
      setError(`Image upload failed. Create a Supabase bucket named "blog-images" and make it public. (${err.message})`);
    } finally {
      setUploadingImage(false);
    }
  }

  function buildTagsWithCategory() {
    const merged = [formData.category, ...(formData.tags || '').split(',')]
      .map((t) => t.trim())
      .filter(Boolean);
    return [...new Set(merged)].join(', ');
  }

  async function withTimeout(promise, timeoutMs = 15000) {
    let timerId;
    const timeoutPromise = new Promise((_, reject) => {
      timerId = window.setTimeout(() => {
        reject(new Error('Request timed out. Please try again.'));
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      window.clearTimeout(timerId);
    }
  }

  async function saveWithFallback(postData, postStatus) {
    const withOptional = {
      ...postData,
      category: formData.category || null,
      keywords: formData.keywords || null,
      author: formData.author || 'Wedora Team',
      affiliate_link: formData.affiliate_link?.trim() || null,
      affiliate_label: formData.affiliate_label?.trim() || null,
      published_at: postStatus === 'published'
        ? (formData.publish_date ? new Date(formData.publish_date).toISOString() : new Date().toISOString())
        : null
    };

    if (isEditing) {
      const attempt = await supabase.from('blogs').update(withOptional).eq('id', id);
      if (!attempt.error) return null;

      const retry = await supabase.from('blogs').update(postData).eq('id', id);
      return retry.error;
    }

    const attempt = await supabase.from('blogs').insert([withOptional]).select().single();
    if (!attempt.error) return { error: null, data: attempt.data };

    const retry = await supabase.from('blogs').insert([postData]).select().single();
    return { error: retry.error, data: retry.data };
  }

  async function handleSave(statusOverride = null) {
    if (saving) return;

    if (!formData.title || !formData.slug || !formData.content) {
      setError('Title, Slug, and Content are required.');
      setNotice(null);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setNotice(null);
      const postStatus = statusOverride || formData.status;

      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: buildTagsWithCategory(),
        featured_image: formData.featured_image,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        affiliate_link: formData.affiliate_link?.trim() || null,
        affiliate_label: formData.affiliate_label?.trim() || null,
        status: postStatus,
        updated_at: new Date().toISOString()
      };

      const result = await withTimeout(saveWithFallback(postData, postStatus));
      if (isEditing) {
        if (result) throw result;
      } else {
        if (result.error) throw result.error;
        // Redirect to edit mode
        navigate(`/admin/blog/${result.data.id}/edit`, { replace: true });
        return;
      }
      
      setFormData(prev => ({ ...prev, status: postStatus }));
      setNotice({
        type: 'success',
        message: postStatus === 'published' ? 'Post published successfully.' : 'Draft saved successfully.'
      });

    } catch (err) {
      setError(err?.message || 'Failed to save post.');
      setNotice(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-2xl w-full"></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <Link to="/admin/blog" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">Route: /blog/{formData.slug || 'your-slug'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-gold to-plum rounded-xl hover:shadow-lg hover:shadow-rose-gold/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {notice?.type === 'success' && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm">
          {notice.message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. 10 Best Wedding Venues in Delhi"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown) *</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-t-xl text-xs text-gray-500 font-medium">
                Use Markdown for formatting: # Heading 1, ## Heading 2, **bold**, *italic*, [link text](url)
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article content here in markdown..."
                className="w-full px-4 py-3 bg-white border-x border-b border-gray-200 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold min-h-[400px] font-mono text-sm leading-relaxed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="A short summary for the blog listing page..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold resize-none h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Wedora Team"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Post Details</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">URL Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Featured Image</label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
                />
                <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Uploading...' : 'Upload image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageUpload} disabled={uploadingImage} />
                </label>
                {formData.featured_image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img src={formData.featured_image} alt="Featured Preview" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs">No image provided</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Primary Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Budget Planning"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="wedding, budget, india (comma separated)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Keywords (SEO)</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="wedding planner app, indian wedding checklist"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Publish Date</label>
              <input
                type="date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">SEO Meta Data</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                placeholder="SEO Title (50-60 chars)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
              />
              <div className="text-right mt-1">
                <span className={`text-xs ${formData.meta_title.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.meta_title.length} / 60
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Meta Description</label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                placeholder="SEO description (150-160 chars)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold resize-none h-20"
              />
              <div className="text-right mt-1">
                <span className={`text-xs ${formData.meta_description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.meta_description.length} / 160
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Affiliate / partner link</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Shown as a call-to-action on the published post. Use full URLs (https://). Disclose partnerships in your article where required.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Affiliate URL</label>
                <input
                  type="url"
                  name="affiliate_link"
                  value={formData.affiliate_link}
                  onChange={handleChange}
                  placeholder="https://example.com/affiliate-product"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Button label</label>
                <input
                  type="text"
                  name="affiliate_label"
                  value={formData.affiliate_label}
                  onChange={handleChange}
                  placeholder="e.g. Shop the look, View deals"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold"
                />
              </div>
            </div>

            {/* Google Search Preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Google Preview</span>
              <div className="text-sm">
                <div className="text-blue-700 font-medium truncate text-base hover:underline cursor-pointer">{formData.meta_title || formData.title || 'Your Site Title'}</div>
                <div className="text-green-700 text-xs mt-0.5 truncate flex items-center gap-1">
                  <span>wedora.in</span> <span className="text-gray-400">›</span> <span>blog</span> <span className="text-gray-400">›</span> <span>{formData.slug || 'example-slug'}</span>
                </div>
                <div className="text-gray-600 text-xs mt-1 leading-snug line-clamp-2">
                  {formData.meta_description || formData.excerpt || 'Please provide a meta description to see how your website might appear in Google Search results.'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
