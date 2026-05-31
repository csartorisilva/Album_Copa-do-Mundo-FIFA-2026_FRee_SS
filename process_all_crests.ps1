Add-Type -AssemblyName System.Drawing

# Source and destination directories
$srcDir = 'c:\Users\M173150\OneDrive - MerckGroup\Particular\album-fifa-2026\Brasões'
$destDir = 'c:\Users\M173150\OneDrive - MerckGroup\Particular\album-fifa-2026\crests'

# Ensure destination exists
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

# Helper function to process a single image
function Process-Image($inputPath, $outputPath) {
    $bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
    $width = $bmp.Width
    $height = $bmp.Height
    $newBmp = New-Object System.Drawing.Bitmap($width, $height)
    for ($x = 0; $x -lt $width; $x++) {
        for ($y = 0; $y -lt $height; $y++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -gt 220 -and $c.G -gt 220 -and $c.B -gt 220) {
                $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, 0, 26, 78))
            }
        }
    }
    $bmp.Dispose()
    # Resize to 500x500 while maintaining aspect ratio (crop if needed)
    $targetSize = 500
    $scaled = $newBmp.GetThumbnailImage($targetSize, $targetSize, $null, [System.IntPtr]::Zero)
    $scaled.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newBmp.Dispose()
    $scaled.Dispose()
}

Get-ChildItem -Path $srcDir -File | ForEach-Object {
    $srcPath = $_.FullName
    $destPath = Join-Path $destDir ($_.BaseName + ".png")
    Write-Host "Processing $($_.Name) -> $destPath"
    Process-Image $srcPath $destPath
}

Write-Output "All crests processed and saved to $destDir"
