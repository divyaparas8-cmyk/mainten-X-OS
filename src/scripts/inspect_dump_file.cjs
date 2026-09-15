const fs = require('fs');

const filePath = 'd:\\Kiaan Project\\Maintance os\\MaintenX-OS\\maintenxos (1)';
const stat = fs.statSync(filePath);
console.log('File size:', stat.size, 'bytes');

const fd = fs.openSync(filePath, 'r');
const buf = Buffer.alloc(100);
fs.readSync(fd, buf, 0, 100, 0);
fs.closeSync(fd);

console.log('Magic bytes (hex):', buf.subarray(0, 16).toString('hex'));
console.log('Magic bytes (ascii):', buf.subarray(0, 50).toString('utf-8').replace(/[^\x20-\x7E]/g, '.'));

// Check if it is a pg_dump custom archive (starts with PGDMP)
if (buf.subarray(0, 5).toString('ascii') === 'PGDMP') {
  console.log('Detected: PostgreSQL custom format dump (pg_dump -Fc)');
} else if (buf.subarray(0, 4).toString('ascii') === 'SQL') {
  console.log('Detected: Plain text SQL');
} else {
  console.log('Unknown format');
}
