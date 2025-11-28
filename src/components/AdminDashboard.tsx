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
// ✅ Ikon Lengkap (Dihapus ChevronDown & Menu karena tidak dipakai lagi)
import { LayoutDashboard, Eye, BarChart3, Palette, Building2, GripVertical, LogOut, ExternalLink } from 'lucide-react';
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

  const urlParams = new URLSearchParams(window.location.search);
  const isPublicView = urlParams.get('view') === 'public';

  // Navigasi Menu
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
        {/* TAMPILAN PUBLIC VIEW */}
        {(isPublicView || showPublicView) ? (
          <PublicMenu onBack={() => setShowPublicView(false)} />
        ) : (
          /* TAMPILAN ADMIN DASHBOARD */
          <div className="min-h-screen bg-gray-50/50">
            
            {/* 1. HEADER (LOGO & USER INFO) */}
            <header className="bg-white border-b border-gray-200">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* KIRI: Logo */}
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg shadow-sm">
                    <Building2 className="size-5 text-white" />
                  </div>
                  <div className="leading-tight">
                    <h1 className="font-bold text-lg text-gray-900 tracking-tight">DSAI Kitchen</h1>
                    <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Dashboard Admin</p>
                  </div>
                </div>

                {/* KANAN: User Actions */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5 leading-none block">
                      Login sebagai:
                    </span>
                    <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate leading-none block">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>

                  <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex gap-2 border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50"
                    onClick={() => setShowPublicView(true)}
                  >
                    <ExternalLink className="size-4" />
                    <span className="hidden lg:inline">Lihat Menu</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                    title="Keluar"
                  >
                    <LogOut className="size-5" />
                  </Button>
                </div>
              </div>
            </header>

            {/* 2. NAVBAR RESPONSIVE (Horizontal Scroll di Mobile, Center di Desktop) */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
              <div className="container mx-auto px-4">
                <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2 w-full md:justify-center">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                          ${isActive 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* 3. KONTEN UTAMA */}
            <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'builder' && <MenuBuilder />}
                {activeTab === 'sorter' && <MenuSorter />}
                {activeTab === 'template' && <TemplateSelection />}
                {activeTab === 'preview' && <MenuPreview />}
                {activeTab === 'analytics' && <Analytics />}
              </div>
            </main>

            <Toaster />
          </div>
        )}
      </MenuProvider>
    </LanguageProvider>
  );
}