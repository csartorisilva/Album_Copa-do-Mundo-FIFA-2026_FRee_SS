$htmlPath = "C:\Users\M173150\.gemini\antigravity\brain\a2e10549-44d5-4758-93c5-6b4229672e06\.system_generated\steps\1154\content.md"
$content = Get-Content $htmlPath -Raw
$lines = $content -split "\r?\n"
Write-Output "Lines count: $($lines.Count)"
Write-Output "Line 1: $($lines[0])"
Write-Output "Line 2: $($lines[1])"
Write-Output "Line 30: $($lines[30])"
