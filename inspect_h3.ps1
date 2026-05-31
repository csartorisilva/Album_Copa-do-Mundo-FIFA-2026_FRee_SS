$htmlPath = "C:\Users\M173150\.gemini\antigravity\brain\a2e10549-44d5-4758-93c5-6b4229672e06\.system_generated\steps\1154\content.md"
$content = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)

# Find all <h3> contents
$matchesH3 = [regex]::Matches($content, '<h3[^>]*>([^<]+)</h3>')
$names = @()
foreach ($m in $matchesH3) {
    $names += $m.Groups[1].Value.Trim()
}
Write-Output "Total h3 tags: $($names.Count)"
Write-Output "Names: $([string]::Join(', ', $names))"
