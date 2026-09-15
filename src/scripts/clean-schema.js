const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../db/schema/masterData.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

console.log('Total lines before:', lines.length);
// Line 305 is closing of allergenRules (0-indexed 304)
// Let's find index of the second `export const uoms = pgTable("uoms"`
const firstUoms = lines.findIndex((l, idx) => l.includes('export const uoms = pgTable("uoms"') && idx > 250);
const secondUoms = lines.findIndex((l, idx) => l.includes('export const uoms = pgTable("uoms"') && idx > firstUoms);

console.log('firstUoms at line:', firstUoms + 1);
console.log('secondUoms at line:', secondUoms + 1);

if (firstUoms !== -1 && secondUoms !== -1) {
  // Remove from firstUoms up to secondUoms
  lines.splice(firstUoms, secondUoms - firstUoms);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log('Cleaned successfully. Total lines now:', lines.length);
} else {
  console.log('Could not find duplicate boundaries');
}
