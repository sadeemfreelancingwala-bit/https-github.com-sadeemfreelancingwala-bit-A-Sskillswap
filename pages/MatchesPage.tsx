import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { SkillBadge } from '../components/SkillBadge';
import { MapPin, Star, Video, Sparkles, Loader2, Phone } from 'lucide-react';
import { getSmartMatchAdvice } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface MatchesPageProps {
  currentUser: User;
  onCall: (user: User) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({ currentUser, onCall }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('');
  const [aiAdvice, setAiAdvice] = useState<Record<string, string>>({});
  const [loadingAdvice, setLoadingAdvice] = useState<string | null>(null);

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.skillsOffered.some(s => s.name.toLowerCase().includes(filter.toLowerCase())) ||
    (u.phone && u.phone.includes(filter)) // Allow searching by phone number
  );

  const handleGetAdvice = async (matchUser: User) => {
    setLoadingAdvice(matchUser.id);
    const advice = await getSmartMatchAdvice(currentUser, matchUser);
    setAiAdvice(prev => ({ ...prev, [matchUser.id]: advice }));
    setLoadingAdvice(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('recommendedMatches')}</h2>
          <p className="text-sm text-gray-500">Verified Community List</p>
        </div>
        <input 
          type="text"
          placeholder={t('searchPlaceholder') + " / Phone"}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-shadow hover:shadow-md flex flex-col">
            <div className="flex gap-4">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={14} /> {user.location}
                      </p>
                      {user.phone && (
                        <p className="text-sm text-primary font-medium flex items-center gap-1">
                          <Phone size={14} /> {user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                    <Star size={12} fill="currentColor" /> {user.rating}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{user.bio}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 flex-1">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">{t('offers')}</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.skillsOffered.map(skill => (
                    <SkillBadge key={skill.id} skill={skill} type="offered" />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">{t('wants')}</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.skillsWanted.map(skill => (
                    <SkillBadge key={skill.id} skill={skill} type="wanted" />
                  ))}
                </div>
              </div>
            </div>
            
             {/* AI Advice Section */}
             {aiAdvice[user.id] && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                    <div className="flex items-center gap-1 font-semibold mb-1">
                        <Sparkles size={14} /> {t('aiSuggestion')}:
                    </div>
                    "{aiAdvice[user.id]}"
                </div>
             )}

            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              {/* Official Call Button (Phone) */}
              {user.phone && (
                 <a 
                   href={`tel:${user.phone}`}
                   className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                 >
                    <Phone size={18} /> Call Phone
                 </a>
              )}

              <button 
                onClick={() => onCall(user)}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Video size={18} /> {t('callNow')}
              </button>
              
               <button 
                onClick={() => handleGetAdvice(user)}
                disabled={loadingAdvice === user.id}
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center gap-2"
                title="Get AI conversation starter"
              >
                {loadingAdvice === user.id ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
                {t('noMatches')}
            </div>
        )}
      </div>
    </div>
  );
};