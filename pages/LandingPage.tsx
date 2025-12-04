import React from 'react';
import { ArrowRight, Video, Globe, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">AS</div>
          <h1 className="text-xl font-bold text-gray-900">Abdullah & Sadeem SkillSwapper</h1>
        </div>
        <button 
          onClick={onLoginClick}
          className="text-gray-600 font-medium hover:text-primary transition-colors"
        >
          {t('signIn')}
        </button>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            {t('heroSub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onLoginClick}
              className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              {t('getStarted')} <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Community</h3>
              <p className="text-gray-500">Connect with learners from over 100 countries. Exchange culture while you exchange skills.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Video size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Video Calls</h3>
              <p className="text-gray-500">High-quality built-in video. No external links or software required. Just click and learn.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
              <p className="text-gray-500">Our AI-powered algorithm finds the perfect learning partner based on your specific needs.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-12 text-center text-gray-400 text-sm">
        <p>© 2024 Abdullah & Sadeem SkillSwapper. All rights reserved.</p>
      </footer>
    </div>
  );
};