$htmlPath = "C:\Users\M173150\.gemini\antigravity\brain\a2e10549-44d5-4758-93c5-6b4229672e06\.system_generated\steps\1154\content.md"
$content = Get-Content $htmlPath -Raw

$index = $content.IndexOf("Camilo Vargas")
if ($index -ge 0) {
    $start = [Math]::Max(0, $index - 500)
    $len = [Math]::Min($content.Length - $start, 1000)
    Write-Output $content.Substring($start, $len)
} else {
    Write-Output "Camilo Vargas not found"
}
