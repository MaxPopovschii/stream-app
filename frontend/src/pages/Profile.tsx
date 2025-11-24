import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/users/users/profile');
      setProfile(response.data);
      setDisplayName(response.data.displayName || '');
      setBio(response.data.bio || '');
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/api/users/users/profile', {
        displayName,
        bio
      });
      setEditing(false);
      fetchProfile();
      alert('Profile updated!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-light rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

          <div className="space-y-6">
            {/* User Info */}
            <div className="border-b border-dark-lighter pb-6">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="text-gray-500">Email: </span>
                  {user?.email}
                </div>
                <div>
                  <span className="text-gray-500">Member since: </span>
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
                <div className="space-y-3 text-gray-300 mb-6">
                  <div>
                    <span className="text-gray-500">Display Name: </span>
                    {profile?.displayName || 'Not set'}
                  </div>
                  <div>
                    <span className="text-gray-500">Bio: </span>
                    {profile?.bio || 'No bio yet'}
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="btn-primary">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
