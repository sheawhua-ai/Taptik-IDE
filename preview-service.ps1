[CmdletBinding()]
param(
  [ValidateSet('start', 'stop', 'status')]
  [string] $Action = 'status'
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodePath = Join-Path $projectRoot '.tools\node-v24.19.0-win-x64\node.exe'
$vitePath = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
$stateDirectory = Join-Path $projectRoot '.tools\preview'
$pidFile = Join-Path $stateDirectory 'vite.pid'
$previewUrl = 'http://127.0.0.1:5173/'

function Get-PortOwnerProcess {
  $connection = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1

  if ($connection) {
    return Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
  }

  $listenerLine = netstat -ano -p tcp |
    Select-String -Pattern '^\s*TCP\s+\S+:5173\s+\S+\s+LISTENING\s+(\d+)\s*$' |
    Select-Object -First 1

  if (-not $listenerLine) {
    return $null
  }

  $processId = [int]$listenerLine.Matches[0].Groups[1].Value
  return Get-Process -Id $processId -ErrorAction SilentlyContinue
}

function Get-ManagedProcess {
  if (-not (Test-Path -LiteralPath $pidFile)) {
    return $null
  }

  $processId = [int](Get-Content -Raw -LiteralPath $pidFile)
  $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

  if (-not $process) {
    return $null
  }

  if ($process.Path -ne $nodePath) {
    throw "PID $processId does not belong to this project's Node.js runtime."
  }

  return $process
}

function Test-Preview {
  try {
    $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

Set-Location -LiteralPath $projectRoot

switch ($Action) {
  'start' {
    $portOwner = Get-PortOwnerProcess
    if ($portOwner) {
      if ($portOwner.Path -eq $nodePath -and (Test-Preview)) {
        Write-Output "TAPTIK preview is already running (PID $($portOwner.Id)) at $previewUrl"
        exit 0
      }

      throw "Port 5173 is already owned by PID $($portOwner.Id) ($($portOwner.ProcessName))."
    }

    if (-not (Test-Path -LiteralPath $nodePath)) {
      throw 'Portable Node.js was not found in .tools.'
    }

    if (-not (Test-Path -LiteralPath $vitePath)) {
      throw 'Vite was not found. Run npm install before starting the preview.'
    }

    New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $stdoutLog = Join-Path $stateDirectory "vite-$timestamp.stdout.log"
    $stderrLog = Join-Path $stateDirectory "vite-$timestamp.stderr.log"

    $viteProcess = Start-Process `
      -FilePath $nodePath `
      -ArgumentList @($vitePath, '--host', '127.0.0.1', '--port', '5173', '--strictPort') `
      -WorkingDirectory $projectRoot `
      -WindowStyle Hidden `
      -RedirectStandardOutput $stdoutLog `
      -RedirectStandardError $stderrLog `
      -PassThru

    Set-Content -LiteralPath $pidFile -Value $viteProcess.Id

    for ($attempt = 0; $attempt -lt 40; $attempt++) {
      if (Test-Preview) {
        Write-Output "TAPTIK preview started in the background (PID $($viteProcess.Id)) at $previewUrl"
        Write-Output "Logs: $stdoutLog | $stderrLog"
        exit 0
      }

      if ($viteProcess.HasExited) {
        $errorText = if (Test-Path -LiteralPath $stderrLog) {
          Get-Content -Raw -LiteralPath $stderrLog
        } else {
          'No error log was produced.'
        }
        throw "Vite exited before becoming ready. $errorText"
      }

      Start-Sleep -Milliseconds 250
    }

    throw "Vite did not become ready within 10 seconds. Check $stderrLog"
  }

  'stop' {
    $managedProcess = Get-ManagedProcess
    if (-not $managedProcess) {
      Write-Output 'TAPTIK preview is not running as a managed background process.'
      exit 0
    }

    Stop-Process -Id $managedProcess.Id
    $managedProcess.WaitForExit(5000)
    Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
    Write-Output "TAPTIK preview stopped (PID $($managedProcess.Id))."
  }

  'status' {
    $portOwner = Get-PortOwnerProcess
    if ($portOwner -and (Test-Preview)) {
      Write-Output "TAPTIK preview is online (PID $($portOwner.Id)) at $previewUrl"
      exit 0
    }

    Write-Output 'TAPTIK preview is offline.'
    exit 1
  }
}
