Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class Img {
  public static Bitmap Grey(Bitmap src) {
    Bitmap b = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb);
    ColorMatrix cm = new ColorMatrix(new float[][] {
      new float[] {.299f,.299f,.299f,0,0},
      new float[] {.587f,.587f,.587f,0,0},
      new float[] {.114f,.114f,.114f,0,0},
      new float[] {0,0,0,1,0},
      new float[] {0,0,0,0,1}});
    ImageAttributes ia = new ImageAttributes();
    ia.SetColorMatrix(cm);
    using (Graphics g = Graphics.FromImage(b))
      g.DrawImage(src, new Rectangle(0,0,b.Width,b.Height), 0,0,src.Width,src.Height, GraphicsUnit.Pixel, ia);
    return b;
  }
  public static Bitmap BW(Bitmap grey) {
    Bitmap b = new Bitmap(grey.Width, grey.Height, PixelFormat.Format32bppArgb);
    Rectangle r = new Rectangle(0,0,b.Width,b.Height);
    BitmapData d = grey.LockBits(r, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    BitmapData o = b.LockBits(r, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
    int n = Math.Abs(d.Stride) * b.Height;
    byte[] buf = new byte[n];
    Marshal.Copy(d.Scan0, buf, 0, n);
    for (int i = 0; i < n; i += 4) {
      byte v = buf[i+1] > 127 ? (byte)255 : (byte)0;
      buf[i] = v; buf[i+1] = v; buf[i+2] = v; buf[i+3] = 255;
    }
    Marshal.Copy(buf, 0, o.Scan0, n);
    grey.UnlockBits(d);
    b.UnlockBits(o);
    return b;
  }
}
"@

$dir  = (Resolve-Path images).Path
$base = "chicago-skyline-15629500@pawel-aparatem-go_pexels"
$src  = New-Object System.Drawing.Bitmap("$dir\$base.jpg")

$src.Save("$dir\$base.gif", [System.Drawing.Imaging.ImageFormat]::Gif)
$g = [Img]::Grey($src)
$g.Save("$dir\$base-greyscale.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bw = [Img]::BW($g)
$bw.Save("$dir\$base-bw.png", [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose(); $g.Dispose(); $bw.Dispose()
Get-ChildItem images -File | Select-Object Name, Length
