const fs = require('fs');
const c = fs.readFileSync('C:\\Users\\daiji\\meto-parts-library\\index.html', 'utf8');

// Find all ESC handlers
let idx = 0;
let count = 0;
while ((idx = c.indexOf("e.key === 'Escape'", idx)) >= 0) {
    count++;
    console.log('\nESC handler #' + count + ' at position', idx);
    console.log(c.substring(idx - 50, idx + 200));
    idx += 20;
}

console.log('\nTotal ESC handlers:', count);
