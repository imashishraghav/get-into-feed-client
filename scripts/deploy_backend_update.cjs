const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const host = '46.202.165.101';
const port = '65002';
const user = 'u221467171';
const remoteLaravelDir = '/home/u221467171/domains/getintofeed.com/laravel';
const phpBin = '/opt/alt/php83/usr/bin/php';

console.log('🚀 Preparing Backend Update Deployment to getintofeed.com...');

const filesToBundle = [
    'app/Filament',
    'app/Http/Controllers/Api/V1/LeadController.php',
    'app/Http/Controllers/Api/V1/CrmWebhookController.php',
    'app/Jobs/SyncLeadToCrmJob.php',
    'app/Models/Lead.php',
    'app/Providers/Filament/AdminPanelProvider.php',
    'bootstrap/providers.php',
    'config/services.php',
    'database/migrations/2026_11_24_000001_add_is_test_to_crm_leads_table.php',
    'database/migrations/2026_11_24_000002_add_crm_sync_fields_to_crm_leads_table.php',
    'resources/views/filament',
    'routes/api.php',
    'routes/web.php',
];

const tarballPath = path.resolve('backend_update.tar.gz');
if (fs.existsSync(tarballPath)) {
    fs.unlinkSync(tarballPath);
}

// Ensure all files exist locally before packing
for (const file of filesToBundle) {
    const fullPath = path.resolve('laravel', file);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing required file: ${fullPath}`);
    }
}

console.log('📦 Packing backend update archive...');
const filesArg = filesToBundle.map(f => `"${f}"`).join(' ');
execSync(`tar -czf "${tarballPath}" ${filesArg}`, { cwd: path.resolve('laravel') });
const tarSizeKb = (fs.statSync(tarballPath).size / 1024).toFixed(1);
console.log(`✓ Created backend_update.tar.gz (${tarSizeKb} KB)`);

console.log(`📡 Uploading tarball to ${host}:${port}...`);
execSync(`scp -P ${port} -o StrictHostKeyChecking=no "${tarballPath}" ${user}@${host}:${remoteLaravelDir}/backend_update.tar.gz`, { stdio: 'inherit' });
console.log('✓ Upload complete.');

console.log('📂 Extracting archive on remote server and removing obsolete CRM files...');
const remoteCommands = [
    `cd ${remoteLaravelDir}`,
    `tar -xzf backend_update.tar.gz`,
    `rm -f backend_update.tar.gz`,
    // Remove obsolete CRM panel provider and duplicate CRM API controller
    `rm -f app/Providers/Filament/CrmPanelProvider.php`,
    `rm -rf app/Filament/Crm`,
    `rm -f app/Http/Controllers/Api/V1/CrmLeadController.php`,
    // Run database migrations for new CRM sync fields and is_test flag
    `${phpBin} artisan migrate --force`,
    // Clear optimize and view caches
    `${phpBin} artisan optimize:clear`,
].join(' && ');

execSync(`ssh -p ${port} -o StrictHostKeyChecking=no ${user}@${host} "${remoteCommands}"`, { stdio: 'inherit' });
console.log('✓ Remote extraction, migrations, and cache clearing complete.');

// Clean up local tarball
if (fs.existsSync(tarballPath)) {
    fs.unlinkSync(tarballPath);
}

console.log('\n🔍 Running Post-Deployment Remote Verification Checks...');

// 1. Verify /api/v1/crm/leads is 404 (decoupled)
try {
    const crmCheck = execSync('curl -s -o /dev/null -w "%{http_code}" https://getintofeed.com/api/v1/crm/leads', { encoding: 'utf8' }).trim();
    console.log(`- Obsolete /api/v1/crm/leads status: ${crmCheck} (Expected 404)`);
} catch (e) {
    console.log('- CRM API check failed: ' + e.message);
}

// 2. Verify /api/v1/webhooks/crm-status is 401 when unauthenticated
try {
    const webhookCheck = execSync('curl -s -o /dev/null -w "%{http_code}" -X POST https://getintofeed.com/api/v1/webhooks/crm-status', { encoding: 'utf8' }).trim();
    console.log(`- Inbound Webhook security check: ${webhookCheck} (Expected 401)`);
} catch (e) {
    console.log('- Webhook security check failed: ' + e.message);
}

// 3. Verify /admin/login is 200
try {
    const adminCheck = execSync('curl -s -o /dev/null -w "%{http_code}" https://getintofeed.com/admin/login', { encoding: 'utf8' }).trim();
    console.log(`- Admin login status: ${adminCheck} (Expected 200)`);
} catch (e) {
    console.log('- Admin login check failed: ' + e.message);
}

console.log('\n✨ Backend Deployment to getintofeed.com Successfully Completed!');
