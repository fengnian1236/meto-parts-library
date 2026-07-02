const fs = require('fs');
const { execSync } = require('child_process');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const { execSync: exec } = require('child_process');

// Restore
exec(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
const content = fs.readFileSync(path, 'utf8');

// Find stage button
const si = content.indexOf('event.stopPropagation();editStage');
const btnEnd = content.indexOf('">✎</button>', si);
const btn = content.substring(si, btnEnd + 11);

console.log('Button length:', btn.length);
console.log('Button (JSON):', JSON.stringify(btn));

// Find s.cls position in btn
const clsIdx = btn.indexOf('s.cls');
console.log('\ns.cls at:', clsIdx, 'char:', JSON.stringify(btn[clsIdx]), 'byte:', btn.charCodeAt(clsIdx).toString(16));

// Walk characters around s.cls
console.log('\nAround s.cls:');
for (let i = clsIdx - 3; i <= clsIdx + 8; i++) {
    const c = btn[i];
    if (c) console.log('  [' + i + '] =', JSON.stringify(c), 'byte:', c.charCodeAt(0).toString(16));
}

// Find the last comma before s.cls
let commaIdx = clsIdx - 1;
while (commaIdx >= 0 && btn[commaIdx] !== ',') commaIdx--;
console.log('\nComma before s.cls at:', commaIdx, 'char:', JSON.stringify(btn[commaIdx]));

// Find the closing quote of s.cls param
// s.cls param ends with: '\' + '\''
// First find the ' after s.cls
const afterS = clsIdx + 5; // position of the ' after s
console.log('\nChar at afterS (', afterS, '):', JSON.stringify(btn[afterS]));
// Then find the closing ' of the s.cls param (skip the first ')
let closeQuote = afterS + 1;
while (closeQuote < btn.length && btn[closeQuote] !== "'") closeQuote++;
console.log('Close quote of s.cls param at:', closeQuote, 'char:', JSON.stringify(btn[closeQuote]));

// Build new button
const beforeCls = btn.substring(0, commaIdx);
const afterClsPart = btn.substring(closeQuote + 1);
console.log('\nbeforeCls:', JSON.stringify(beforeCls));
console.log('afterClsPart:', JSON.stringify(afterClsPart));
const newStageRaw = beforeCls + afterClsPart;
const newStage = newStageRaw
    .replace('editStage(', 'openEditPartModal(')
    .replace('title="编辑此项"', 'title="编辑此钩子"');
console.log('\nNew button (JSON):', JSON.stringify(newStage));

// Check if s.cls is gone
console.log('\nNew has s.cls:', newStage.includes('s.cls'));
console.log('New starts with openEditPartModal:', newStage.startsWith('event.stopPropagation();openEditPartModal'));
