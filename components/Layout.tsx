import React, { useState } from 'react';
import { Home, Search, User, LogOut, Video, Globe } from 'lucide-react';
import { useLanguage, LANGUAGE_NAMES, Language } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate, onLogout }) => {
  const { t, language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: Home, label: t('home') },
    { id: 'matches', icon: Search, label: t('matches') },
    { id: 'video', icon: Video, label: t('call') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white border-b border-gray-200 px-8 py-4 justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">AS</div>
          <h1 className="text-xl font-bold text-primary tracking-tight">Abdullah & Sadeem SkillSwapper</h1>
        </div>
        
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-primary font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-100"
            >
              <Globe size={20} />
              <span className="text-sm font-medium uppercase">{language}</span>
            </button>
            
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === lang ? 'bg-blue-50 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {LANGUAGE_NAMES[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">{t('logout')}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-50 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 ${
              activeTab === item.id ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
         <button
            onClick={onLogout}
            className="flex flex-col items-center gap-1 p-2 rounded-lg flex-1 text-gray-400"
          >
            <LogOut size={24} />
            <span className="text-[10px] font-medium">{t('logout')}</span>
          </button>
      </nav>
    </div>
  );
};