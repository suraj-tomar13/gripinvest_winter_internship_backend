import React, { useState, useEffect } from 'react';
import { auth } from '../api/api';

const ProfilePage = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    risk_appetite: 'moderate'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch user details from the API
    // For now, we'll use mock data
    setUser({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      risk_appetite: 'moderate'
    });
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      // In a real app, you would call an API to update user profile
      // await auth.updateProfile(user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getRiskDescription = (risk) => {
    switch (risk) {
      case 'low':
        return 'Conservative approach with stable, low-risk investments';
      case 'moderate':
        return 'Balanced approach with mix of stable and growth investments';
      case 'high':
        return 'Aggressive approach with high-growth potential investments';
      default:
        return 'Risk appetite not set';
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
      
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{message}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Personal Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Appetite
            </label>
            <select
              name="risk_appetite"
              value={user.risk_appetite}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {getRiskDescription(user.risk_appetite)}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">AI Recommendations</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Portfolio Optimization</h3>
            <p className="text-blue-700">
              Based on your {user.risk_appetite} risk appetite, consider diversifying your portfolio 
              with a mix of {user.risk_appetite === 'low' ? 'government bonds and fixed deposits' : 
              user.risk_appetite === 'moderate' ? 'balanced mutual funds and corporate bonds' : 
              'growth stocks and high-yield investments'}.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Investment Strategy</h3>
            <p className="text-green-700">
              For your risk profile, we recommend a {user.risk_appetite === 'low' ? 'conservative' : 
              user.risk_appetite === 'moderate' ? 'balanced' : 'aggressive'} investment strategy 
              focusing on {user.risk_appetite === 'low' ? 'capital preservation' : 
              user.risk_appetite === 'moderate' ? 'steady growth' : 'maximum returns'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;