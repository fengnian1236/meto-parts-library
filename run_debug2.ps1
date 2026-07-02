Set-Location "C:\Users\daiji\meto-parts-library"
$git = "D:\Qclaw\v0.2.30.594\resources\git\bin\git.exe"
& $git checkout -- index.html
Write-Output "Restored"
D:\Qclaw\v0.2.30.594\resources\node\node.exe -e "
const fs = require('fs');
const path = 'index.html';
const content = fs.readFileSync(path, 'utf8');

// Check hook item edit button
const i1 = content.indexOf('editPart');
const i2 = content.indexOf('hookItem.id');
console.log('editPart at:', i1);
console.log('hookItem.id at:', i2);
if (i1 >= 0) console.log(JSON.stringify(content.substring(i1-50, i1+150)));

// Check rel.id edit buttons
const r1 = content.lastIndexOf('editPart');
const r2 = content.lastIndexOf('rel.id');
console.log('last editPart:', r1);
console.log('last rel.id:', r2);
if (r1 >= 0) console.log(JSON.stringify(content.substring(r1-30, r1+100)));
if (r2 >= 0) console.log(JSON.stringify(content.substring(r2-30, r2+100)));
"
