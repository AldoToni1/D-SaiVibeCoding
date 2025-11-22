import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { MenuSettings } from '../App';
import { Palette, Sparkles, Crown, Zap } from 'lucide-react';

interface TemplateSelectorProps {
  settings: MenuSettings;
  setSettings: (settings: MenuSettings) => void;
}

const themes = [
  {
    id: 'minimalist' as const,
    name: 'Minimalist',
    description: 'Simple, clean, modern',
    icon: Sparkles,
    colors: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-100',
      accent: 'bg-gray-600',
    },
  },
  {
    id: 'colorful' as const,
    name: 'Colorful',
    description: 'Bright, fun, energetic',
    icon: Palette,
    colors: {
      primary: 'bg-orange-500',
      secondary: 'bg-yellow-400',
      accent: 'bg-pink-500',
    },
  },
  {
    id: 'elegant' as const,
    name: 'Elegant',
    description: 'Sophisticated, premium',
    icon: Crown,
    colors: {
      primary: 'bg-amber-900',
      secondary: 'bg-amber-100',
      accent: 'bg-amber-600',
    },
  },
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Bold, contemporary',
    icon: Zap,
    colors: {
      primary: 'bg-blue-600',
      secondary: 'bg-cyan-100',
      accent: 'bg-purple-500',
    },
  },
];

export default function TemplateSelector({ settings, setSettings }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Rumah Makan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nama Rumah Makan (Indonesia)</Label>
              <Input
                id="restaurantName"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                placeholder="Warung Makan Bahagia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantNameEn">Nama Rumah Makan (English)</Label>
              <Input
                id="restaurantNameEn"
                value={settings.restaurantNameEn}
                onChange={(e) => setSettings({ ...settings, restaurantNameEn: e.target.value })}
                placeholder="Happy Food Restaurant"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp (untuk order)</Label>
            <Input
              id="whatsapp"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              placeholder="6281227281923"
            />
            <p className="text-gray-500">Format: 628xxxxxxxxx (gunakan 62 untuk +62)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Template Tema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = settings.theme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => setSettings({ ...settings, theme: theme.id })}
                  className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                    isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`size-8 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} />
                    {isSelected && <div className="bg-orange-500 text-white px-3 py-1 rounded-full">Aktif</div>}
                  </div>
                  <h3 className="mb-1">{theme.name}</h3>
                  <p className="text-gray-500 mb-4">{theme.description}</p>
                  <div className="flex gap-2">
                    <div className={`w-8 h-8 rounded ${theme.colors.primary}`} />
                    <div className={`w-8 h-8 rounded ${theme.colors.secondary}`} />
                    <div className={`w-8 h-8 rounded ${theme.colors.accent}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
