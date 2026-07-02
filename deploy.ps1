# deploy.ps1 - 自动提交并推送到 GitHub
# 用法：在 meto-parts-library 文件夹下运行
#   .\deploy.ps1 -Message "修复xxx"
# 或不带参数（默认 commit message "update"）
param(
    [string]$Message = "update"
)

$git = "D:\Qclaw\v0.2.30.594\resources\git\bin\git.exe"
Set-Location $PSScriptRoot

# 检查是否有改动
$status = & $git status --porcelain
if (-not $status) {
    Write-Host "✓ 没有改动，无需提交" -ForegroundColor Yellow
    exit 0
}

# 提交并推送
& $git add .
& $git commit -m $Message 2>&1 | Out-Null
$pushResult = & $git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 部署成功：$Message" -ForegroundColor Green
    Write-Host "→ Cloudflare Pages 将在几秒内自动重新部署" -ForegroundColor Cyan
} else {
    Write-Host "✗ 推送失败" -ForegroundColor Red
    Write-Host $pushResult
}
