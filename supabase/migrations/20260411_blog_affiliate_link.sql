-- Optional affiliate / partner links on blog posts (shown as CTA on published articles)
alter table public.blogs add column if not exists affiliate_link text;
alter table public.blogs add column if not exists affiliate_label text;

comment on column public.blogs.affiliate_link is 'External URL for affiliate or partner CTA (https://...)';
comment on column public.blogs.affiliate_label is 'Button text for the affiliate CTA (e.g. Shop on Amazon)';
