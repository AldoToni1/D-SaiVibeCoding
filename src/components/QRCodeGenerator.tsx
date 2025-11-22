import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { MenuSettings } from '../App';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
  settings: MenuSettings;
}

export default function QRCodeGenerator({ url, settings }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [url]);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${settings.restaurantName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPreview = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QR Code & Link Menu Digital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ <strong>Catatan:</strong> Karena menggunakan localStorage, QR Code ini hanya akan bekerja di browser yang sama di device yang sama. 
              Untuk fitur QR Code yang benar-benar bisa diakses dari device manapun, gunakan opsi dengan database (Supabase).
            </p>
          </div>

          {qrCodeUrl && (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-lg">
                <img src={qrCodeUrl} alt="QR Code" className="w-72 h-72" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={downloadQRCode} className="gap-2">
                  <Download className="size-4" />
                  Download QR Code
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="block">Link Menu Digital:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button variant="outline" onClick={copyUrl} className="gap-2">
                {copied ? <CheckCircle className="size-4 text-green-500" /> : <Copy className="size-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="outline" onClick={openPreview} className="gap-2">
                <ExternalLink className="size-4" />
                Open
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h3 className="text-blue-900">Cara Menggunakan:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Download QR Code di atas</li>
              <li>Print QR Code atau tampilkan di layar</li>
              <li>Letakkan di meja atau counter rumah makan</li>
              <li>Customer scan QR Code untuk melihat menu</li>
              <li>Customer bisa langsung order via WhatsApp</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <h3>Tips Maksimalkan Digital Menu:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Update menu secara berkala dengan foto menarik</li>
              <li>Pastikan nomor WhatsApp aktif untuk menerima orderan</li>
              <li>Gunakan deskripsi yang menggugah selera</li>
              <li>Pilih template yang sesuai dengan brand rumah makan</li>
              <li>Monitor analytics untuk tahu menu favorit</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
