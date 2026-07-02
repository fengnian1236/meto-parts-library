const fs = require('fs');
const { execSync } = require('child_process');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
const content = fs.readFileSync('C:\\Users\\daiji\\meto-parts-library\\index.html', 'utf8');

const si = content.indexOf('event.stopPropagation();editStage');
const btnEnd = content.indexOf('">✎</button>', si);
const btn = content.substring(si, btnEnd + 11);

console.log('Button length:', btn.length);

// Print all characters from position 80 to 110
console.log('\nPositions 80-110:');
for (let i = 80; i <= 110 && i < btn.length; i++) {
    const c = btn[i];
    const hex = c.charCodeAt(0).toString(16).padStart(2, '0');
    console.log('  [' + i + '] = ' + c + ' (0x' + hex + ')');
}

// Find s.cls
const clsIdx = btn.indexOf('s.cls');
console.log('\ns.cls at:', clsIdx);

// Find the first ' after s.cls (this is the ' of "+ s.cls +")
let q1 = clsIdx + 5; // after "s"
while (q1 < btn.length && btn[q1] !== "'") q1++;
console.log('First quote after s.cls at:', q1, '=', JSON.stringify(btn[q1]));

// Find the next ' after that (this is the \' that closes s.cls param)
let q2 = q1 + 1;
while (q2 < btn.length && btn[q2] !== "'") q2++;
console.log('Second quote after s.cls at:', q2, '=', JSON.stringify(btn[q2]));

// So the s.cls param is from (q1-5) to q2 inclusive
// Actually: q1 is the ' before \ of s.cls closing
// s.cls param is: '\' at q2-1, ' at q2 (the \' that closes s.cls)
// Wait: '\' in JS string means: backslash at q2-1, ' at q2
// s.cls param ends at q2
// s.cls param starts at: find the ' that opens it (search backwards from q1)
let openQ = q1 - 1;
while (openQ >= 0 && btn[openQ] !== "'") openQ--;
console.log('Opening quote of s.cls at:', openQ, '=', JSON.stringify(btn[openQ]));

// The comma before s.cls
let comma = clsIdx - 1;
while (comma >= 0 && btn[comma] !== ',') comma--;
console.log('Comma before s.cls at:', comma, '=', JSON.stringify(btn[comma]));

// Now show what we'd get with beforeCls = substring(0, comma) and afterClsPart = substring(q2+1)
const beforeCls = btn.substring(0, comma);
const afterClsPart = btn.substring(q2 + 1);
console.log('\nbeforeCls ends:', JSON.stringify(beforeCls.substring(beforeCls.length - 40)));
console.log('afterClsPart starts:', JSON.stringify(afterClsPart.substring(0, 40)));
const newRaw = beforeCls + afterClsPart;
console.log('\nNew raw starts:', JSON.stringify(newRaw.substring(0, 80)));
console.log('New raw ends:', JSON.stringify(newRaw.substring(newRaw.length - 40)));

// The BEFORE_SCLS opening ' of s.cls
const beforeSclsOpen = btn[openQ - 1];
console.log('\nChar before openQ(', openQ, '):', JSON.stringify(beforeSclsOpen), 'at pos', openQ - 1);

// Actually: comma at 85, space at 84, then ' at 83? or ' at 85?
console.log('\nChars around comma:');
for (let i = 83; i <= 88; i++) {
    const c = btn[i];
    console.log('  [' + i + '] = ' + c + ' (0x' + c.charCodeAt(0).toString(16) + ')');
}

// Now fix: beforeCls = up to comma (85), after = after the closing quote (q2)
const fixedBefore = btn.substring(0, comma);
const fixedAfter = btn.substring(q2 + 1);
const fixedNew = fixedBefore + fixedAfter;
console.log('\nFixed new starts:', JSON.stringify(fixedNew.substring(0, 80)));
console.log('Fixed new ends:', JSON.stringify(fixedNew.substring(fixedNew.length - 30)));
console.log('Fixed new has s.cls:', fixedNew.includes('s.cls'));
console.log('Fixed new has editStage:', fixedNew.includes('editStage'));
console.log('Fixed new correct:', !fixedNew.includes('s.cls') && fixedNew.includes('openEditPartModal'));
