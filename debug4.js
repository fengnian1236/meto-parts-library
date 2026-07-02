const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const content = fs.readFileSync(path, 'utf8');

// Check exact bytes around all editPart occurrences
const buf = Buffer.from(content);

// Find all editPart occurrences
const occurrences = [];
for (let i = 0; i < buf.length - 20; i++) {
    if (buf[i] === 0x65 && buf[i+1] === 0x64 && buf[i+2] === 0x69 && 
        buf[i+3] === 0x74 && buf[i+4] === 0x50 && buf[i+5] === 0x61 && buf[i+6] === 0x72 && buf[i+7] === 0x74) {
        const start = Math.max(0, i - 50);
        const end = Math.min(buf.length, i + 100);
        const chunk = buf.slice(start, end);
        const text = content.substring(start, end);
        console.log(`editPart at byte ${i}:`);
        console.log('  Bytes:', Array.from(chunk.slice(0, 20)).map(b => b.toString(16).padStart(2,'0')).join(' '));
        console.log('  Text:', JSON.stringify(text));
        occurrences.push(i);
    }
}
console.log('\nTotal editPart occurrences:', occurrences.length);

// Check DELETE PARTS marker
const delIdx = content.indexOf('DELETE PARTS');
console.log('\nDELETE PARTS at:', delIdx);
if (delIdx >= 0) console.log(JSON.stringify(content.substring(delIdx-30, delIdx+30)));
