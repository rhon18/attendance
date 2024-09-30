'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaUserAlt, FaLock } from 'react-icons/fa';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/attendance/login.php', { adminId, password });

      // Log the response from the server
      console.log('Response from server:', response.data);

      if (response.data.success) {
        // Redirect to the home page on successful login
        router.push('/home');
      } else {
        // Display the error message from the server
        setError(response.data.message);
      }
    } catch (err) {
      // Log any error that occurred during the request
      console.error('An error occurred:', err.response ? err.response.data : err.message);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-sm p-8 bg-white rounded-lg shadow-lg border border-gray-300'>
        <div className='text-center mb-6'>
          <h2 className='text-3xl font-bold text-[#9333ea]'>Admin Login</h2>
        </div>
        <form onSubmit={handleLogin} className='space-y-6'>
          <div>
            <label htmlFor='adminId' className='block text-sm font-medium text-gray-700 mb-2'>
              Admin ID
            </label>
            <div className='relative'>
              <input
                id='adminId'
                type='text'
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder='Enter Admin ID'
                className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea]'
              />
              <FaUserAlt className='absolute top-3 right-3 text-gray-500' />
            </div>
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <div className='relative'>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter Password'
                className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea]'
              />
              <FaLock className='absolute top-3 right-3 text-gray-500' />
            </div>
          </div>
          <button
            type='submit'
            className='w-full py-2 px-4 bg-[#9333ea] text-white rounded-md shadow-sm hover:bg-[#7e2d8b] focus:outline-none focus:ring-2 focus:ring-[#9333ea]'
          >
            Login
          </button>
        </form>
        {error && <div className='mt-4 text-red-600 text-center'>{error}</div>}
      </div>
    </div>
  );
};

export default AdminLogin;
