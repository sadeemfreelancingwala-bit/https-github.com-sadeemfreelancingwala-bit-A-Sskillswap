
import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, Lock, ArrowLeft, Loader2, Globe, Facebook, CheckCircle, User, ArrowRight, X, ChevronDown } from 'lucide-react';
import { useLanguage, LANGUAGE_NAMES, Language } from '../contexts/LanguageContext';
import { User as UserType } from '../types';

// Declare Google and Facebook globals for TypeScript
declare const google: any;
declare const FB: any;
declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}

interface AuthPageProps {
  onLogin: (data?: any) => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onBack }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string>(''); 
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // State to capture input values
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  
  // "Remembered" User State
  const [rememberedUser, setRememberedUser] = useState<{name: string, email: string, avatar: string} | null>(null);

  // --- CONFIGURATION ---
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"; 
  const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID";
  // ---------------------

  const isGoogleConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE";

  useEffect(() => {
    // Check for last logged in user
    const lastUser = localStorage.getItem('skillswap_last_user');
    if (lastUser) {
        try {
            setRememberedUser(JSON.parse(lastUser));
        } catch (e) {
            console.error("Error parsing last user", e);
        }
    }

    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      if (typeof FB !== 'undefined') {
        FB.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v19.0'
        });
      }
    };
  }, [FACEBOOK_APP_ID]);

  useEffect(() => {
    if (isGoogleConfigured && typeof google !== 'undefined' && google.accounts) {
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID, 
          callback: (response: any) => {
             handleIdentityVerification(response);
          }
        });
        
        const googleButtonDiv = document.getElementById("googleSignInDiv");
        if (googleButtonDiv) {
            google.accounts.id.renderButton(
              googleButtonDiv,
              { theme: "outline", size: "large", width: "100%", text: "continue_with" } 
            );
        }
      } catch (error) {
        console.error("Google Sign-In initialization failed", error);
      }
    }
  }, [isGoogleConfigured, GOOGLE_CLIENT_ID, rememberedUser]); // Re-run if view changes

  const handleIdentityVerification = (response: any) => {
    setIsLoading(true);
    setVerificationStep('Authenticating...');

    setTimeout(() => {
        setVerificationStep('GetIdentityVerification...');
        
        setTimeout(() => {
            setVerificationStep('Verified Successfully');
            
            setTimeout(() => {
                setIsLoading(false);
                onLogin(response);
            }, 800);
        }, 1500);
    }, 1000);
  };

  const handleSmartGoogleLogin = () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      sub: "1234567890",
      name: "Verified Google User",
      email: "user@gmail.com",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      email_verified: true,
      iss: "https://accounts.google.com",
      aud: GOOGLE_CLIENT_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    const signature = "mock_signature";
    const mockCredential = `${header}.${payload}.${signature}`;

    handleIdentityVerification({ credential: mockCredential });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ 
        type: 'custom', 
        name: nameValue, 
        email: emailValue, 
        phone: phoneValue,
        method: method 
      }); 
    }, 1500);
  };

  const handleRememberedLogin = () => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          // Auto login with remembered email
          onLogin({
              type: 'custom',
              name: rememberedUser?.name,
              email: rememberedUser?.email,
              method: 'email'
          });
      }, 1000);
  };

  const handleFacebookLogin = () => {
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (!isSecure || typeof FB === 'undefined') {
        handleIdentityVerification({ 
            type: 'facebook', 
            name: 'Facebook User', 
            email: 'fb_user@example.com',
            id: 'fb_12345' 
        });
        return;
    }
    
    FB.login((response: any) => {
      if (response.authResponse) {
        FB.api('/me', {fields: 'name, email, picture'}, (userData: any) => {
             handleIdentityVerification({
               type: 'facebook',
               ...userData,
               credential: response.authResponse.accessToken 
             });
        });
      }
    }, {scope: 'public_profile,email'});
  };

  if (verificationStep) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4 animate-fade-in">
                {verificationStep === 'Verified Successfully' ? (
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                ) : (
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                )}
                <h3 className="text-xl font-bold text-gray-900">{verificationStep}</h3>
                <p className="text-gray-500 text-sm">Securing your connection...</p>
            </div>
        </div>
    );
  }

  // --- GOOGLE STYLE INTERFACE ---
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 relative font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-primary/10 -z-10 transform -skew-y-3 origin-top-left"></div>

      <div className="bg-white rounded-[28px] shadow-sm w-full max-w-[400px] p-8 md:p-10 border border-gray-100 flex flex-col relative">
        
        {/* App Logo / Google G */}
        <div className="flex justify-center mb-6">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <svg className="w-7 h-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
             </div>
        </div>

        <h2 className="text-2xl font-normal text-center text-gray-900 mb-2">
            {isLogin ? (rememberedUser ? t('welcome') : t('signIn')) : t('createAccount')}
        </h2>
        
        <p className="text-center text-gray-600 mb-8 text-base">
            {isLogin 
                ? (rememberedUser ? "Choose an account" : "to continue to SkillSwapper") 
                : "to continue to SkillSwapper"
            }
        </p>

        {/* View 1: Remembered Account (The "Interface" requested) */}
        {rememberedUser && isLogin ? (
            <div className="animate-fade-in">
                <button 
                    onClick={handleRememberedLogin}
                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-full border border-gray-200 transition-colors mb-4 group text-left"
                >
                    <img 
                        src={rememberedUser.avatar} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                            {rememberedUser.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">{rememberedUser.email}</div>
                    </div>
                    {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                </button>

                <button 
                    onClick={() => setRememberedUser(null)} 
                    className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
                >
                    Use another account
                </button>
            </div>
        ) : (
            /* View 2: Form (Material Style) */
            <div className="space-y-6 animate-fade-in">
                <form onSubmit={handleSubmit} className="space-y-4">
                     {/* Name Field (Only for Signup) */}
                     {!isLogin && (
                        <div className="relative group">
                            <input
                                id="name"
                                type="text"
                                required
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                className="peer w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-transparent text-gray-900"
                                placeholder="Name"
                            />
                            <label 
                                htmlFor="name"
                                className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                            >
                                Full Name
                            </label>
                        </div>
                     )}

                    {/* Email Field */}
                    <div className="relative group">
                        <input
                            id="email"
                            type="email"
                            required
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            className="peer w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-transparent text-gray-900"
                            placeholder="Email"
                        />
                        <label 
                            htmlFor="email"
                            className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                        >
                            Email or phone
                        </label>
                    </div>

                    {/* Password Field (Only shown if we were doing a real multi-step, but for single step it's here) */}
                    <div className="relative group">
                         <input
                            id="password"
                            type="password"
                            required
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            className="peer w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-transparent text-gray-900"
                            placeholder="Password"
                        />
                         <label 
                            htmlFor="password"
                            className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                        >
                           {t('password')}
                        </label>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <button 
                            type="button" 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary font-medium text-sm hover:text-secondary"
                        >
                            {isLogin ? t('createAccount') : "Log in instead"}
                        </button>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                                isLogin ? "Next" : "Sign up"
                            )}
                        </button>
                    </div>
                </form>
                
                {/* Divider */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500 text-xs uppercase tracking-wide">Or</span>
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                     {isGoogleConfigured ? (
                         <div id="googleSignInDiv" className="w-full flex justify-center"></div>
                      ) : (
                        <button 
                          onClick={handleSmartGoogleLogin}
                          className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          {t('continueGoogle')}
                        </button>
                      )}

                    <button 
                        onClick={handleFacebookLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700"
                    >
                        <Facebook size={18} className="text-[#1877F2]" fill="#1877F2" />
                        {t('continueFacebook')}
                    </button>
                 </div>
            </div>
        )}

      </div>

      {/* Footer Links (Language & Terms) */}
      <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 mt-8">
        <div className="relative">
            <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 hover:text-gray-900"
            >
                {LANGUAGE_NAMES[language]} <ChevronDown size={12} />
            </button>
            {showLangMenu && (
                  <div className="absolute bottom-6 left-0 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50 max-h-48 overflow-y-auto">
                    {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-xs ${language === lang ? 'bg-blue-50 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {LANGUAGE_NAMES[lang]}
                      </button>
                    ))}
                  </div>
            )}
        </div>
        <button className="hover:text-gray-900">Help</button>
        <button className="hover:text-gray-900">Privacy</button>
        <button className="hover:text-gray-900">Terms</button>
      </div>

    </div>
  );
};
