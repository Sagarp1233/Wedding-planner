import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very basic dotenv parsing
const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'] || process.env.VITE_SUPABASE_URL;
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'] || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const payload = {
    slug: 'sumanth-and-abhineethi',
    bride_name: 'Abhineethi',
    groom_name: 'Sumanth',
    wedding_date: futureDate.toISOString(),
    theme: 'elegant',
    is_published: true,
    story_text: 'Sumanth and Abhineethi met during their college years and have been inseparable ever since. From late night study sessions to traveling the world together, their journey has been magical. Join us as we celebrate our love and commitment to each other surrounded by loved ones.',
    venue_name: 'Taj Falaknuma Palace',
    venue_address: 'Engine Bowli, Falaknuma, Hyderabad, Telangana',
    venue_city: 'Hyderabad',
    events: [
      { name: 'Sangeet & Mehendi', date: futureDate.toISOString(), time: '7:00 PM', venue: 'Falaknuma Lawns' },
      { name: 'Muhurtham', date: futureDate.toISOString(), time: '9:30 AM', venue: 'Main Hall' },
      { name: 'Reception', date: futureDate.toISOString(), time: '7:30 PM', venue: 'Grand Ballroom' }
    ],
    show_wedora_branding: true
  };

  const { data, error } = await supabase
    .from('wedding_sites')
    .upsert([payload], { onConflict: 'slug' })
    .select();

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Successfully inserted sample wedding:", data);
  }
}

run();
