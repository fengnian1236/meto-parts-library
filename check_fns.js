const fs = require('fs');
const c = fs.readFileSync('C:\\Users\\daiji\\meto-parts-library\\index.html', 'utf8');

console.log('Checking functions:');
console.log('  submitEditPart:', c.includes('function submitEditPart()'));
console.log('  closeEditPartModal:', c.includes('function closeEditPartModal()'));
console.log('  _editPartCtx:', c.includes('_editPartCtx'));
console.log('  _editStageCtx:', c.includes('_editStageCtx'));
console.log('  edit-part-modal id:', c.includes('id="edit-part-modal"'));
console.log('  stage-card-edit display:flex:', c.includes('.stage-card-edit { position: absolute; top: 4px; right: 4px; display: flex;'));

// Check ESC handler
const escIdx = c.indexOf("if (e.key === 'Escape')");
console.log('\nESC handler at:', escIdx);
if (escIdx > 0) {
    console.log(c.substring(escIdx, escIdx + 150));
}
