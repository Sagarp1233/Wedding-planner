import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Manually read .env file — dotenv doesn't work inside vite.config.js context
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env')
    const envFile = readFileSync(envPath, 'utf-8')
    const env = {}
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
      }
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

  // Safety check — if env vars missing, skip silently
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

    console.log(`✅ Sitemap: found ${data.length} published blog posts`)
    return data.map(post => `/blog/${post.slug}`)

  } catch (err) {
    console.warn('⚠️ Sitemap fetch failed silently:', err.message)
    return []
  }
}