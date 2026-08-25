$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeDirectory = Join-Path $projectRoot '.tools\node-v24.19.0-win-x64'
$npmPath = Join-Path $nodeDirectory 'npm.cmd'

if (-not (Test-Path -LiteralPath $npmPath)) {
  throw 'Portable Node.js was not found. Check the .tools directory.'
}

Set-Location -LiteralPath $projectRoot
$env:Path = "$nodeDirectory;$env:Path"
& $npmPath run dev
