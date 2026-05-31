param(
    [string]$sourcePath = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\..\Brasões",
    [string]$destPath   = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\crests"
)

# Mapping of original filename (exact) to target ISO filename (preserve extension)
$map = @{
    "Brasão CZE.png"                         = "CZE.png"
    "Brasão KOR.png"                         = "KOR.png"
    "Brasão MEX.png"                         = "MEX.png"
    "Brasão RSA.png"                         = "RSA.png"
    "Brasão seleção iraque.png"              = "IRQ.png"
    "brasão da seleção Catar.png"             = "QAT.png"
    "brasão da seleção USA.png"               = "USA.png"
    "brasão da seleção arabia saudita.png"    = "KSA.png"
    "brasão da seleção argelia.png"           = "ALG.png"
    "brasão da seleção argentina.png"        = "ARG.png"
    "brasão da seleção australia.png"         = "AUS.png"
    "brasão da seleção austria.png"          = "AUT.png"
    "brasão da seleção belgica.jpg"           = "BEL.jpg"
    "brasão da seleção bosnia.jpg"            = "BIH.jpg"
    "brasão da seleção brasil.png"            = "BRA.png"
    "brasão da seleção cabo verde.png"        = "CPV.png"
    "brasão da seleção canada.png"            = "CAN.png"
    "brasão da seleção colombia.webp"         = "COL.webp"
    "brasão da seleção congo.jpg"             = "COD.jpg"
    "brasão da seleção costa do marfim.png"   = "CIV.png"
    "brasão da seleção croacia.png"           = "CRO.png"
    "brasão da seleção curaçao.png"           = "CUW.png"
    "brasão da seleção egito.png"             = "EGY.png"
    "brasão da seleção escocia.png"           = "SCO.png"
    "brasão da seleção espanha.png"           = "ESP.png"
    "brasão da seleção euqador.png"          = "ECU.png"
    "brasão da seleção frança.png"            = "FRA.png"
    "brasão da seleção gana.png"              = "GHA.png"
    "brasão da seleção haiti.png"             = "HAI.png"
    "brasão da seleção holanda.png"           = "NED.png"
    "brasão da seleção ira.png"               = "IRN.png"
    "brasão da seleção japão.png"             = "JPN.png"
    "brasão da seleção jordania.png"          = "JOR.png"
    "brasão da seleção marrocos.png"          = "MAR.png"
    "brasão da seleção noruegua.png"          = "NOR.png"
    "brasão da seleção nova zelandia.png"     = "NZL.png"
    "brasão da seleção panama.png"            = "PAN.png"
    "brasão da seleção paraguai.png"          = "PAR.png"
    "brasão da seleção portugual.png"         = "POR.png"
    "brasão da seleção senegal.png"           = "SEN.png"
    "brasão da seleção suecia.png"            = "SWE.png"
    "brasão da seleção suiça.png"             = "SUI.png"
    "brasão da seleção tunisia.png"           = "TUN.png"
    "brasão da seleção turquia.png"           = "TUR.png"
    "brasão da seleção uruguai.webp"          = "URU.webp"
    "brasão da seleção usbequistao.jpg"       = "UZB.jpg"
}

foreach ($orig in $map.Keys) {
    $src = Join-Path $sourcePath $orig
    $dst = Join-Path $destPath $map[$orig]
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "Copied '$orig' → '$($map[$orig])'"
    } else {
        Write-Warning "Source file not found: $orig"
    }
}
