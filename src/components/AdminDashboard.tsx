import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MenuBuilder } from './MenuBuilder';
import { TemplateSelection } from './TemplateSelection';
import { MenuPreview } from './MenuPreview';
import { Analytics } from './Analytics';
import { PublicMenu } from './PublicMenu';
import { MenuSorter } from './MenuSorter';
import { LanguageProvider } from '../contexts/LanguageContext';
import { MenuProvider } from '../contexts/MenuContext';
import { LayoutDashboard, Eye, BarChart3, Palette, Menu, GripVertical, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('builder');
  const [showPublicView, setShowPublicView] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  // All navigation items
  const navItems = [
    { id: 'builder', label: 'Menu Builder', icon: LayoutDashboard },
    { id: 'sorter', label: 'Urutkan Menu', icon: GripVertical },
    { id: 'template', label: 'Template', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <LanguageProvider>
      <MenuProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50" style={{ isolation: 'auto' }}>
          {/* Modern Navbar */}
          <header className="bg-white border-b shadow-sm sticky top-0 z-[100]" style={{ pointerEvents: 'auto' }}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                    <Menu className="size-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">MenuKu Digital</h1>
                    <p className="text-sm text-gray-600 hidden sm:block">Self-Service Digital Menu Builder</p>
                  </div>
                </div>

                {/* Navigation - SELALU HORIZONTAL */}
                <nav
                  className="flex items-center gap-1 relative z-[101] overflow-x-auto overflow-y-hidden"
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {/* Menu Items */}
                  <div className="flex items-center gap-1 flex-row flex-nowrap min-w-max">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                            whitespace-nowrap relative z-[102] flex-shrink-0
                            ${
                              activeTab === item.id
                                ? 'bg-orange-100 text-orange-700 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                          style={{
                            pointerEvents: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                          }}
                        >
                          <Icon className="size-4 flex-shrink-0" />
                          <span className="hidden lg:inline">{item.label}</span>
                          <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}

                    {/* View Public Menu Button */}
                    <Button
                      onClick={() => setShowPublicView(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2 ml-2 relative z-[102] flex-shrink-0"
                      style={{
                        pointerEvents: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                      }}
                    >
                      <Eye className="size-4" />
                      <span className="hidden sm:inline">View Public</span>
                      <span className="sm:hidden">View</span>
                    </Button>

                    {/* User Info & Logout */}
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                      <div className="hidden sm:flex flex-col items-end text-sm">
                        <p className="font-medium text-gray-700 truncate">{user?.email}</p>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="size-4" />
                        <span className="hidden sm:inline">Logout</span>
                      </Button>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            {activeTab === 'builder' && (
              <div className="space-y-6">
                <MenuBuilder />
              </div>
            )}
            {activeTab === 'sorter' && (
              <div className="space-y-6">
                <MenuSorter />
              </div>
            )}
            {activeTab === 'template' && (
              <div className="space-y-6">
                <TemplateSelection />
              </div>
            )}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <MenuPreview />
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <Analytics />
              </div>
            )}
          </main>
          <Toaster />
        </div>
      </MenuProvider>
    </LanguageProvider>
  );
}
