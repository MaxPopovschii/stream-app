import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { FiCamera, FiEdit2, FiCheck, FiX, FiTrendingUp, FiClock, FiHeart } from 'react-icons/fi';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2',
  'https://api.dicebear.com/7.x/personas/svg?seed=Person1',
  'https://api.dicebear.com/7.x/personas/svg?seed=Person2',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Emma',
];

export default function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
      setDisplayName(response.data.displayName || '');
      setBio(response.data.bio || '');
      setAvatarUrl(response.data.avatarUrl || AVATAR_PRESETS[0]);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', {
        displayName,
        bio,
        avatarUrl
      });
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarSelect = (url: string) => {
    setAvatarUrl(url);
    setShowAvatarPicker(false);
  };

  const handleCustomAvatarSubmit = () => {
    if (customAvatarUrl) {
      setAvatarUrl(customAvatarUrl);
      setCustomAvatarUrl('');
      setShowAvatarPicker(false);
    }
  };

  const getInitials = () => {
    if (displayName) return displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="min-h-screen pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Section con Gradient Background moderno */}
      <div className="relative h-72 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 rounded-3xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-5xl mx-auto -mt-48 relative z-10">
        <div className="glass rounded-3xl shadow-elegant-lg border border-white/10">
          {/* Avatar and Basic Info */}
          <div className="p-8 border-b border-white/10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/50 shadow-glow">
                  <img 
                    src={avatarUrl || AVATAR_PRESETS[0]} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = AVATAR_PRESETS[0];
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-secondary p-3 rounded-full shadow-elegant transition transform hover:scale-110"
                >
                  <FiCamera size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">
                  {profile?.displayName || user?.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-gray-400 mb-4 font-light">{user?.email}</p>
                <p className="text-gray-300 max-w-2xl font-light leading-relaxed">
                  {profile?.bio || 'No bio yet. Click edit to add one!'}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-4 py-2 glass rounded-full text-sm font-medium">
                    <FiClock className="inline mr-2" size={16} />
                    Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiEdit2 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Avatar Picker Modal */}
          {showAvatarPicker && (
            <div className="p-6 border-b border-white/10 bg-dark-light/30">
              <h3 className="text-xl font-semibold mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-6">
                {AVATAR_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(preset)}
                    className={`w-full aspect-square rounded-full overflow-hidden ring-2 transition transform hover:scale-110 ${
                      avatarUrl === preset ? 'ring-primary shadow-glow' : 'ring-white/20 hover:ring-primary/50'
                    }`}
                  >
                    <img src={preset} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste custom avatar URL..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="input flex-1"
                />
                <button onClick={handleCustomAvatarSubmit} className="btn-primary">
                  Use URL
                </button>
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-bold mb-6">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <FiHeart className="text-primary mb-3 group-hover:scale-110 transition-transform" size={28} />
                <div className="text-3xl font-bold mb-1">0</div>
                <div className="text-gray-400 text-sm font-light">Videos in Watchlist</div>
              </div>
              <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <FiClock className="text-accent mb-3 group-hover:scale-110 transition-transform" size={28} />
                <div className="text-3xl font-bold mb-1">0h</div>
                <div className="text-gray-400 text-sm font-light">Watch Time</div>
              </div>
              <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <FiTrendingUp className="text-secondary mb-3 group-hover:scale-110 transition-transform" size={28} />
                <div className="text-3xl font-bold mb-1">0</div>
                <div className="text-gray-400 text-sm font-light">Videos Watched</div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="p-8">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="input resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <FiCheck size={18} />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setDisplayName(profile?.displayName || '');
                      setBio(profile?.bio || '');
                      setAvatarUrl(profile?.avatarUrl || AVATAR_PRESETS[0]);
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FiX size={18} />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
