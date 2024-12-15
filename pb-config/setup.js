const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const PB_VERSION = 'v0.19.4';
const PB_FILENAME = 'pocketbase.exe';
const CONFIG_FILE = 'config.json';

async function downloadPocketBase() {
  const url = `https://github.com/pocketbase/pocketbase/releases/download/${PB_VERSION}/pocketbase_${PB_VERSION}_windows_amd64.zip`;
  const zipPath = path.join(__dirname, 'pocketbase.zip');

  console.log('Downloading PocketBase...');
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download complete.');
        resolve(zipPath);
      });
    }).on('error', (err) => {
      fs.unlink(zipPath);
      reject(err);
    });
  });
}

async function extractZip(zipPath) {
  console.log('Extracting PocketBase...');
  try {
    await execAsync(`powershell Expand-Archive -Path "${zipPath}" -DestinationPath "${__dirname}" -Force`);
    console.log('Extraction complete.');
    // Clean up zip file
    fs.unlinkSync(zipPath);
  } catch (err) {
    console.error('Error extracting:', err);
    throw err;
  }
}

async function setup() {
  try {
    if (!fs.existsSync(PB_FILENAME)) {
      const zipPath = await downloadPocketBase();
      await extractZip(zipPath);
    }

    // Create data directory if it doesn't exist
    if (!fs.existsSync('pb_data')) {
      fs.mkdirSync('pb_data');
    }

    console.log('Setup complete! You can now run PocketBase using:');
    console.log('pocketbase.exe serve');
    console.log('\nThen visit http://127.0.0.1:8090/_/ to create your admin account');
  } catch (err) {
    console.error('Setup failed:', err);
  }
}

setup();
