'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { FaBars, FaTimes, FaHome, FaUserPlus, FaCog, FaClock, FaUsers, FaFileAlt } from 'react-icons/fa';

const SidebarContent = ({ collapsed, handleLogout, handleProfile, handleSettings }) => (
  <div className='h-full flex flex-col'>
    <div className={`p-6 ${collapsed ? 'text-center' : ''} bg-[#9333ea] text-white`}>
      {!collapsed ? (
        <h5 className='text-lg font-semibold'>Attendance Monitoring System</h5>
      ) : (
        <FaClock className='h-10 w-10' />
      )}
    </div>
    <nav className='flex-1'>
      <ul className='space-y-2 py-4'>
        {[
          { href: '/home', icon: FaHome, text: 'Dashboard' },
          { href: '/students', icon: FaUserPlus, text: 'Students' },
          // { href: '/tribu', icon: FaUsers, text: 'Add Tribu' },
          { href: '/checking', icon: FaClock, text: 'Check In/Out' },
          { href: '/attendance', icon: FaFileAlt, text: 'Attendance Table' },
        ].map(({ href, icon: Icon, text }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center p-2 text-gray-700 hover:bg-purple-600 hover:text-white ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && <span>{text}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    <div className='p-6 bg-[#9333ea] text-white mt-auto'>
      <button
        onClick={handleLogout}
        aria-label='Logout'
        className='flex items-center p-2 text-white hover:bg-purple-700 w-full mt-2'
      >
        <FaHome className='h-5 w-5 mr-2' />
        Logout
      </button>
    </div>
  </div>
);

const Dashboard = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('http://localhost/pets/username.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.username) setUsername(data.username);
        else console.error(data.error || 'Failed to fetch username');
      } catch (error) {
        console.error('Error fetching username:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setVisible(!visible);
    else setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar for desktop */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'} ${
          isMobile ? 'hidden' : 'block'
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          handleLogout={handleLogout}
          handleProfile={handleProfile}
          handleSettings={handleSettings}
        />
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Page content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-100 to-[#9333ea] p-6'>
          {children}
        </main>
      </div>

      {/* Mobile sidebar */}
      {isMobile && visible && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-75 z-50'>
          <div className='fixed inset-y-0 left-0 w-64 bg-white shadow-xl'>
            <div className='flex justify-end p-4'>
              <button
                onClick={() => setVisible(false)}
                aria-label='Close menu'
                className='text-gray-500 hover:text-gray-700'
              >
                <FaTimes className='h-6 w-6' />
              </button>
            </div>
            <SidebarContent
              collapsed={false}
              handleLogout={handleLogout}
              handleProfile={handleProfile}
              handleSettings={handleSettings}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
