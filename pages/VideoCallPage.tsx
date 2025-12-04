import React, { useEffect, useRef, useState } from 'react';
import { User, CallStatus } from '../types';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoCallPageProps {
  partner: User;
  onEndCall: () => void;
}

export const VideoCallPage: React.FC<VideoCallPageProps> = ({ partner, onEndCall }) => {
  const { t } = useLanguage();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CallStatus>(CallStatus.CALLING);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Request Camera Access
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Error accessing media devices:", err));

    // Simulate connection delay
    const connectTimer = setTimeout(() => {
        setStatus(CallStatus.CONNECTED);
    }, 2500);

    return () => {
        clearTimeout(connectTimer);
        // Cleanup tracks
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (status === CallStatus.CONNECTED) {
        interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-[100] flex flex-col">
      {/* Remote Video (Simulated) */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {status === CallStatus.CONNECTED ? (
             <img 
                src={partner.avatar} 
                alt={partner.name} 
                className="w-full h-full object-cover opacity-80 blur-sm scale-105" 
            />
        ) : (
            <div className="flex flex-col items-center animate-pulse">
                <img src={partner.avatar} className="w-24 h-24 rounded-full mb-4 border-4 border-white/20" />
                <h3 className="text-white text-xl font-semibold">{t('calling')} {partner.name}...</h3>
            </div>
        )}

        {/* Center Overlay if connected (Simulating a real person somewhat) */}
        {status === CallStatus.CONNECTED && (
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                    <img src={partner.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-2xl mx-auto mb-4" />
                    <h2 className="text-white text-2xl font-bold shadow-black drop-shadow-md">{partner.name}</h2>
                    <p className="text-white/80">{partner.location}</p>
                 </div>
            </div>
        )}

        {/* Timer */}
        {status === CallStatus.CONNECTED && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/40 px-4 py-1 rounded-full text-white font-mono text-sm backdrop-blur-md">
                {formatTime(timer)}
            </div>
        )}

        {/* Local Video (Floating) */}
        <div className="absolute top-4 right-4 w-32 md:w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden border border-white/20 shadow-xl">
             <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && <div className="w-full h-full flex items-center justify-center text-white text-xs">{t('cameraOff')}</div>}
        </div>
      </div>

      {/* Controls */}
      <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-6 pb-safe">
        <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full transition-colors ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button 
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-transform hover:scale-105 shadow-lg shadow-red-600/30"
        >
            <PhoneOff size={28} />
        </button>

        <button className="p-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 hidden md:flex">
             <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
};