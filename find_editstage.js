const fs = require('fs');
const c = fs.readFileSync('C:\\Users\\daiji\\meto-parts-library\\index.html', 'utf8');
const i = c.indexOf('/* ===== EDIT STAGE');
console.log('Found at:', i);
if (i >= 0) {
    // Get 2000 chars from start
    console.log('\nFull content (2000 chars):');
    console.log(c.substring(i, i + 2000));
}
