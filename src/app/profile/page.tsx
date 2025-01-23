"use client";
import { getUserByClerkId } from '@/lib/actions/events.action';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';

const Profile: React.FC = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [editable, setEditable] = useState(false);

  // Fetch user data by Clerk ID
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const response = await getUserByClerkId(userId); // Update this endpoint to match your backend
        setUser(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = () => {
    alert('Update functionality to be implemented!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={user.profile || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md"
            />
          </div>

          {/* First Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300">First Name</label>
            <input
              type="text"
              value={user.firstName || ''}
              disabled={!editable}
              className={`mt-1 w-full px-3 py-2 rounded-md bg-gray-700 ${
                editable ? 'border border-cyan-500' : 'border-none'
              } text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Last Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300">Last Name</label>
            <input
              type="text"
              value={user.lastName || ''}
              disabled={!editable}
              className={`mt-1 w-full px-3 py-2 rounded-md bg-gray-700 ${
                editable ? 'border border-cyan-500' : 'border-none'
              } text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="mt-1 w-full px-3 py-2 rounded-md bg-gray-700 text-gray-400 shadow-sm border-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setEditable((prev) => !prev)}
              className="px-4 py-2 text-sm font-medium bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {editable ? 'Cancel' : 'Edit'}
            </button>
            {editable && (
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
