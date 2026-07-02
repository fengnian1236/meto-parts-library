const fs = require('fs');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
const { execSync } = require('child_process');
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });

const c = fs.readFileSync('C:\\Users\\daiji\\meto-parts-library\\index.html', 'utf8');

// Check BOM
console.log('BOM check:', c.charCodeAt(0).toString(16), c.charCodeAt(1).toString(16), c.charCodeAt(2).toString(16));

// Find the button start
const si = c.indexOf('event.stopPropagation();editStage');
console.log('Button starts at:', si);

// Find s.cls position
const clsIdx = c.indexOf('s.cls', si);
console.log('s.cls at file position:', clsIdx);

// Look at bytes 70-120 around the button
const start = si;
console.log('\nFile bytes', start+70, 'to', start+120, ':');
for (let i = start + 70; i <= start + 120 && i < c.length; i++) {
    const cc = c[i];
    console.log('[' + i + ']=' + cc + '(0x' + cc.charCodeAt(0).toString(16) + ')');
}

// Find opening and closing quotes of s.cls
let openQ = clsIdx - 1;
while (openQ >= 0 && c[openQ] !== "'") openQ--;
console.log('\nOpening quote of s.cls at:', openQ, '(byte)', c[openQ].charCodeAt(0).toString(16));

let closeQ = clsIdx + 5;
while (closeQ < c.length && c[closeQ] !== "'") closeQ++;
console.log('Closing quote of s.cls at:', closeQ, '(byte)', c[closeQ].charCodeAt(0).toString(16));

// Find comma before s.cls
let comma = clsIdx - 1;
while (comma >= 0 && c[comma] !== ',') comma--;
console.log('Comma at:', comma, '(byte)', c[comma].charCodeAt(0).toString(16));

// Test: remove comma through closing quote (inclusive)
const beforeCls = c.substring(0, comma); // exclude comma
const afterClsPart = c.substring(closeQ + 1); // after closing quote
const newRaw = beforeCls + afterClsPart;
// But we need to extract just the button portion
const btnOld = c.substring(si, si + 130);
const btnNewRaw = btnOld.substring(0, comma - si) + btnOld.substring(closeQ + 1 - si);
console.log('\nOld button end:', JSON.stringify(btnOld.substring(btnOld.length - 50)));
console.log('New button end:', JSON.stringify(btnNewRaw.substring(btnNewRaw.length - 30)));
console.log('New has s.cls:', btnNewRaw.includes('s.cls'));

// Also check: what are bytes at comma-1, comma-2
console.log('\nBytes before comma:');
for (let i = comma - 3; i <= comma + 2; i++) {
    console.log('[' + i + ']=' + c[i] + '(0x' + c[i].charCodeAt(0).toString(16) + ')');
}
