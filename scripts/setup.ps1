$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$directories = @(
    "inputs\aviaozinho\fotos",
    "inputs\colibri\fotos",
    "jobs",
    "outputs"
)

foreach ($relative in $directories) {
    $target = Join-Path $repoRoot $relative
    New-Item -ItemType Directory -Path $target -Force | Out-Null
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    throw "Node.js não encontrado. Instale a versão 18 ou superior."
}

$chromeCandidates = @(@(
    $env:CHROME_PATH,
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) })

if ($chromeCandidates.Count -eq 0) {
    throw "Google Chrome não encontrado. Instale o Chrome ou defina CHROME_PATH."
}

Write-Host "Configuração concluída."
Write-Host "Node: $($node.Source)"
Write-Host "Chrome: $($chromeCandidates[0])"
Write-Host "Coloque somente fotos autorizadas nas pastas de inputs."
