import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Search, ChevronRight, BadgeCheck, MapPin, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { adminFetchVendors, getCategoryLabel, getCategoryEmoji, formatPrice } from '../../lib/marketplace';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending', color: 'text-amber-600' },
  { value: 'approved', label: 'Approved', color: 'text-emerald-600' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
  { value: 'suspended', label: 'Suspended', color: 'text-gray-600' },
];

const STATUS_BADGES = {
  pending: { icon: Clock, bg: 'bg-amber-50 text-amber-700' },
  approved: { icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-700' },
  rejected: { icon: XCircle, bg: 'bg-red-50 text-red-700' },
  suspended: { icon: AlertCircle, bg: 'bg-gray-100 text-gray-600' },
};

export default function AdminVendorListPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVendors();
  }, [statusFilter]);

  async function loadVendors() {
    setLoading(true);
    const data = await adminFetchVendors(statusFilter);
    setVendors(data);
    setLoading(false);
  }

  const filtered = searchTerm
    ? vendors.filter(v =>
        v.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : vendors;

  const pendingCount = vendors.filter(v => v.status === 'pending').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-rose-gold" />
            Vendor Moderation
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount > 0 && <span className="font-semibold text-amber-600">{pendingCount} pending review</span>}
            {pendingCount === 0 && 'All caught up! No pending reviews.'}
          </p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'bg-gradient-to-r from-rose-gold/15 to-rose-gold/5 text-rose-gold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search vendors..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
            id="admin-search"
          />
        </div>
      </div>

      {/* Vendor List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl animate-shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded animate-shimmer" />
                <div className="h-3 w-1/4 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No vendors found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm ? 'Try different search terms.' : 'No vendor listings match this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(vendor => {
            const statusBadge = STATUS_BADGES[vendor.status] || STATUS_BADGES.pending;
            const StatusIcon = statusBadge.icon;
            return (
              <Link
                key={vendor.id}
                to={`/admin/vendors/${vendor.id}`}
                className="glass-card-hover p-4 flex items-center gap-4 group"
                id={`admin-vendor-${vendor.id}`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
                  {vendor.cover_image ? (
                    <img src={vendor.cover_image} alt={vendor.business_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xl">{getCategoryEmoji(vendor.category)}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-rose-gold transition-colors">
                      {vendor.business_name}
                    </h3>
                    {vendor.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{getCategoryLabel(vendor.category)}</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {vendor.city}</span>
                    <span>{new Date(vendor.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${statusBadge.bg}`}>
                  <StatusIcon className="w-3 h-3" />
                  {vendor.status}
                </span>

                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
