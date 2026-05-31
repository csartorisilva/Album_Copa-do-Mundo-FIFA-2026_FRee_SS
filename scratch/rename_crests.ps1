$path = 'C:\Users\M173150\OneDrive - MerckGroup\Particular\album-fifa-2026\crests'

$map = @{
    'brasão da seleção usa.png' = 'USA.png'
    'brasão da seleção brasil.png' = 'BRA.png'
    'brasão da seleção argentina.png' = 'ARG.png'
    'brasão da seleção canadá.png' = 'CAN.png'
    'brasão da seleção mexic.png' = 'MEX.png'
    'brasão da seleção paraguai.png' = 'PAR.png'
    'brasão da seleção colômbia.png' = 'COL.png'
    'brasão da seleção uruguai.png' = 'URU.png'
    'brasão da seleção coreia do sul.png' = 'KOR.png'
    'brasão da seleção croácia.png' = 'CRO.png'
    'brasão da seleção dinamarca.png' = 'DEN.png'
    'brasão da seleção equador.png' = 'ECU.png'
    'brasão da seleção egito.png' = 'EGY.png'
    'brasão da seleção englaterra.png' = 'ENG.png'
    'brasão da seleção eslovênia.png' = 'SVN.png'
    'brasão da seleção finlândia.png' = 'FIN.png'
    'brasão da seleção fra.png' = 'FRA.png'
    'brasão da seleção gÃªn... etc'
}
foreach ($kvp in $map.GetEnumerator()) {
    $src = Join-Path $path $kvp.Key
    $dst = Join-Path $path $kvp.Value
    if (Test-Path $src) {
        Rename-Item -Path $src -NewName $kvp.Value -Force
    }
}
