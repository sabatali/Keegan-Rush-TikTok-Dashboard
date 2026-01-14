// Helper script to get the service account JSON for Vercel environment variables
// Run: node get-vercel-env.mjs

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonPath = join(__dirname, 'feisty-reporter-443010-t9-7a6a2c9eb04f.json');

if (!existsSync(jsonPath)) {
  console.error('Service account JSON file not found!');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(jsonPath, 'utf8'));

console.log('\n=== VERCEL ENVIRONMENT VARIABLES ===\n');
console.log('Copy these values to Vercel Dashboard → Settings → Environment Variables\n');

console.log('1. VITE_SERVICE_ACCOUNT_JSON (Recommended - Single Variable):');
console.log('   Value:');
console.log(JSON.stringify(serviceAccount));
console.log('\n');

console.log('OR use individual variables:\n');

console.log('2. VITE_PROJECT_ID:');
console.log(`   ${serviceAccount.project_id}\n`);

console.log('3. VITE_PRIVATE_KEY_ID:');
console.log(`   ${serviceAccount.private_key_id}\n`);

console.log('4. VITE_PRIVATE_KEY:');
console.log(`   ${serviceAccount.private_key}\n`);

console.log('5. VITE_CLIENT_EMAIL:');
console.log(`   ${serviceAccount.client_email}\n`);

console.log('6. VITE_CLIENT_ID:');
console.log(`   ${serviceAccount.client_id}\n`);

console.log('7. VITE_SPREADSHEET_ID:');
console.log('   1cr_N4vN2VJaKJhGr9H6dyeySz-nVwIIyCOyRaNnv4w0\n');

console.log('=== IMPORTANT ===');
console.log('1. Share your spreadsheet with:');
console.log(`   ${serviceAccount.client_email}`);
console.log('2. Set permission to "Editor"');
console.log('3. After adding env vars in Vercel, redeploy your project\n');

