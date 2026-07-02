const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const content = fs.readFileSync(path, 'utf8');

// Find the card-edit-actions onclick context for rel.id
// Search for the pattern: onclick="editPart(...rel.id...)">?  or >✕
const idx = content.indexOf("editPart(\\'' + curCategory + '\\',\\'' + rel.id + '\\')");
if (idx >= 0) {
    console.log('editPart with rel.id at:', idx);
    console.log(JSON.stringify(content.substring(idx - 50, idx + 150)));
} else {
    console.log('NOT FOUND');
    // Try alternate patterns
    const all = [];
    let pos = 0;
    while ((pos = content.indexOf('rel.id', pos + 1)) >= 0) {
        const ctx = content.substring(pos - 20, pos + 100);
        if (ctx.includes('editPart')) {
            console.log('Found rel.id in editPart at:', pos, JSON.stringify(ctx));
            all.push(pos);
        }
    }
    console.log('Total found:', all.length);
}
