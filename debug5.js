const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const content = fs.readFileSync(path, 'utf8');
const buf = Buffer.from(content);

// Check exact bytes around the stage card edit button (at byte ~59869)
// editStage is at 59869, let me check bytes 59850-59900
console.log('Bytes around stage button (59850-59920):');
const chunk1 = buf.slice(59850, 59920);
console.log(Array.from(chunk1).map(b => b.toString(16).padStart(2,'0')).join(' '));
console.log('As text:', JSON.stringify(content.substring(59850, 59920)));

// Check exact bytes around hookItem.id edit button
// hookItem.id is at 60960, check bytes around it
console.log('\nBytes around hookItem edit button:');
const chunk2 = buf.slice(60900, 61000);
console.log(Array.from(chunk2).map(b => b.toString(16).padStart(2,'0')).join(' '));
console.log('As text:', JSON.stringify(content.substring(60900, 61000)));

// Now build correct search strings
// The file has literal \' sequences. Let's extract them
const editStagePos = content.indexOf('editStage');
const hookItemPos = content.indexOf('hookItem.id');
const relIdPos = content.indexOf('rel.id');

console.log('\n--- Exact strings in file ---');
console.log('editStage context:', JSON.stringify(content.substring(editStagePos, editStagePos+180)));
console.log('hookItem.id context:', JSON.stringify(content.substring(hookItemPos-100, hookItemPos+80)));
console.log('rel.id context:', JSON.stringify(content.substring(relIdPos-30, relIdPos+100)));

// What I need to search for (the actual file content)
const search1 = "editStage(\\'' + curCategory + '\\',\\'' + (curHookId||'') + '\\',\\'' + s.cls + '\\')";
const search2 = "editPart(\\'' + curCategory + '\\',\\'' + hookItem.id + '\\')";
const search3 = "editPart(\\'' + curCategory + '\\',\\'' + rel.id + '\\')";

console.log('\n--- Search strings ---');
console.log('Search1 (stage):', JSON.stringify(search1));
console.log('Search1 in file:', content.includes(search1));
console.log('Search2 (hookItem):', JSON.stringify(search2));
console.log('Search2 in file:', content.includes(search2));
console.log('Search3 (rel.id):', JSON.stringify(search3));
console.log('Search3 in file:', content.includes(search3));
