'use client';

import React, { useState, useEffect } from 'react';
import { ClockIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import moment from 'moment';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const [studentId, setStudentId] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsResponse = await axios.get('http://localhost/attendance/get_students.php');

        if (studentsResponse.status === 200) {
          const sortedStudents = studentsResponse.data.sort((a, b) => a.name.localeCompare(b.name));
          setStudents(sortedStudents);
        } else {
          throw new Error('Error fetching student data.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'There was an error fetching data.');
      }
    };

    fetchStudents();
  }, []);

  const handleTimeIn = async () => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const currentHour = moment().hour();

    // if (currentHour > 12) {
    //   alert("You can't check in after 12 PM.");
    //   return;
    // }

    try {
      const response = await axios.post('http://localhost/nextjs/attendance/time-in.php', {
        student_id: studentId,
        time: currentTime,
      });

      if (response.data.success) {
        alert(response.data.success);
        console.log(response.data);
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        throw new Error('Unknown error during Time In');
      }
    } catch (error) {
      console.error(error);
      alert('Error during Time In');
    }
  };

  const handleTimeOut = async () => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const currentHour = moment().hour();

    // if (currentHour < 12) {
    //   alert("You can't check out before 12 PM.");
    //   return;
    // }

    try {
      const response = await axios.post('http://localhost/nextjs/attendance/time-out.php', {
        student_id: studentId,
        time: currentTime,
      });

      if (response.data.success) {
        alert(response.data.success);
        console.log(response.data);
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        throw new Error('Unknown error during Time Out');
      }
    } catch (error) {
      console.error(error);
      alert('Error during Time Out');
    }
  };

  return (
    <DashboardLayout className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='max-w-md mx-auto'>
            <div>
              <h1 className='text-2xl font-semibold text-center text-gray-900'>Attendance</h1>
            </div>
            <div className='divide-y divide-gray-200'>
              <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                {error && (
                  <div
                    className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
                    role='alert'
                  >
                    <span className='block sm:inline'>{error}</span>
                  </div>
                )}
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Student Name</label>
                    <select
                      onChange={(e) => setStudentId(e.target.value)}
                      className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                    >
                      <option value=''>Select a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex space-x-4'>
                    <button
                      onClick={handleTimeIn}
                      className='flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                    >
                      <ClockIcon className='h-5 w-5 inline-block mr-2' />
                      Time In
                    </button>
                    <button
                      onClick={handleTimeOut}
                      className='flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                    >
                      <ArrowRightOnRectangleIcon className='h-5 w-5 inline-block mr-2' />
                      Time Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
