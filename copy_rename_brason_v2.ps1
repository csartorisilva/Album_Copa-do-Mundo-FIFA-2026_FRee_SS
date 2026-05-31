param(
    [string]$sourcePath = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\..\Brasões",
    [string]$destPath   = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\crests"
)

# Ensure destination exists
if (-not (Test-Path $destPath)) { New-Item -ItemType Directory -Path $destPath | Out-Null }

# Mapping of searchable substrings (lowercase, without accents) to ISO filename (preserve original extension)
$lookup = @{
    "usa"        = "USA"    # USA
    "brasil"     = "BRA"    # Brazil
    "argentina"  = "ARG"    # Argentina
    "uruguai"    = "URU"    # Uruguay
    "argelia"    = "ALG"    # Algeria
    "arabia saudita" = "KSA" # Saudi Arabia
    "catar"      = "QAT"    # Qatar
    "marrocos"   = "MAR"    # Morocco
    "frança"     = "FRA"    # France (accent)
    "france"     = "FRA"
    "gana"       = "GHA"    # Ghana
    "haiti"      = "HAI"    # Haiti
    "holanda"    = "NED"    # Netherlands
    "ira"        = "IRN"    # Iran
    "iraque"     = "IRQ"    # Iraq
    "japão"      = "JPN"    # Japan
    "japao"      = "JPN"
    "jordan"     = "JOR"    # Jordan (will stay as external URL)
    "costa do marfim" = "CIV"
    "costa do marfim" = "CIV"
    "côte d'ivoire" = "CIV"
    "colômbia"   = "COL"
    "colombia"   = "COL"
    "croacia"    = "CRO"
    "curaçao"    = "CUW"
    "egito"      = "EGY"
    "escocia"    = "SCO"
    "espanha"    = "ESP"
    "euquador"   = "ECU"
    "suica"      = "SUI"
    "suecia"     = "SWE"
    "suecia"     = "SWE"
    "tunis"      = "TUN"
    "tunisia"    = "TUN"
    "turquia"    = "TUR"
    "turkey"     = "TUR"
    "australia"  = "AUS"
    "austria"    = "AUT"
    "bélgica"    = "BEL"
    "belgica"    = "BEL"
    "bósnia"     = "BIH"
    "bosnia"     = "BIH"
    "cabo verde" = "CPV"
    "canad"      = "CAN"
    "canada"     = "CAN"
    "cazaquistao"= "KAZ"
    "china"      = "CHN"
    "croacia"    = "CRO"
    "dinamarca"  = "DEN"
    "encurtado"  = "" # placeholder
    "colômbia"   = "COL"
    "mexico"     = "MEX"
    "noruega"    = "NOR"
    "nova zelandia" = "NZL"
    "panama"     = "PAN"
    "paraguai"   = "PAR"
    "portugal"   = "POR"
    "senegal"    = "SEN"
    "silvias"    = "" # placeholder
    "suíça"      = "SUI"
    "espanha"    = "ESP"
    "uruguai"    = "URU"
    "usbequistão"= "UZB"
    "usbequistao"= "UZB"
    "zâmbia"     = "ZMB"
}

Get-ChildItem -Path $sourcePath -File | ForEach-Object {
    $lower = $_.BaseName.ToLower()
    $matched = $null
    foreach ($key in $lookup.Keys) {
        if ($lower -like "*$key*") {
            $matched = $lookup[$key]
            break
        }
    }
    if ($matched) {
        $ext = $_.Extension
        $destFile = Join-Path $destPath ("$matched$ext")
        Copy-Item -Path $_.FullName -Destination $destFile -Force
        Write-Host "Copied '$($_.Name)' → '$matched$ext'"
    } else {
        Write-Warning "No ISO match for file: $($_.Name)"
    }
}
