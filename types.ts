export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // Added phone number field
  avatar: string;
  bio: string;
  location: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  isVerified: boolean;
  rating: number;
}

export interface MatchSuggestion {
  user: User;
  matchScore: number;
  reason: string;
  commonInterests: string[];
}

export enum CallStatus {
  IDLE = 'IDLE',
  CALLING = 'CALLING',
  CONNECTED = 'CONNECTED',
  ENDED = 'ENDED',
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}