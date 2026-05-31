param(
    # Destination folder inside the project (relative to this script)
    [string]$destPath = $(Join-Path $PSScriptRoot "crests")
)

# Source folder "Brasões" located next to this script
$sourcePath = Join-Path $PSScriptRoot "Brasões"

# Ensure destination folder exists
if (-not (Test-Path $destPath)) { New-Item -ItemType Directory -Path $destPath | Out-Null }

# Mapping of Portuguese keywords to ISO 3‑letter codes
$maps = @(
    @{patterns = @('brasil'); iso = 'BRA'},
    @{patterns = @('argentina'); iso = 'ARG'},
    @{patterns = @('uruguai'); iso = 'URU'},
    @{patterns = @('argelia'); iso = 'ALG'},
    @{patterns = @('arabia saudita'); iso = 'KSA'},
    @{patterns = @('catar'); iso = 'QAT'},
    @{patterns = @('marrocos'); iso = 'MAR'},
    @{patterns = @('frança','france'); iso = 'FRA'},
    @{patterns = @('gana'); iso = 'GHA'},
    @{patterns = @('haiti'); iso = 'HAI'},
    @{patterns = @('holanda','netherlands','nederland'); iso = 'NED'},
    @{patterns = @('ira','iran'); iso = 'IRN'},
    @{patterns = @('iraque','iraq'); iso = 'IRQ'},
    @{patterns = @('japão','japao','japan'); iso = 'JPN'},
    @{patterns = @('jordania','jordan'); iso = 'JOR'},
    @{patterns = @('costa do marfim','côte d''ivoire','ivory coast'); iso = 'CIV'},
    @{patterns = @('colômbia','colombia'); iso = 'COL'},
    @{patterns = @('croacia','croatia'); iso = 'CRO'},
    @{patterns = @('curaçao','curacao'); iso = 'CUW'},
    @{patterns = @('egito','egypt'); iso = 'EGY'},
    @{patterns = @('escocia','scotland'); iso = 'SCO'},
    @{patterns = @('espanha','spain'); iso = 'ESP'},
    @{patterns = @('equador','euqador'); iso = 'ECU'},
    @{patterns = @('suíça','suisse','switzerland'); iso = 'SUI'},
    @{patterns = @('suecia','sweden'); iso = 'SWE'},
    @{patterns = @('tunisia'); iso = 'TUN'},
    @{patterns = @('turquia','turkey'); iso = 'TUR'},
    @{patterns = @('australia'); iso = 'AUS'},
    @{patterns = @('austria'); iso = 'AUT'},
    @{patterns = @('bélgica','belgica','belgium'); iso = 'BEL'},
    @{patterns = @('bósnia','bosnia'); iso = 'BIH'},
    @{patterns = @('cabo verde','cape verde'); iso = 'CPV'},
    @{patterns = @('canada'); iso = 'CAN'},
    @{patterns = @('cazaquistao','kazakhstan'); iso = 'KAZ'},
    @{patterns = @('china'); iso = 'CHN'},
    @{patterns = @('dinamarca','denmark'); iso = 'DEN'},
    @{patterns = @('noruega','norway'); iso = 'NOR'},
    @{patterns = @('nova zelandia','new zealand'); iso = 'NZL'},
    @{patterns = @('panama'); iso = 'PAN'},
    @{patterns = @('paraguai','paraguay'); iso = 'PAR'},
    @{patterns = @('portugal'); iso = 'POR'},
    @{patterns = @('senegal'); iso = 'SEN'},
    @{patterns = @('usbequistão','uzbekistan'); iso = 'UZB'},
    @{patterns = @('mexico'); iso = 'MEX'},
    @{patterns = @('estados unidos','usa','eua'); iso = 'USA'}
)

Get-ChildItem -LiteralPath $sourcePath -File | ForEach-Object {
    $lower = $_.BaseName.ToLower()
    $matchedIso = $null
    foreach ($entry in $maps) {
        foreach ($pat in $entry.patterns) {
            if ($lower -like "*$pat*") { $matchedIso = $entry.iso; break }
        }
        if ($matchedIso) { break }
    }
    if ($matchedIso) {
        $destFile = Join-Path $destPath ("$matchedIso$($_.Extension)")
        Copy-Item -Path $_.FullName -Destination $destFile -Force
        Write-Host "Copied $($_.Name) → $matchedIso$($_.Extension)"
    } else {
        Write-Warning "No ISO match for file: $($_.Name)"
    }
}
