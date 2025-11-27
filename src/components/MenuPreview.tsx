import { useState, useEffect } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ExternalLink } from 'lucide-react';
import MenuList from "../components/MenuList";


export default function AdminMenuPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Kelola Menu</h1>

      <MenuList />
    </div>
  );
}

export function MenuPreview() {
  const { settings } = useMenu();
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}${window.location.pathname}?view=public`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'menu-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Preview & Publish</h2>
        <p className="text-sm text-gray-600 mb-6">
          Share your digital menu with customers
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">QR Code</h3>
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
                <QRCodeSVG
                  id="qr-code"
                  value={publicUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="mt-4 space-y-2">
                <Button onClick={handleDownloadQR} className="w-full gap-2">
                  <Download className="size-4" />
                  Download QR Code
                </Button>
                <p className="text-xs text-gray-500">
                  Print dan tempel di meja atau kasir agar pelanggan bisa scan
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Public URL</h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 break-all text-sm">
                {publicUrl}
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  onClick={handleCopyUrl}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy URL
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => window.open(publicUrl, '_blank')}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <ExternalLink className="size-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📱 Testing Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Scan QR code dengan smartphone Anda</li>
                <li>• Share URL via WhatsApp atau social media</li>
                <li>• Data tersimpan di browser ini (localStorage)</li>
                <li>• Untuk production, gunakan Supabase backend</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
        <h3 className="font-semibold text-gray-900 mb-2">🚀 Upgrade ke Production</h3>
        <p className="text-sm text-gray-700 mb-4">
          Saat ini data hanya tersimpan di browser Anda. Untuk membuat menu yang bisa
          diakses customer dari device mereka dengan QR code yang sebenarnya bekerja,
          upgrade ke versi Supabase (gratis untuk project kecil).
        </p>
        <p className="text-sm text-gray-600">
          Dengan Supabase, Anda akan mendapat:
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
          <li>✓ Public URL yang bisa diakses dari device manapun</li>
          <li>✓ Real-time analytics</li>
          <li>✓ Data persisten dan aman</li>
          <li>✓ Multi-device sync</li>
        </ul>
      </Card>
    </div>
  );
}
