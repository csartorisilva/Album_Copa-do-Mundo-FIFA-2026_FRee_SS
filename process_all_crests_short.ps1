Add-Type -AssemblyName System.Drawing

# Source using short 8.3 name to avoid Unicode issues
$srcDir = "c:\Users\M173150\OneDrive - MerckGroup\Particular\album-fifa-2026\BRASES~1"
$destDir = "c:\Users\M173150\OneDrive - MerckGroup\Particular\album-fifa-2026\crests"

if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

function Process-Image($inputPath, $outputPath) {
    $bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $bmp.Width; $h = $bmp.Height
    $newBmp = New-Object System.Drawing.Bitmap $w, $h
    for ($x=0; $x -lt $w; $x++) {
        for ($y=0; $y -lt $h; $y++) {
            $c = $bmp.GetPixel($x,$y)
            if ($c.R -gt 220 -and $c.G -gt 220 -and $c.B -gt 220) {
                $newBmp.SetPixel($x,$y,[System.Drawing.Color]::FromArgb(0,0,0,0))
            } else {
                $newBmp.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($c.A,0,26,78))
            }
        }
    }
    $bmp.Dispose()
    $target = 500
    $scaled = $newBmp.GetThumbnailImage($target,$target,$null,[System.IntPtr]::Zero)
    $scaled.Save($outputPath,[System.Drawing.Imaging.ImageFormat]::Png)
    $newBmp.Dispose(); $scaled.Dispose()
}

Get-ChildItem -LiteralPath $srcDir -File | ForEach-Object {
    $src = $_.FullName
    $dst = Join-Path $destDir ($_.BaseName + ".png")
    Write-Host "Processing $($_.Name) -> $dst"
    Process-Image $src $dst
}

Write-Output "All crests processed to $destDir"
