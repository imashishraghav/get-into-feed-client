const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'frontend', 'src');
const targetDir = path.join(rootDir, 'src');

console.log('====================================================');
console.log('🔄 FRONTEND SOURCE SYNCHRONIZATION');
console.log('====================================================');
console.log('Authoritative Source:', sourceDir);
console.log('Mirror Target:       ', targetDir);

if (!fs.existsSync(sourceDir)) {
  console.error('❌ Authoritative source directory does not exist:', sourceDir);
  process.exit(1);
}

function cleanAndSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 1. Copy or update all files/dirs from src to dest
  const srcItems = fs.readdirSync(src);
  for (const item of srcItems) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      cleanAndSync(srcPath, destPath);
    } else {
      let shouldCopy = true;
      if (fs.existsSync(destPath)) {
        const bufA = fs.readFileSync(srcPath);
        const bufB = fs.readFileSync(destPath);
        if (bufA.equals(bufB)) {
          shouldCopy = false;
        }
      }
      if (shouldCopy) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Synced: ${path.relative(rootDir, destPath)}`);
      }
    }
  }

  // 2. Remove orphaned files in dest that do not exist in src
  const destItems = fs.readdirSync(dest);
  for (const item of destItems) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (!fs.existsSync(srcPath)) {
      const stat = fs.statSync(destPath);
      if (stat.isDirectory()) {
        fs.rmSync(destPath, { recursive: true, force: true });
        console.log(`Removed orphaned dir: ${path.relative(rootDir, destPath)}`);
      } else {
        fs.unlinkSync(destPath);
        console.log(`Removed orphaned file: ${path.relative(rootDir, destPath)}`);
      }
    }
  }
}

cleanAndSync(sourceDir, targetDir);

// Verification check
function verifySync(src, dest) {
  const srcItems = fs.readdirSync(src);
  for (const item of srcItems) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (!fs.existsSync(destPath)) return false;
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      if (!verifySync(srcPath, destPath)) return false;
    } else {
      const bufA = fs.readFileSync(srcPath);
      const bufB = fs.readFileSync(destPath);
      if (!bufA.equals(bufB)) return false;
    }
  }
  return true;
}

const verified = verifySync(sourceDir, targetDir);
if (verified) {
  console.log('\n✅ 100% BIT-FOR-BIT SYNCHRONIZATION VERIFIED.');
  console.log('src/ is now an exact, verified mirror of frontend/src/.');
} else {
  console.error('\n❌ SYNCHRONIZATION VERIFICATION FAILED.');
  process.exit(1);
}
console.log('====================================================');
