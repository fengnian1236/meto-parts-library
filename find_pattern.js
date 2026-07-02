const fs = require('fs');
const { execSync } = require('child_process');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
const content = fs.readFileSync('C:\\Users\\daiji\\meto-parts-library\\index.html', 'utf8');

// Find stage button and print EXACT bytes
const si = content.indexOf('event.stopPropagation();editStage');
if (si >= 0) {
    const end = content.indexOf('">✎</button>', si);
    const btn = content.substring(si, end + 11);
    const buf = Buffer.from(btn);
    console.log('Stage btn len:', btn.length);
    console.log('First 10 chars:', JSON.stringify(btn.substring(0, 10)));
    // Print bytes as JS hex literals
    let hexJS = 'Buffer.from([';
    for (let i = 0; i < Math.min(btn.length, 80); i++) {
        hexJS += buf[i].toString() + ',';
    }
    hexJS += '])';
    console.log('Hex array:', hexJS);
    
    // Try building search string from hex
    // We know the file has: event.stopPropagation();editStage(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')
    // Build each part from bytes
    const p1 = Buffer.from('event.stopPropagation();').toString('utf8');
    const p2 = Buffer.from([0x5c, 0x27, 0x27]).toString('utf8'); // \'\' 
    const p3 = ' + curCategory + ';
    const p4 = Buffer.from([0x5c, 0x27, 0x27]).toString('utf8'); // \'\'
    const p5 = ',';
    const p6 = Buffer.from([0x5c, 0x27, 0x27]).toString('utf8'); // \'\' 
    const p7 = ' + (curHookId||\'\') + ';
    const p8 = Buffer.from([0x5c, 0x27, 0x27]).toString('utf8'); // \'\' 
    const p9 = ',';
    const p10 = Buffer.from([0x5c, 0x27, 0x27]).toString('utf8'); // \'\' 
    const p11 = ' + s.cls + ';
    const p12 = Buffer.from([0x5c, 0x27, 0x27]).toString('utf8'); // \'\' 
    const p13 = ')';
    
    const fullPattern = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11 + p12 + p13;
    console.log('\nBuilt pattern len:', fullPattern.length);
    console.log('Built pattern JSON:', JSON.stringify(fullPattern.substring(0, 100)));
    console.log('Matches file:', content.includes(fullPattern));
    
    // Now check the actual bytes
    const idx = content.indexOf(fullPattern);
    console.log('Pattern at:', idx);
    if (idx >= 0) {
        const actualBytes = Buffer.from(content.substring(idx, idx + fullPattern.length));
        console.log('Actual first 10 bytes:', Array.from(actualBytes.slice(0,10)).map(b => b.toString(16)).join(' '));
    }
}
