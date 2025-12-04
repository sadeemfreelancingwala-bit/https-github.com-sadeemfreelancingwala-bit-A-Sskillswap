import React, { useState } from 'react';
import { User } from '../types';
import { Clock, Star, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { getLearningRoadmap } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t } = useLanguage();
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const handleGenerateRoadmap = async () => {
    if (user.skillsWanted.length === 0) return;
    setLoadingRoadmap(true);
    const result = await getLearningRoadmap(user.skillsWanted[0].name);
    setRoadmap(result);
    setLoadingRoadmap(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{t('welcome')}, {user.name}!</h2>
        <p className="opacity-90">{t('pendingRequests')}</p>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm opacity-80">{t('hoursExchanged')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold flex items-center gap-1">4.8 <Star size={16} fill="white" /></div>
                <div className="text-sm opacity-80">{t('avgRating')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm opacity-80">{t('newSkills')}</div>
            </div>
        </div>
      </div>

      {/* AI Roadmap Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="text-yellow-500" size={20} />
                {t('aiAssistant')}
            </h3>
        </div>
       
        {!roadmap ? (
            <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                    Want a customized plan to learn <strong>{user.skillsWanted[0]?.name || 'something new'}</strong>?
                </p>
                <button 
                    onClick={handleGenerateRoadmap}
                    disabled={loadingRoadmap || user.skillsWanted.length === 0}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                >
                    {loadingRoadmap ? <Loader2 className="animate-spin" size={18} /> : <TrendingUp size={18} />}
                    {t('generateRoadmap')}
                </button>
            </div>
        ) : (
             <div className="space-y-4">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">{t('suggestedPath')} {user.skillsWanted[0]?.name}</p>
                <div className="grid md:grid-cols-3 gap-4">
                    {roadmap.steps?.map((step: any, idx: number) => (
                         <div key={idx} className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                            <div className="w-8 h-8 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold mb-3">{idx + 1}</div>
                            <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
                 <button onClick={() => setRoadmap(null)} className="text-sm text-gray-500 hover:text-gray-900 mt-2 underline">{t('clear')}</button>
             </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-gray-400" /> {t('recentActivity')}
            </h3>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                         <img src={`https://picsum.photos/40/40?random=${i+10}`} alt="User" className="w-10 h-10 rounded-full object-cover" />
                         <div>
                            <p className="text-sm font-medium text-gray-900">{t('sessionWith')} Maria G.</p>
                            <p className="text-xs text-gray-500">Spanish • 45 {t('mins')} • {t('yesterday')}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Actions */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('quickActions')}</h3>
            <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors flex justify-between items-center group">
                    <span className="font-medium text-gray-700 group-hover:text-primary">{t('scheduleCall')}</span>
                    <Clock size={18} className="text-gray-400 group-hover:text-primary" />
                </button>
                 <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors flex justify-between items-center group">
                    <span className="font-medium text-gray-700 group-hover:text-primary">{t('updateSkills')}</span>
                    <TrendingUp size={18} className="text-gray-400 group-hover:text-primary" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};