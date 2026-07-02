const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const content = fs.readFileSync(path, 'utf8');
console.log('Length:', content.length);

// Check CSS
const cssIdx = content.indexOf('.stage-card-edit { position: absolute');
if (cssIdx >= 0) {
    console.log('CSS at:', cssIdx);
    console.log('CSS text:', JSON.stringify(content.substring(cssIdx, cssIdx+250)));
} else {
    console.log('CSS NOT found');
}

console.log('---');

// Check stage button
const sbIdx = content.indexOf('event.stopPropagation();editStage');
if (sbIdx >= 0) {
    console.log('Stage btn at:', sbIdx);
    console.log('Stage btn:', JSON.stringify(content.substring(sbIdx, sbIdx+200)));
} else {
    console.log('Stage btn NOT found');
}

console.log('---');

// Check editPart - use Buffer to avoid encoding issues
const buf = Buffer.from(content);
const editPartStr = Buffer.from("editPart(\\\047 + curCategory");
console.log('Searching for editPart with escaped quote...');
for (let i = 0; i < buf.length - 30; i++) {
    let match = true;
    for (let j = 0; j < editPartStr.length; j++) {
        if (buf[i+j] !== editPartStr[j]) { match = false; break; }
    }
    if (match) {
        console.log('Found at byte:', i);
        console.log('Context:', content.substring(i, i+100));
        break;
    }
}

// Check ADD NEW HOOK
const hIdx = content.indexOf('ADD NEW HOOK');
console.log('ADD NEW HOOK at:', hIdx);
if (hIdx >= 0) console.log(JSON.stringify(content.substring(hIdx-50, hIdx+30)));

// Check what's at the beginning of <style> block for stage-card-edit
const scIdx = content.indexOf('/* Edit mode on cards */');
if (scIdx >= 0) {
    console.log('Edit mode CSS:', JSON.stringify(content.substring(scIdx-200, scIdx+200)));
}
