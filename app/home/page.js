'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout'; // Adjust the path as necessary
import { FaUsers, FaUserGraduate, FaUserTie, FaCalendarCheck } from 'react-icons/fa';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalTribus: 0,
    totalAttendance: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a fetch call with temporary data
        const tempData = {
          totalStudents: 1250,
          totalFaculty: 75,
          totalTribus: 20,
          totalAttendance: 3560,
        };
        setDashboardData(tempData);
      } catch (err) {
        setError('Failed to fetch data.');
      }
    };

    fetchData();
  }, []);

  const CountCard = ({ title, count, icon: Icon }) => (
    <div className='bg-white rounded-lg shadow-md p-6 flex items-center'>
      <div className='mr-4'>
        <Icon className='text-4xl text-[#9333ea]' />
      </div>
      <div>
        <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
        <p className='text-3xl font-bold text-[#9333ea]'>{count.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className='p-6 max-w-7xl mx-auto'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Dashboard Overview</h2>
        {error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <CountCard title='Total Students' count={dashboardData.totalStudents} icon={FaUserGraduate} />
            <CountCard title='Total Faculty' count={dashboardData.totalFaculty} icon={FaUserTie} />
            <CountCard title='Total Tribus' count={dashboardData.totalTribus} icon={FaUsers} />
            <CountCard title='Total Attendance' count={dashboardData.totalAttendance} icon={FaCalendarCheck} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
