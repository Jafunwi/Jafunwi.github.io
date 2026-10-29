param([string]$Src,[int]$Width)
Add-Type -AssemblyName System.Drawing
function Save-Resized($img,$w,$h,$path){
  $b = New-Object System.Drawing.Bitmap($w,$h)
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img,0,0,$w,$h)
  $g.Dispose()
  $b.Save($path,[System.Drawing.Imaging.ImageFormat]::Jpeg)
  $b.Dispose()
}
$full = (Resolve-Path $Src).Path
$img  = [System.Drawing.Image]::FromFile($full)
$dir  = Split-Path $full
$base = [IO.Path]::GetFileNameWithoutExtension($full)
$W = $Width
$H = [int][math]::Round($img.Height * $W / $img.Width)
$sizes = @(
  @($W, $H),
  @($W, [int]($H*.67)),
  @($W, [int]($H*.67*.67)),
  @([int]($W*.67), $H),
  @([int]($W*.67*.67), $H),
  @([int]($W/4), [int]($H/4))
)
foreach ($s in $sizes) { Save-Resized $img $s[0] $s[1] "$dir\$base-$($s[0])x$($s[1]).jpg" }
$img.Dispose()
Get-ChildItem $dir -Filter "$base-*x*.jpg" | Select-Object Name, Length
