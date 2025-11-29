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

// Color themes untuk setiap template
const colorThemes = {
  minimalist: [
    {
      name: 'White',
      bgClass: 'bg-white',
      bgGradient: 'bg-white',
      cardBg: 'bg-gray-50',
      cardBorder: 'border-gray-200',
      headerBg: 'bg-white',
      textPrimary: 'text-gray-900',
      accentColor: 'text-blue-600',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      preview: 'bg-white border-2 border-gray-300',
    },
    {
      name: 'Gray',
      bgClass: 'bg-gray-100',
      bgGradient: 'bg-gray-100',
      cardBg: 'bg-white',
      cardBorder: 'border-gray-300',
      headerBg: 'bg-gray-50',
      textPrimary: 'text-gray-900',
      accentColor: 'text-gray-700',
      buttonBg: 'bg-gray-700',
      buttonHover: 'hover:bg-gray-800',
      preview: 'bg-gray-100 border-2 border-gray-400',
    },
  ],
  colorful: [
    {
      name: 'Pink-Orange',
      bgClass: 'bg-gradient-to-br from-pink-50 to-orange-50',
      bgGradient: 'bg-gradient-to-br from-pink-500 to-orange-500',
      cardBg: 'bg-white',
      cardBorder: 'border-orange-200',
      headerBg: 'bg-gradient-to-r from-pink-500 to-orange-500',
      textPrimary: 'text-gray-900',
      accentColor: 'text-orange-600',
      buttonBg: 'bg-orange-500',
      buttonHover: 'hover:bg-orange-600',
      preview: 'bg-gradient-to-br from-pink-500 to-orange-500',
    },
    {
      name: 'Purple-Pink',
      bgClass: 'bg-gradient-to-br from-purple-50 to-pink-50',
      bgGradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      cardBg: 'bg-white',
      cardBorder: 'border-purple-200',
      headerBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textPrimary: 'text-gray-900',
      accentColor: 'text-purple-600',
      buttonBg: 'bg-purple-500',
      buttonHover: 'hover:bg-purple-600',
      preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
  ],
  elegant: [
    {
      name: 'Dark-Gold',
      bgClass: 'bg-gray-900',
      bgGradient: 'bg-gradient-to-br from-gray-900 to-gray-800',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      headerBg: 'bg-gray-900',
      textPrimary: 'text-white',
      accentColor: 'text-yellow-400',
      buttonBg: 'bg-yellow-500',
      buttonHover: 'hover:bg-yellow-600',
      preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
    },
    {
      name: 'Dark-Teal',
      bgClass: 'bg-gray-900',
      bgGradient: 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-800',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-teal-700',
      headerBg: 'bg-gradient-to-r from-gray-900 to-teal-900',
      textPrimary: 'text-white',
      accentColor: 'text-teal-400',
      buttonBg: 'bg-teal-500',
      buttonHover: 'hover:bg-teal-600',
      preview: 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-800',
    },
  ],
  modern: [
    {
      name: 'Blue-Cyan',
      bgClass: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      bgGradient: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      cardBg: 'bg-white',
      cardBorder: 'border-blue-200',
      headerBg: 'bg-gradient-to-r from-blue-600 to-cyan-500',
      textPrimary: 'text-gray-900',
      accentColor: 'text-blue-600',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      preview: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    },
    {
      name: 'Teal-Green',
      bgClass: 'bg-gradient-to-br from-teal-50 to-green-50',
      bgGradient: 'bg-gradient-to-br from-teal-500 to-green-500',
      cardBg: 'bg-white',
      cardBorder: 'border-teal-200',
      headerBg: 'bg-gradient-to-r from-teal-500 to-green-500',
      textPrimary: 'text-gray-900',
      accentColor: 'text-teal-600',
      buttonBg: 'bg-teal-500',
      buttonHover: 'hover:bg-teal-600',
      preview: 'bg-gradient-to-br from-teal-500 to-green-500',
    },
  ],
};

export function TemplateSelection() {
  const { settings, updateSettings } = useMenu();
  const currentTemplateThemes = colorThemes[settings.template as keyof typeof colorThemes] || colorThemes.modern;

  // Get selected color theme
  const selectedTheme = currentTemplateThemes[0];

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
              placeholder="6281227281923"
            />
            <p className="text-xs text-gray-500">Format: 628xxxxxxxxx (62 untuk Indonesia, tanpa tanda +)</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pilih Template</h2>
        <p className="text-sm text-gray-600 mb-6">Pilih tema tampilan untuk menu digital Anda</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <button key={template.id} onClick={() => updateSettings({ template: template.id })} className="text-left">
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  settings.template === template.id ? 'ring-2 ring-orange-500 ring-offset-2' : ''
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

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pilih Warna Tema</h2>
        <p className="text-sm text-gray-600 mb-6">Pilih warna yang sesuai dengan brand Anda</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTemplateThemes.map((theme, idx) => (
            <button
              key={theme.name}
              onClick={() =>
                updateSettings({
                  templateColor: theme as any,
                })
              }
              className="text-left"
            >
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  settings.templateColor?.name === theme.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-20 h-20 rounded-lg ${theme.preview} flex items-center justify-center flex-shrink-0`}
                  >
                    {settings.templateColor?.name === theme.name && (
                      <div className="bg-white rounded-full p-1">
                        <Check className="size-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <div className={`w-4 h-4 rounded ${theme.cardBg} border ${theme.cardBorder}`} title="Card" />
                      <div className={`w-4 h-4 rounded ${theme.buttonBg}`} title="Button" />
                      <div
                        className={`w-4 h-4 rounded bg-gradient-to-br ${theme.bgGradient.replace(
                          'bg-gradient-to-br ',
                          ''
                        )}`}
                        title="Background"
                      />
                    </div>
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
