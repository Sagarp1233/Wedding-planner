-- Publishes the 2026 Indian wedding budget guide for /blog listing + sitemap.
-- The live article uses a dedicated UI when slug matches; content here is a short fallback for admin/API.

insert into public.blogs (
  title,
  slug,
  content,
  excerpt,
  tags,
  status,
  meta_title,
  meta_description,
  keywords,
  author,
  published_at,
  featured_image
)
select
  'Complete Indian Wedding Budget Guide (2026)',
  'indian-wedding-budget-guide-2026',
  E'# Complete Indian Wedding Budget Guide (2026)\n\nThis article is shown as an enhanced guide on Wedora. Open the post on the website for the full interactive version with tables, checklists, and FAQs.',
  'Plan your dream Indian wedding on any budget in 2026. Real cost breakdowns, money-saving tips, budget templates, and FAQs for every Indian family.',
  'Budget Planning, Indian Wedding, 2026 Guide',
  'published',
  'Complete Indian Wedding Budget Guide (2026) – Plan Under Any Budget | Wedora',
  'Plan your dream Indian wedding on any budget in 2026. Real cost breakdowns, money-saving tips, budget templates, and FAQs for every Indian family.',
  'indian wedding budget 2026, wedding cost india, wedding budget breakdown, budget wedding india, wedding planner app, wedora',
  'Wedora Wedding Planning Team',
  '2026-01-15T00:00:00+00'::timestamptz,
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&auto=format&fit=crop'
where not exists (
  select 1 from public.blogs where slug = 'indian-wedding-budget-guide-2026'
);
