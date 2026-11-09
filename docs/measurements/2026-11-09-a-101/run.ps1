# A-101: run measure.js at each width and save one JSON file per width.
# Usage: pwsh -File docs/measurements/2026-11-09-a-101/run.ps1 <url> <label>
param([string]$Url, [string]$Label)
$dir = $PSScriptRoot
$js = [IO.File]::ReadAllText((Join-Path $dir 'measure.js'))
playwright-cli open $Url *> $null
foreach ($size in @(@(1366, 900), @(1024, 768), @(961, 768), @(1920, 1080))) {
  playwright-cli resize $size[0] $size[1] *> $null
  $line = playwright-cli eval $js 2>&1 | Where-Object { "$_" -match '^"\{' } | Select-Object -First 1
  if (-not $line) { "NO RESULT at $($size[0])"; continue }
  $json = "$line" | ConvertFrom-Json
  [IO.File]::WriteAllText((Join-Path $dir "$Label-$($size[0]).json"), $json + "`n")
  $o = $json | ConvertFrom-Json
  "{0}: all old {1} single {2} table {3}/{4} sideways {5} | one old {6} single {7} widths {8} sideways {9} citeOver {10} citeDoc {11} | 1b lower lines {12}" -f $size[0], $o.all.oldBroken, $o.all.singleBroken, $o.all.tableWidth, $o.boxWidth, $o.all.sideways, $o.one.oldBroken, $o.one.singleBroken, $o.one.distinctColumnWidths, $o.one.rowsSideways, $o.one.citeOpenOverflowing, $o.one.citeOpenDocumentSideways, $o.one.row1b.lowerValueLines
}
playwright-cli close *> $null
