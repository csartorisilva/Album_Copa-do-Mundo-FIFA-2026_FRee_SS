$htmlPath = "C:\Users\M173150\.gemini\antigravity\brain\a2e10549-44d5-4758-93c5-6b4229672e06\.system_generated\steps\1154\content.md"
$content = Get-Content $htmlPath -Raw
$lines = $content -split "\r?\n"

$countriesRegex = @{
  "MEX" = "^m.xico$"
  "RSA" = "^.*frica do sul$"
  "KOR" = "^coreia do sul$"
  "CZE" = "^rep.blica tcheca$"
  "CAN" = "^canad.$"
  "BIH" = "^b.snia.*$"
  "QAT" = "^catar$"
  "SUI" = "^su.a$"
  "BRA" = "^brasil$"
  "MAR" = "^marrocos$"
  "HAI" = "^haiti$"
  "SCO" = "^esc.cia$"
  "USA" = "^(estados unidos|eua)$"
  "PAR" = "^paraguai$"
  "AUS" = "^austr.lia$"
  "TUR" = "^turquia$"
  "GER" = "^alemanha$"
  "CUW" = "^cura.ao$"
  "CIV" = "^costa do marfim$"
  "ECU" = "^equador$"
  "NED" = "^holanda$"
  "JPN" = "^jap.o$"
  "SWE" = "^su.cia$"
  "TUN" = "^tun.sia$"
  "BEL" = "^b.lgica$"
  "EGY" = "^egito$"
  "IRN" = "^ir.$"
  "NZL" = "^nova zel.ndia$"
  "ESP" = "^espanha$"
  "CPV" = "^cabo verde$"
  "KSA" = "^ar.bia saudita$"
  "URU" = "^uruguai$"
  "FRA" = "^fran.a$"
  "SEN" = "^senegal$"
  "IRQ" = "^iraque$"
  "NOR" = "^noruega$"
  "ARG" = "^argentina$"
  "ALG" = "^arg.lia$"
  "AUT" = "^.*ustria$"
  "JOR" = "^jord.nia$"
  "POR" = "^portugal$"
  "COD" = "^.*congo$"
  "UZB" = "^uzbequist.o$"
  "COL" = "^col.mbia$"
  "ENG" = "^inglaterra$"
  "CRO" = "^cro.cia$"
  "GHA" = "^gana$"
  "PAN" = "^panam.$"
}

$playersDb = @{}
$currentCountryCode = $null

foreach ($line in $lines) {
    $lineClean = $line.Trim()
    if ([string]::IsNullOrEmpty($lineClean)) { continue }
    
    $txt = $lineClean -replace '<[^>]+>', ''
    $txtClean = $txt.ToLower().Trim()
    if ([string]::IsNullOrEmpty($txtClean)) { continue }
    
    $foundCode = $null
    foreach ($code in $countriesRegex.Keys) {
        $pattern = $countriesRegex[$code]
        if ($txtClean -match $pattern) {
            $foundCode = $code
            break
        }
    }
    
    if ($foundCode) {
        $currentCountryCode = $foundCode
        $playersDb[$currentCountryCode] = New-Object System.Collections.Generic.List[string]
        continue
    }
    
    if ($currentCountryCode) {
        $playerName = $txt
        $playerName = $playerName -replace '&amp;', '&' -replace '&quot;', '"'
        
        if ($playerName.Length -lt 40 -and $playerName -notmatch 'grupo' -and $playerName -notmatch 'http') {
            $playerName = $playerName -replace 'Ã­', 'í' -replace 'Ã¡', 'á' -replace 'Ã³', 'ó' -replace 'Ã©', 'é' -replace 'Ãº', 'ú' -replace 'Ã±', 'ñ' -replace 'Ã£', 'ã'
            $playerName = $playerName -replace 'Ã', 'í' -replace 'Ä…', 'ą' -replace 'Å›', 'ś' -replace 'Å™', 'ř' -replace 'Ä›', 'ě' -replace 'Å¡', 'š' -replace 'ÄŒ', 'Č' -replace 'Å ', 'Š' -replace 'Ä‡', 'ć' -replace 'Å½', 'Ž' -replace 'Å“', 'œ'
            $playerName = $playerName -replace 'Ǹ', 'e' -replace 'Ǯ', 'e' -replace 'ǜ', 'a' -replace 'ǭ', 'a'
            $playerName = $playerName -replace 'í­', 'í' -replace 'í¡', 'á' -replace 'í³', 'ó' -replace 'í©', 'é' -replace 'íº', 'ú' -replace 'í±', 'ñ' -replace 'í£', 'ã' -replace 'íª', 'ê' -replace 'í§', 'ç'
            
            $playersDb[$currentCountryCode].Add($playerName)
        }
    }
}

$jsLines = @()
$jsLines += "const playersDatabase = {"
foreach ($code in ($playersDb.Keys | Sort-Object)) {
    $playersList = $playersDb[$code] | Select-Object -First 18
    $formattedList = $playersList | ForEach-Object { '"' + $_.Replace('"', '\"') + '"' }
    $listStr = [string]::Join(", ", $formattedList)
    $jsLines += "  '$code': [$listStr],"
}
$jsLines += "};"

[System.IO.File]::WriteAllText("c:\Users\M173150\OneDrive - MerckGroup\Particular\album-fifa-2026\players_db.js", [string]::Join("`r`n", $jsLines), [System.Text.Encoding]::UTF8)
Write-Output "Successfully parsed and saved to players_db.js. Count: $($playersDb.Count) countries."
