const fs = require('fs');
const https = require('https');
const path = require('path');

const PAGILA_DATA_URL = 'https://raw.githubusercontent.com/devrimgunduz/pagila/master/pagila-data.sql';
const OUTPUT_FILE = path.join(__dirname, '..', 'sql', '00-init', '03-full-pagila-data.sql');

console.log('Downloading official full Pagila dataset from:');
console.log(PAGILA_DATA_URL);

const file = fs.createWriteStream(OUTPUT_FILE);

https.get(PAGILA_DATA_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: HTTP ${response.statusCode}`);
    return;
  }

  const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
  let downloadedBytes = 0;

  response.on('data', (chunk) => {
    downloadedBytes += chunk.length;
    if (totalBytes > 0) {
      const pct = ((downloadedBytes / totalBytes) * 100).toFixed(1);
      process.stdout.write(`\rDownloading: ${pct}% (${(downloadedBytes / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      process.stdout.write(`\rDownloaded: ${(downloadedBytes / 1024 / 1024).toFixed(2)} MB`);
    }
  });

  response.pipe(file);

  file.on('finish', () => {
    file.close(() => {
      console.log(`\nDownload complete! Saved to ${OUTPUT_FILE}`);
      console.log('You can now restart Docker or execute the script to load the full 16,000+ rental dataset.');
    });
  });
}).on('error', (err) => {
  fs.unlink(OUTPUT_FILE, () => {});
  console.error('\nDownload error:', err.message);
});
