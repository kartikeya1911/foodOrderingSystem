import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userService, restaurantService } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    if (authUser?.role === 'RESTAURANT_OWNER') {
      fetchRestaurants();
    }
  }, [authUser]);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const data = await restaurantService.getMyRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">Failed to load profile</p>
            <button 
              onClick={fetchProfile}
              className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="max-w-2xl bg-white rounded-lg shadow-md p-6">
          {editing ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  rows="3"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-1">Username</label>
                <p className="text-lg font-semibold">{profile.username}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                <p className="text-lg font-semibold">{profile.fullName}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                <p className="text-lg font-semibold">{profile.email}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-1">Phone</label>
                <p className="text-lg font-semibold">{profile.phone || 'Not provided'}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-1">Address</label>
                <p className="text-lg font-semibold">{profile.address || 'Not provided'}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-1">Role</label>
                <p className="text-lg font-semibold">{profile.role}</p>
              </div>
              
              {profile.role === 'RESTAURANT_OWNER' && restaurants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-gray-600 text-sm mb-2">My Restaurants</label>
                  <div className="space-y-2">
                    {restaurants.map(restaurant => (
                      <div key={restaurant.id} className="border rounded p-3 bg-gray-50">
                        <p className="font-semibold">{restaurant.name}</p>
                        <p className="text-sm text-gray-600">{restaurant.cuisine} • ⭐ {restaurant.rating?.toFixed(1) || 'New'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setEditing(true)}
                className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
