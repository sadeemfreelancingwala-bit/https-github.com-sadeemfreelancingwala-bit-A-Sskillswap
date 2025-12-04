import React, { useState } from 'react';
import { User, Skill } from '../types';
import { SkillBadge } from '../components/SkillBadge';
import { Plus, Save, MapPin, Edit2, User as UserIcon, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfilePageProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [editedLocation, setEditedLocation] = useState(user.location);
  const [editedPhone, setEditedPhone] = useState(user.phone || '');
  
  // Simple state for adding skills (demo purpose)
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillType, setNewSkillType] = useState<'offered' | 'wanted'>('offered');

  const handleSave = () => {
    onUpdate({ 
        ...user, 
        name: editedName,
        bio: editedBio,
        location: editedLocation,
        phone: editedPhone
    });
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!newSkillName) return;
    const skill: Skill = { id: Date.now().toString(), name: newSkillName, level: 'Intermediate' };
    const updatedUser = { ...user };
    if (newSkillType === 'offered') updatedUser.skillsOffered.push(skill);
    else updatedUser.skillsWanted.push(skill);
    onUpdate(updatedUser);
    setNewSkillName('');
  };

  const removeSkill = (id: string, type: 'offered' | 'wanted') => {
    const updatedUser = { ...user };
    if (type === 'offered') updatedUser.skillsOffered = updatedUser.skillsOffered.filter(s => s.id !== id);
    else updatedUser.skillsWanted = updatedUser.skillsWanted.filter(s => s.id !== id);
    onUpdate(updatedUser);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Photo Placeholder */}
        <div className="h-32 bg-gradient-to-r from-primary to-blue-400"></div>
        
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white" />
                    {user.isVerified && (
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-white text-sm font-bold" title="Verified User">✓</div>
                    )}
                </div>
                
                {!isEditing ? (
                    <button 
                        onClick={() => {
                            setEditedName(user.name);
                            setEditedBio(user.bio);
                            setEditedLocation(user.location);
                            setEditedPhone(user.phone || '');
                            setIsEditing(true);
                        }} 
                        className="mb-2 flex items-center gap-2 text-sm font-medium bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
                    >
                        <Edit2 size={16} /> {t('editProfile')}
                    </button>
                ) : (
                    <div className="flex gap-2 mb-2">
                         <button 
                            onClick={() => setIsEditing(false)} 
                            className="text-sm font-medium text-gray-600 px-4 py-2 hover:underline"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            onClick={handleSave} 
                            className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors shadow-sm"
                        >
                            <Save size={16} /> {t('saveChanges')}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="space-y-4">
                {isEditing ? (
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t('displayName')}</label>
                            <input 
                                type="text"
                                value={editedName} 
                                onChange={(e) => setEditedName(e.target.value)} 
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t('phone')}</label>
                            <input 
                                type="tel"
                                value={editedPhone} 
                                onChange={(e) => setEditedPhone(e.target.value)} 
                                placeholder="+92 300 1234567"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t('location')}</label>
                            <input 
                                type="text"
                                value={editedLocation} 
                                onChange={(e) => setEditedLocation(e.target.value)} 
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                         <div>
                             <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{t('bio')}</label>
                            <textarea 
                                value={editedBio} 
                                onChange={(e) => setEditedBio(e.target.value)} 
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                                rows={3}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <div className="flex flex-col gap-2 mt-2 mb-4">
                            <p className="text-gray-500 flex items-center gap-2">
                                <MapPin size={16} /> {user.location}
                            </p>
                            {user.phone && (
                                <p className="text-gray-500 flex items-center gap-2">
                                    <Phone size={16} /> 
                                    <a href={`tel:${user.phone}`} className="hover:text-primary transition-colors hover:underline">
                                        {user.phone}
                                    </a>
                                </p>
                            )}
                        </div>
                        <p className="text-gray-700 leading-relaxed max-w-2xl">{user.bio}</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <UserIcon size={20} className="text-primary"/> {t('skillsExpertise')}
                </h3>
                
                <div className="space-y-6">
                    {/* Offered */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex justify-between items-center">
                            {t('iCanTeach')}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">{user.skillsOffered.length}</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {user.skillsOffered.map(skill => (
                                <SkillBadge key={skill.id} skill={skill} type="offered" onRemove={isEditing ? () => removeSkill(skill.id, 'offered') : undefined} />
                            ))}
                            {user.skillsOffered.length === 0 && <span className="text-gray-400 italic text-sm">{t('noSkillsYet')}</span>}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Wanted */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex justify-between items-center">
                            {t('iWantToLearn')}
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{user.skillsWanted.length}</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {user.skillsWanted.map(skill => (
                                <SkillBadge key={skill.id} skill={skill} type="wanted" onRemove={isEditing ? () => removeSkill(skill.id, 'wanted') : undefined} />
                            ))}
                            {user.skillsWanted.length === 0 && <span className="text-gray-400 italic text-sm">{t('noSkillsYet')}</span>}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="md:col-span-1">
               {/* Add Skill Form */}
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                    <h4 className="font-bold text-gray-900 mb-4">{t('addNewSkill')}</h4>
                    <div className="space-y-3">
                        <div>
                             <label className="block text-xs text-gray-500 mb-1">{t('skillName')}</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Photoshop" 
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">{t('skillType')}</label>
                            <select 
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={newSkillType}
                                onChange={(e) => setNewSkillType(e.target.value as any)}
                            >
                                <option value="offered">{t('canTeachOption')}</option>
                                <option value="wanted">{t('wantLearnOption')}</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleAddSkill}
                            disabled={!newSkillName}
                            className="w-full bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> {t('addSkillButton')}
                        </button>
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
};