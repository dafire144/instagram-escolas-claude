$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$source = Join-Path $repoRoot ".claude\skills\gerar-posts-escolas"
$userProfile = [Environment]::GetFolderPath("UserProfile")
$destinationRoot = Join-Path $userProfile ".claude\skills"
$destination = Join-Path $destinationRoot "gerar-posts-escolas"

if (-not (Test-Path -LiteralPath $source)) {
    throw "Skill não encontrada: $source"
}

New-Item -ItemType Directory -Path $destinationRoot -Force | Out-Null
New-Item -ItemType Directory -Path $destination -Force | Out-Null
Copy-Item -Path (Join-Path $source "*") -Destination $destination -Recurse -Force

Write-Host "Skill instalada em: $destination"
Write-Host "Abra o Claude na raiz do repositório para usar o motor e os inputs locais."
