import { useState } from 'react';
import { MenuBuilder } from './components/MenuBuilder';
import { TemplateSelection } from './components/TemplateSelection';
import { MenuPreview } from './components/MenuPreview';
import { Analytics } from './components/Analytics';
import { PublicMenu } from './components/PublicMenu';
import { LanguageProvider } from './contexts/LanguageContext';
import { MenuProvider } from './contexts/MenuContext';
import { LayoutDashboard, Eye, BarChart3, Palette, Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [showPublicView, setShowPublicView] = useState(false);

  // Check if we're in public view mode (via URL parameter)
  const urlParams = new URLSearchParams(window.location.search);
  const isPublicView = urlParams.get('view') === 'public';

  if (isPublicView || showPublicView) {
    return (
      <LanguageProvider>
        <MenuProvider>
          <PublicMenu onBack={() => setShowPublicView(false)} />
        </MenuProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <MenuProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
          <header className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                    <Menu className="size-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">MenuKu Digital</h1>
                    <p className="text-sm text-gray-600">Self-Service Digital Menu Builder</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowPublicView(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Eye className="size-4" />
                  View Public Menu
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
                <TabsTrigger value="builder" className="gap-2">
                  <LayoutDashboard className="size-4" />
                  Menu Builder
                </TabsTrigger>
                <TabsTrigger value="template" className="gap-2">
                  <Palette className="size-4" />
                  Template
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="size-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2">
                  <BarChart3 className="size-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="space-y-6">
                <MenuBuilder />
              </TabsContent>

              <TabsContent value="template" className="space-y-6">
                <TemplateSelection />
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <MenuPreview />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Analytics />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </MenuProvider>
    </LanguageProvider>
  );
}
