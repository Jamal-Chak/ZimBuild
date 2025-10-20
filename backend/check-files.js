const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'server.js',
  'package.json',
  '.env',
  'config/database.js',
  'routes/contact.js',
  'routes/projects.js',
  'routes/uploads.js',
  'controllers/contactController.js',
  'controllers/projectController.js',
  'middleware/auth.js',
  'middleware/upload.js',
  'middleware/validation.js',
  'utils/memoryStorage.js'
];

console.log('🔍 Checking required files...');

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 All files are present! Server should start successfully.');
} else {
  console.log('\n⚠️ Some files are missing. Please create the missing files.');
}