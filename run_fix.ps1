Set-Location "C:\Users\daiji\meto-parts-library"
$git = "D:\Qclaw\v0.2.30.594\resources\git\bin\git.exe"
& $git checkout -- index.html
Write-Output "Restored from git"
D:\Qclaw\v0.2.30.594\resources\node\node.exe fix_edit_modal.js
