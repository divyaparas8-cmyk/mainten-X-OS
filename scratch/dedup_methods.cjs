const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '..', 'src', 'modules', 'master-data', 'masterData.service.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// First remove everything from line 5050 to the end (the ones we appended earlier)
const lines = content.split('\n');
// Find where deleteLabourStandard ends
let splitIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('async deleteLabourStandard')) {
    // Find the closing brace of this method
    for (let j = i; j < lines.length; j++) {
      if (lines[j].trim() === '}') {
        splitIdx = j + 1;
        break;
      }
    }
    break;
  }
}

console.log('Split index after first deleteLabourStandard:', splitIdx);
if (splitIdx !== -1) {
  lines.splice(splitIdx);
  lines.push('}');
  lines.push('');
  lines.push('export const masterDataService = new MasterDataService();');
  lines.push('');
  content = lines.join('\n');
}

// Now let's find duplicate async methods
const methodHeaderRegex = /^  async ([a-zA-Z0-9_]+)\s*\(/gm;
const seen = new Set();
const toRemoveRanges = [];

let match;
const methodMatches = [];
while ((match = methodHeaderRegex.exec(content)) !== null) {
  methodMatches.push({
    name: match[1],
    index: match.index
  });
}

console.log('Total methods found:', methodMatches.length);

for (let i = 0; i < methodMatches.length; i++) {
  const m = methodMatches[i];
  if (seen.has(m.name)) {
    // This is a duplicate! Find where this method ends
    // It ends right before the next method, or before the class closing brace
    const startIndex = m.index;
    let endIndex = (i + 1 < methodMatches.length) ? methodMatches[i + 1].index : content.lastIndexOf('}');
    toRemoveRanges.push({ name: m.name, start: startIndex, end: endIndex });
  } else {
    seen.add(m.name);
  }
}

console.log('Duplicate methods to remove:', toRemoveRanges.length);
toRemoveRanges.forEach(r => console.log('Removing duplicate:', r.name));

// Remove in reverse order so indices remain valid
for (let i = toRemoveRanges.length - 1; i >= 0; i--) {
  const r = toRemoveRanges[i];
  content = content.slice(0, r.start) + content.slice(r.end);
}

fs.writeFileSync(targetFile, content);
console.log('Finished removing duplicates from masterData.service.ts');
