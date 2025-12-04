import { User } from '../types';

export const MOCK_CURRENT_USER: User = {
  id: 'u1',
  name: 'Guest User',
  email: 'guest@skillswap.com',
  phone: '+923001234567',
  avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=2563EB&color=fff',
  bio: 'Learning new skills.',
  location: 'Karachi, Pakistan',
  isVerified: true,
  rating: 5.0,
  skillsOffered: [
    { id: 's1', name: 'Urdu', level: 'Expert' }
  ],
  skillsWanted: [
    { id: 's2', name: 'English', level: 'Intermediate' }
  ]
};

// ENTER YOUR SPECIFIC USERS AND PHONE NUMBERS HERE
// Sirf yehi log matches mein show honge
export const MOCK_USERS: User[] = [
  {
    id: 'user_abdullah',
    name: 'Abdullah',
    email: 'abdullah@example.com',
    phone: '+92 300 1111111', // Add specific number
    avatar: 'https://ui-avatars.com/api/?name=Abdullah&background=0D9488&color=fff',
    bio: 'Full Stack Developer & Community Admin.',
    location: 'Lahore, Pakistan',
    isVerified: true,
    rating: 5.0,
    skillsOffered: [
      { id: 'sk1', name: 'Web Development', level: 'Expert' },
      { id: 'sk2', name: 'JavaScript', level: 'Expert' }
    ],
    skillsWanted: [
      { id: 'sk3', name: 'Digital Marketing', level: 'Beginner' }
    ]
  },
  {
    id: 'user_sadeem',
    name: 'Sadeem',
    email: 'sadeem@example.com',
    phone: '+92 300 2222222', // Add specific number
    avatar: 'https://ui-avatars.com/api/?name=Sadeem&background=7C3AED&color=fff',
    bio: 'UI/UX Designer & Project Manager.',
    location: 'Islamabad, Pakistan',
    isVerified: true,
    rating: 5.0,
    skillsOffered: [
      { id: 'sk4', name: 'Graphic Design', level: 'Expert' },
      { id: 'sk5', name: 'Management', level: 'Expert' }
    ],
    skillsWanted: [
      { id: 'sk6', name: 'Python', level: 'Beginner' }
    ]
  },
  {
    id: 'user_ali',
    name: 'Ali Khan',
    email: 'ali@example.com',
    phone: '+92 300 3333333',
    avatar: 'https://ui-avatars.com/api/?name=Ali+Khan&background=EA580C&color=fff',
    bio: 'Professional Video Editor.',
    location: 'Karachi, Pakistan',
    isVerified: true,
    rating: 4.9,
    skillsOffered: [
      { id: 'sk7', name: 'Video Editing', level: 'Expert' },
      { id: 'sk8', name: 'Premiere Pro', level: 'Expert' }
    ],
    skillsWanted: [
      { id: 'sk9', name: 'Graphic Design', level: 'Intermediate' }
    ]
  },
  {
    id: 'user_hassan',
    name: 'Hassan Raza',
    email: 'hassan@example.com',
    phone: '+92 300 4444444',
    avatar: 'https://ui-avatars.com/api/?name=Hassan+Raza&background=059669&color=fff',
    bio: 'English Literature Student.',
    location: 'Multan, Pakistan',
    isVerified: false,
    rating: 4.7,
    skillsOffered: [
      { id: 'sk10', name: 'English', level: 'Expert' },
      { id: 'sk11', name: 'Content Writing', level: 'Expert' }
    ],
    skillsWanted: [
      { id: 'sk12', name: 'Web Development', level: 'Beginner' }
    ]
  }
];