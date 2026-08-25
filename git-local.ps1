[CmdletBinding()]
param(
  [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
  [string[]] $GitArgs
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$minGitRoot = Join-Path $projectRoot '.tools\mingit'
$portableGit = Join-Path $minGitRoot 'cmd\git.exe'

Set-Location -LiteralPath $projectRoot

if (Test-Path -LiteralPath $portableGit) {
  $env:Path = "$minGitRoot\mingw64\bin;$minGitRoot\cmd;$env:Path"
  $gitCommand = $portableGit
} else {
  $gitCommand = (Get-Command git -ErrorAction Stop).Source
}

if (-not $GitArgs -or $GitArgs.Count -eq 0) {
  $GitArgs = @('status', '--short', '--branch')
}

& $gitCommand @GitArgs
exit $LASTEXITCODE
