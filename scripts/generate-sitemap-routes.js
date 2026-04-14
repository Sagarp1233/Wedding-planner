import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env')
    const envFile = readFileSync(envPath, 'utf-8')
    const env = {}
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) return
      const key = trimmed.substring(0, eqIndex).trim()
      const val = trimmed.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
      if (key) env[key] = val
    })
    return env
  } catch {
    console.warn('⚠️ Could not read .env file')
    return {}
  }
}

export async function getBlogRoutes() {
  const env = loadEnv()
  const supabaseUrl = env.VITE_SUPABASE_URL
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase env vars not found — sitemap will use static routes only')
    return []
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('blogs')
      .select('slug')
      .eq('status', 'published')

    if (error || !data) {
      console.warn('⚠️ Could not fetch blog slugs:', error?.message)
      return []
    }

    // Log raw slugs so we can see exactly what Supabase returns
    console.log('📋 Raw slugs from DB:', data.map(p => p.slug))

    const routes = data
      .map(post => (post.slug || '').trim())
      .filter(slug => {
        if (!slug) return false               // skip empty
        if (slug === '/') return false        // skip root
        if (slug.startsWith('http')) return false  // skip full URLs
        return true
      })
      .map(slug => {
        if (slug.startsWith('/blog/')) return slug       // already /blog/xxx
        if (slug.startsWith('blog/')) return `/${slug}`  // blog/xxx → /blog/xxx
        if (slug.startsWith('/')) return `/blog${slug}`  // /xxx → /blog/xxx
        return `/blog/${slug}`                           // xxx → /blog/xxx
      })

    // Remove duplicates
    const unique = [...new Set(routes)]

    console.log(`✅ Sitemap: found ${unique.length} published blog posts`)
    unique.forEach(r => console.log(`   → ${r}`))

    return unique

  } catch (err) {
    console.warn('⚠️ Sitemap fetch failed:', err.message)
    return []
  }
}