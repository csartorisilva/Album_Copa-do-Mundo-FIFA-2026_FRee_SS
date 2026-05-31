param(
    # Folder containing the crests (already in project root)
    [string]$crestsPath = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\\crests"
)

# Mapping of substrings to ISO codes (same as copy script)
$maps = @(
    @{patterns = @('usa'); iso = 'USA'},
    @{patterns = @('brasil','bra'); iso = 'BRA'},
    @{patterns = @('argentina'); iso = 'ARG'},
    @{patterns = @('uruguai','uruguay'); iso = 'URU'},
    @{patterns = @('argelia'); iso = 'ALG'},
    @{patterns = @('arabia saudita','saudi arabia','arabia'); iso = 'KSA'},
    @{patterns = @('catar','qatar'); iso = 'QAT'},
    @{patterns = @('marrocos','morocco'); iso = 'MAR'},
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
    @{patterns = @('ecuador','euqador'); iso = 'ECU'},
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
    @{patterns = @('mexico'); iso = 'MEX'}
)

Get-ChildItem -Path $crestsPath -File | ForEach-Object {
    $lower = $_.BaseName.ToLower()
    $matchedIso = $null
    foreach ($entry in $maps) {
        foreach ($pat in $entry.patterns) {
            if ($lower -like "*$pat*") { $matchedIso = $entry.iso; break }
        }
        if ($matchedIso) { break }
    }
    if ($matchedIso) {
        $newName = "$matchedIso$($_.Extension)"
        $newPath = Join-Path $crestsPath $newName
        if (-not (Test-Path $newPath)) {
            Rename-Item -Path $_.FullName -NewName $newName -Force
            Write-Host "Renamed $($_.Name) → $newName"
        } else {
            Write-Warning "Target $newName already exists, skipping $($_.Name)"
        }
    } else {
        Write-Warning "No ISO match for $($_.Name)"
    }
}
