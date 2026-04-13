import { Link } from 'react-router-dom';

const RELATED_ARTICLES = [
  { title: 'Complete Indian Wedding Budget Guide 2026', slug: 'indian-wedding-budget-guide-2026', desc: 'Plan every rupee from venue to photography.' },
  { title: 'How to Plan a Wedding Under ₹5 Lakh', slug: 'how-to-plan-wedding-under-5-lakhs-india', desc: 'Budget-friendly tips for a beautiful celebration.' },
  { title: 'WhatsApp Wedding Invitation Ideas', slug: 'whatsapp-wedding-invitations-modern-trend-guide', desc: 'Creative templates for digital invites.' },
  { title: 'Wedding Photography Checklist', slug: 'wedding-photography-checklist-must-have-shots', desc: 'Never miss a must-have wedding shot.' },
  { title: 'Wedding Budget Calculator', slug: 'wedding-budget-calculator-how-to-allocate-money', desc: 'Calculate your ideal wedding budget instantly.' },
  { title: 'Last-Minute Wedding Checklist', slug: 'last-minute-wedding-checklist-30-days-before', desc: 'Essential tasks for the final weeks.' },
  { title: 'Low Budget Premium Wedding Ideas', slug: 'low-budget-wedding-ideas-india-look-premium', desc: 'Look expensive without the price tag.' },
];

/**
 * Blog internal linking block — adds Related Articles + Useful Links.
 * Place inside each static blog article before the footer.
 * @param {string} currentSlug - The slug of the current article (to exclude from related)
 */
export default function BlogInternalLinks({ currentSlug }) {
  const filtered = RELATED_ARTICLES.filter(a => a.slug !== currentSlug).slice(0, 3);

  return (
    <>
      {/* Inline Invitation CTA */}
      <section className="my-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-rose-gold/5 via-white to-plum/5 border border-rose-gold/15 text-center">
        <p className="text-2xl mb-2">💌</p>
        <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 mb-2">
          Create your wedding invitation in minutes using Wedora
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
          Choose from Hindu, Christian, Muslim, Telugu & Modern templates. Download or share on WhatsApp — 100% free!
        </p>
        <Link
          to="/create-invitation"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg shadow-rose-gold/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          Create Invitation Free →
        </Link>
      </section>

      {/* Related Articles */}
      <section className="my-12">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">📚 Related Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filtered.map(article => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-rose-gold transition-colors">
                {article.title}
              </h4>
              <p className="text-xs text-gray-500">{article.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Internal Links */}
      <section className="my-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-2">🔗 Useful Wedora Tools & Guides:</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <li>
            <Link to="/create-invitation" className="text-rose-gold hover:underline font-medium">
              → Free Wedding Invitation Creator
            </Link>
          </li>
          <li>
            <Link to="/#whatsapp-generator" className="text-rose-gold hover:underline font-medium">
              → WhatsApp Invite Message Generator
            </Link>
          </li>
          <li>
            <Link to="/signup" className="text-rose-gold hover:underline font-medium">
              → Wedding Budget Planner (Free)
            </Link>
          </li>
          <li>
            <Link to="/blog" className="text-rose-gold hover:underline font-medium">
              → All Wedding Planning Guides
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
