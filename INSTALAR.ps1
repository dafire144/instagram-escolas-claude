param(
    [string]$Destino = (Join-Path ([Environment]::GetFolderPath("MyDocuments")) "instagram-escolas")
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$versao = "1.3.0"
$downloadUrl = "https://raw.githubusercontent.com/dafire144/instagram-escolas-claude/main/dist/instagram-escolas-claude-v1.3.0.zip"
$sha256Esperado = "AF00A037BB42F4C1AF10AA31152967AD786515359C0039CC739DA5B539826DB5"
$tempZip = Join-Path ([System.IO.Path]::GetTempPath()) "instagram-escolas-claude-$versao-$PID.zip"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js não encontrado. Instale Node.js 18 ou superior e execute novamente."
}

$chromeCandidates = @(@(
    $env:CHROME_PATH,
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) })

if ($chromeCandidates.Count -eq 0) {
    throw "Google Chrome não encontrado. Instale o Chrome ou defina CHROME_PATH."
}

$destinoCompleto = [System.IO.Path]::GetFullPath($Destino)
if (Test-Path -LiteralPath $destinoCompleto) {
    $conteudoExistente = @(Get-ChildItem -LiteralPath $destinoCompleto -Force)
    if ($conteudoExistente.Count -gt 0) {
        throw "O destino já existe e não está vazio: $destinoCompleto. Nada foi sobrescrito."
    }
} else {
    New-Item -ItemType Directory -Path $destinoCompleto -Force | Out-Null
}

try {
    Write-Host "Baixando Instagram das Escolas v$versao..."
    Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing

    $sha256Recebido = (Get-FileHash -LiteralPath $tempZip -Algorithm SHA256).Hash
    if ($sha256Recebido -ne $sha256Esperado) {
        throw "O ZIP baixado não passou na verificação de integridade."
    }

    Expand-Archive -LiteralPath $tempZip -DestinationPath $destinoCompleto

    $setup = Join-Path $destinoCompleto "scripts\setup.ps1"
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $setup
    if ($LASTEXITCODE -ne 0) {
        throw "Os arquivos foram extraídos, mas a configuração automática falhou."
    }
}
finally {
    if (Test-Path -LiteralPath $tempZip) {
        Remove-Item -LiteralPath $tempZip -Force
    }
}

Write-Host ""
Write-Host "Instalação concluída em: $destinoCompleto"
Write-Host "Coloque somente fotos autorizadas em:"
Write-Host "  $destinoCompleto\inputs\aviaozinho\fotos"
Write-Host "  $destinoCompleto\inputs\colibri\fotos"
Write-Host ""
Write-Host "Depois, abra o Claude Code nessa pasta e peça a quantidade de posts desejada."
