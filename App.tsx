
import React, { useState, useEffect } from 'react';
import { User } from './types';
import { MOCK_CURRENT_USER } from './services/mockData';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { MatchesPage } from './pages/MatchesPage';
import { ProfilePage } from './pages/ProfilePage';
import { VideoCallPage } from './pages/VideoCallPage';

// Simulated Views for routing without a full router library for this demo structure
type View = 'landing' | 'auth' | 'dashboard' | 'matches' | 'profile' | 'video_call' | 'video';

// Helper to decode JWT from Google
const parseJwt = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [activeCallPartner, setActiveCallPartner] = useState<User | null>(null);

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('skillswap_user');
    if (savedUser) {
        try {
            setUser(JSON.parse(savedUser));
            setCurrentView('dashboard');
        } catch (e) {
            console.error("Failed to load user from storage", e);
            localStorage.removeItem('skillswap_user');
        }
    }
  }, []);

  // Save user to local storage whenever user state changes
  useEffect(() => {
    if (user) {
        localStorage.setItem('skillswap_user', JSON.stringify(user));
        // ALSO save to a separate 'last_user' key for the Auth Page "Remember Me" screen
        localStorage.setItem('skillswap_last_user', JSON.stringify({
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }));
    } else {
        localStorage.removeItem('skillswap_user');
    }
  }, [user]);

  const handleLogin = (loginData?: any) => {
    let loggedInUser: User;
    console.log("Processing Login...", loginData);

    // Google Login (Real or Simulated Token)
    if (loginData && loginData.credential && !loginData.type) {
        const decoded = parseJwt(loginData.credential);
        
        if (decoded) {
            console.log("Identity Verified: ", decoded.name);
            loggedInUser = {
                ...MOCK_CURRENT_USER, // Inherit default settings
                id: decoded.sub || 'google_user_' + Date.now(),
                name: decoded.name || "Verified User",
                email: decoded.email || "user@gmail.com",
                avatar: decoded.picture || MOCK_CURRENT_USER.avatar,
                isVerified: true
            };
        } else {
             loggedInUser = MOCK_CURRENT_USER;
        }
    } 
    // Facebook Login
    else if (loginData && loginData.type === 'facebook') {
        loggedInUser = {
            ...MOCK_CURRENT_USER,
            id: 'fb_' + loginData.id,
            name: loginData.name,
            email: loginData.email || 'facebook_user@example.com',
            avatar: loginData.picture?.data?.url || `https://ui-avatars.com/api/?name=${loginData.name}&background=1877F2&color=fff`,
            isVerified: true
        };
    }
    // Custom Email/Phone Login (with explicit Name if provided from Signup)
    else if (loginData && loginData.type === 'custom') {
        const email = loginData.email || 'user@example.com';
        
        let finalName = "";

        // 1. Try to use the name explicitly provided during Signup
        if (loginData.name && loginData.name.trim().length > 0) {
             finalName = loginData.name;
        } 
        // 2. Fallback: Generate Name from Email (for Login where name isn't asked)
        else {
            const namePart = email.split('@')[0];
            finalName = namePart
                .split(/[._]/) // Split by dot or underscore
                .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize each part
                .join(' ');
        }
        
        loggedInUser = {
            ...MOCK_CURRENT_USER,
            id: 'u_' + Date.now(),
            name: finalName,
            email: email,
            phone: loginData.phone, // Store phone if used
            // Generate a nice avatar based on the derived name
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=random&color=fff`,
            isVerified: false
        };
    }
    // Fallback for empty login
    else {
        loggedInUser = MOCK_CURRENT_USER;
    }
    
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth'); // Go back to auth page to show the "Remember Me" screen
    setActiveCallPartner(null);
    localStorage.removeItem('skillswap_user');
  };

  const handleUpdateProfile = (updatedUser: User) => {
      setUser(updatedUser);
      // LocalStorage update handled by useEffect
  };

  const startCall = (partner: User) => {
    setActiveCallPartner(partner);
    setCurrentView('video_call');
  };

  const endCall = () => {
    setActiveCallPartner(null);
    setCurrentView('dashboard');
  };

  // Unauthenticated Routes
  if (!user) {
    if (currentView === 'auth') {
      return <AuthPage onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
    }
    return <LandingPage onLoginClick={() => setCurrentView('auth')} />;
  }

  // Active Video Call (Full Screen Overlay)
  if (currentView === 'video_call' && activeCallPartner) {
    return <VideoCallPage partner={activeCallPartner} onEndCall={endCall} />;
  }

  // Authenticated Routes wrapped in Layout
  return (
    <Layout 
      activeTab={currentView} 
      onNavigate={(view) => setCurrentView(view as View)}
      onLogout={handleLogout}
    >
      {currentView === 'dashboard' && <Dashboard user={user} />}
      {currentView === 'matches' && <MatchesPage currentUser={user} onCall={startCall} />}
      {currentView === 'profile' && <ProfilePage user={user} onUpdate={handleUpdateProfile} />}
      
      {/* Fallback for Video tab clicked directly without a partner */}
      {currentView === 'video' && (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Calls</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Start a video call by finding a match or scheduling a session with a mentor.</p>
            <button 
                onClick={() => setCurrentView('matches')}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors shadow-sm"
            >
                Find a Skill Partner
            </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
