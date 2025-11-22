import { useMenu } from '../contexts/MenuContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check } from 'lucide-react';

const templates = [
  {
    id: 'minimalist' as const,
    name: 'Minimalist',
    description: 'Clean and simple design with focus on content',
    preview: 'bg-white border-2',
    colors: 'text-gray-900 bg-white',
  },
  {
    id: 'colorful' as const,
    name: 'Colorful',
    description: 'Vibrant and energetic with bold colors',
    preview: 'bg-gradient-to-br from-pink-500 to-orange-500',
    colors: 'text-white bg-gradient-to-br from-pink-500 to-orange-500',
  },
  {
    id: 'elegant' as const,
    name: 'Elegant',
    description: 'Sophisticated dark theme with golden accents',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
    colors: 'text-yellow-400 bg-gray-900',
  },
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Contemporary design with blue tones',
    preview: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    colors: 'text-white bg-gradient-to-br from-blue-600 to-cyan-500',
  },
];

export function TemplateSelection() {
  const { settings, updateSettings } = useMenu();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Settings</h2>
        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Nama Restoran (Indonesia)</Label>
            <Input
              id="restaurantName"
              value={settings.restaurantName}
              onChange={(e) => updateSettings({ restaurantName: e.target.value })}
              placeholder="Rumah Makan Saya"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantNameEn">Restaurant Name (English)</Label>
            <Input
              id="restaurantNameEn"
              value={settings.restaurantNameEn || ''}
              onChange={(e) => updateSettings({ restaurantNameEn: e.target.value })}
              placeholder="My Restaurant"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              value={settings.whatsappNumber}
              onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
              placeholder="628123456789"
            />
            <p className="text-xs text-gray-500">
              Format: 628xxxxxxxxx (62 untuk Indonesia, tanpa tanda +)
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pilih Template</h2>
        <p className="text-sm text-gray-600 mb-6">
          Pilih tema tampilan untuk menu digital Anda
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => updateSettings({ template: template.id })}
              className="text-left"
            >
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  settings.template === template.id
                    ? 'ring-2 ring-orange-500 ring-offset-2'
                    : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-lg ${template.preview} flex items-center justify-center flex-shrink-0`}
                  >
                    {settings.template === template.id && (
                      <div className="bg-orange-500 rounded-full p-1">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
