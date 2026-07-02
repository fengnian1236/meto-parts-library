const fs = require('fs');
const path = 'C:\\Users\\daiji\\meto-parts-library\\index.html';
const content = fs.readFileSync(path, 'utf8');

// Check actual bytes around stage button
const idx1 = content.indexOf('editStage');
if (idx1 >= 0) {
    console.log('editStage at:', idx1);
    // Get bytes at that position
    const buf = Buffer.from(content);
    console.log('Bytes around editStage:');
    for (let i = idx1; i < idx1 + 100; i++) {
        process.stdout.write(buf[i].toString(16) + ' ');
    }
    console.log('\nText:');
    console.log(JSON.stringify(content.substring(idx1, idx1+200)));
}

// Check editPart at hookItem
const idx2 = content.indexOf("hookItem.id + '");
if (idx2 >= 0) {
    console.log('\nhookItem.id at:', idx2);
    const buf = Buffer.from(content);
    console.log('Bytes around hookItem.id:');
    for (let i = idx2; i < idx2 + 80; i++) {
        process.stdout.write(buf[i].toString(16) + ' ');
    }
    console.log('\nText:');
    console.log(JSON.stringify(content.substring(idx2 - 80, idx2 + 100)));
}

// Check rel.id edit button
const idx3 = content.indexOf("rel.id + '");
if (idx3 >= 0) {
    console.log('\nrel.id at:', idx3);
    console.log('Context:', JSON.stringify(content.substring(idx3 - 30, idx3 + 100)));
}
