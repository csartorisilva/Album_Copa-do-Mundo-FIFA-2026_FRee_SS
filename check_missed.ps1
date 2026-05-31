$jsPath = "c:\Users\M173150\OneDrive - MerckGroup\Particular\album-fifa-2026\players_db.js"
$jsContent = Get-Content $jsPath -Raw

$allCodes = @("MEX","RSA","KOR","CZE","CAN","BIH","QAT","SUI","BRA","MAR","HAI","SCO","USA","PAR","AUS","TUR","GER","CUW","CIV","ECU","NED","JPN","SWE","TUN","BEL","EGY","IRN","NZL","ESP","CPV","KSA","URU","FRA","SEN","IRQ","NOR","ARG","ALG","AUT","JOR","POR","COD","UZB","COL","ENG","CRO","GHA","PAN")

foreach ($code in $allCodes) {
    if ($jsContent -notmatch "'$code':") {
        Write-Output "Missed code: $code"
    }
}
