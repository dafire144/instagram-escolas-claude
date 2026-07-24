param(
    [Parameter(Mandatory = $true)]
    [string]$JobDirectory,

    [switch]$ContinueOnError
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Get-Location).Path
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot "tools\generate_posts.mjs"))) {
    $repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
}

$renderScript = Join-Path $PSScriptRoot "render.ps1"
$jobsPath = if ([System.IO.Path]::IsPathRooted($JobDirectory)) {
    $JobDirectory
} else {
    Join-Path $repoRoot $JobDirectory
}

if (-not (Test-Path -LiteralPath $jobsPath -PathType Container)) {
    throw "Pasta de jobs não encontrada: $jobsPath"
}

$jobs = @(Get-ChildItem -LiteralPath $jobsPath -Filter "*.json" -File | Sort-Object Name)
if ($jobs.Count -eq 0) {
    throw "Nenhum job JSON encontrado em: $jobsPath"
}

$passed = 0
$failed = New-Object System.Collections.Generic.List[string]

foreach ($job in $jobs) {
    Write-Host "Renderizando $($job.Name)..."
    try {
        & $renderScript -Job $job.FullName
        $passed += 1
    }
    catch {
        $failed.Add($job.Name)
        Write-Error "Falha em $($job.Name): $($_.Exception.Message)" -ErrorAction Continue
        if (-not $ContinueOnError) {
            throw
        }
    }
}

Write-Host ""
Write-Host "Lote concluído."
Write-Host "Aprovados estruturalmente: $passed"
Write-Host "Falhas: $($failed.Count)"

if ($failed.Count -gt 0) {
    Write-Host "Jobs com falha: $($failed -join ', ')"
    throw "O lote terminou com falhas estruturais."
}

Write-Host "PENDENTE: abrir todos os PNGs e concluir AUDITORIA-LOTE.md."
