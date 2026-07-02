Set-Location "C:\Users\daiji\meto-parts-library"
$git = "D:\Qclaw\v0.2.30.594\resources\git\bin\git.exe"
& $git checkout -- index.html
Write-Output "Restored"
D:\Qclaw\v0.2.30.594\resources\node\node.exe find_pattern.js
