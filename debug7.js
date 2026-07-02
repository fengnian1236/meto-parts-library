const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const content = fs.readFileSync(path, 'utf8');

console.log('File length:', content.length);

// Try all possible patterns
const patterns = [
    // With single backslash
    "onclick=\"event.stopPropagation();editStage(\\'' + curCategory + '\\',\\'' + (curHookId||'') + '\\',\\'' + s.cls + '\\')\" title=\"编辑此项\">✎</button>",
    // With double backslash (what appears in JSON.stringify)
    "onclick=\"event.stopPropagation();editStage(\\\\\\'\\' + curCategory + \\\\\\'\\',\\\\\\'\\' + (curHookId||'') + \\\\\\'\\',\\\\\\'\\' + s.cls + \\\\\\'\\')\" title=\"编辑此项\">✎</button>",
    // Find the actual position first
];

// Just find editStage and extract 200 chars
const idx = content.indexOf('editStage');
console.log('editStage at:', idx);
const ctx = content.substring(idx, idx+200);
console.log('Context (raw):', JSON.stringify(ctx));
console.log('Context length:', ctx.length);

// Now build the exact string we need
// The actual onclick attribute is: onclick="event.stopPropagation();editStage(\'' + curCategory + '\',\'' + (curHookId||'') + '\',\'' + s.cls + '\')" title="编辑此项">✎</button>
// Let me extract it
const onIdx = content.indexOf('onclick="event.stopPropagation();editStage');
console.log('onclick editStage at:', onIdx);
if (onIdx >= 0) {
    const endQuote = content.indexOf('">✎</button>', onIdx);
    const exactBtn = content.substring(onIdx, endQuote + 11);
    console.log('Exact button string:', JSON.stringify(exactBtn));
    console.log('Can find it:', content.includes(exactBtn));
}

// Also check hookItem edit button
const hookIdx = content.indexOf('onclick="editPart(\\'' + curCategory + '\\',\\'' + hookItem.id + '\\')">✎ 编辑</button>');
console.log('\nHook item button at:', hookIdx);
if (hookIdx >= 0) {
    console.log('Found! Context:', JSON.stringify(content.substring(hookIdx, hookIdx+120)));
} else {
    const h2 = content.indexOf('onclick="editPart');
    console.log('onclick editPart at:', h2);
    if (h2 >= 0) {
        console.log(JSON.stringify(content.substring(h2, h2+150)));
    }
}
