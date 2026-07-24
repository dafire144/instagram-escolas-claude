param(
    [Parameter(Mandatory = $true)]
    [string]$Job
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Get-Location).Path
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot "tools\generate_posts.mjs"))) {
    $repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
}

$generator = Join-Path $repoRoot "tools\generate_posts.mjs"
$auditor = Join-Path $PSScriptRoot "audit-output.mjs"
$jobPath = if ([System.IO.Path]::IsPathRooted($Job)) { $Job } else { Join-Path $repoRoot $Job }

if (-not (Test-Path -LiteralPath $jobPath)) {
    throw "Job não encontrado: $jobPath"
}

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) {
    throw "Node.js não encontrado. Instale Node.js 18 ou superior."
}

Push-Location $repoRoot
try {
    & $node $generator --job $jobPath
    if ($LASTEXITCODE -ne 0) { throw "Falha na renderização." }

    & $node $auditor --job $jobPath
    if ($LASTEXITCODE -ne 0) { throw "Falha na validação estrutural." }
}
finally {
    Pop-Location
}
