const fs = require('fs');
const { execSync } = require('child_process');
const git = 'D:\\Qclaw\\v0.2.30.594\\resources\\git\\bin\\git.exe';
execSync(git + ' checkout -- index.html', { cwd: 'C:\\Users\\daiji\\meto-parts-library', stdio: 'pipe' });
const content = fs.readFileSync('C:\\Users\\daiji\\meto-parts-library\\index.html', 'utf8');

// Find the stage button in the file
const si = content.indexOf('event.stopPropagation();editStage');
if (si >= 0) {
    const end = content.indexOf('">✎</button>', si);
    const btn = content.substring(si, end + 11);
    
    // Build the pattern from hex bytes
    // From hex: 5c 27 27 = \'\' (backslash, quote, quote)
    const sq2 = Buffer.from([0x5c, 0x27, 0x27]).toString('utf8'); // \'\' 
    const sq1 = Buffer.from([0x5c, 0x27]).toString('utf8');  // \'
    const space = ' ';
    const plus = ' + ';
    const curCat = 'curCategory';
    
    // Build the expected pattern
    const expected1 = "event.stopPropagation();editStage(" + sq2 + space + '+' + space + curCat + space + '+' + space + sq2;
    console.log('Expected1:', JSON.stringify(expected1));
    console.log('Actual1:', JSON.stringify(btn.substring(0, expected1.length)));
    console.log('Match1:', btn.substring(0, expected1.length) === expected1);
    
    // Also check the second part
    const pipe = '(curHookId||' + sq1 + sq1 + ')';
    const expected2 = sq1 + space + '+' + space + pipe + space + '+' + space + sq2;
    const actual2 = btn.substring(expected1.length, expected1.length + expected2.length);
    console.log('Expected2:', JSON.stringify(expected2));
    console.log('Actual2:', JSON.stringify(actual2));
    console.log('Match2:', actual2 === expected2);
    
    // Full func call pattern
    const fullFuncCall = "event.stopPropagation();editStage(" + sq2 + " + curCategory + " + sq2 + "," + sq2 + " + (curHookId||" + sq1 + sq1 + ") + " + sq2 + "," + sq2 + " + s.cls + " + sq2 + ")";
    console.log('\nFull func call expected:', JSON.stringify(fullFuncCall));
    console.log('Actual btn:', JSON.stringify(btn));
    console.log('Starts with:', btn.startsWith(fullFuncCall.substring(0, 50)));
    
    // Now try to do the replacement
    const newFuncCall = "event.stopPropagation();openEditPartModal(" + sq2 + " + curCategory + " + sq2 + "," + sq2 + " + (curHookId||" + sq1 + sq1 + ") + " + sq2 + ")";
    console.log('\nNew func call:', JSON.stringify(newFuncCall));
    
    // Replace just the function call part (the first part)
    const oldPart = "event.stopPropagation();editStage(" + sq2 + " + curCategory + " + sq2 + "," + sq2 + " + (curHookId||" + sq1 + sq1 + ") + " + sq2 + "," + sq2 + " + s.cls + " + sq2;
    const newPart = "event.stopPropagation();openEditPartModal(" + sq2 + " + curCategory + " + sq2 + "," + sq2 + " + (curHookId||" + sq1 + sq1 + ") + " + sq2;
    
    if (btn.includes(oldPart)) {
        const newBtn = btn.split(oldPart).join(newPart).split('title="编辑此项"').join('title="编辑此钩子"');
        console.log('\nNew btn:', JSON.stringify(newBtn));
        console.log('Changed:', newBtn !== btn);
    } else {
        console.log('\nPattern not found in btn!');
        // Debug: show what oldPart looks like
        console.log('Old part:', JSON.stringify(oldPart));
        // Check byte by byte
        for (let i = 0; i < 50; i++) {
            const a = btn[i];
            const e = oldPart[i];
            const match = (a === e) ? 'OK' : 'DIFF';
            console.log('  [' + i + '] actual=' + (a ? a.charCodeAt(0).toString(16) : 'null') + ' expected=' + (e ? e.charCodeAt(0).toString(16) : 'null') + ' ' + match);
        }
    }
}
