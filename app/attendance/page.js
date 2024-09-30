'use client';

import React, { useState, useEffect } from 'react';
import { Table, Input, DatePicker, Alert, Space } from 'antd';
import DashboardLayout from '../components/DashboardLayout'; // Adjust the path as needed
import moment from 'moment';

const AttendanceTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [tribuFilter, setTribuFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Fetch all attendance data (no filters)
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/attendance/getAttendanceData.php');
        const result = await response.json();
        if (response.ok) {
          setData(result);
          setFilteredData(result); // Set filteredData initially to all data
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'There was an error fetching attendance data.');
      }
    };

    fetchData();
  }, []);

  const formatTime = (time) => {
    return time ? moment(time).format('hh:mm A') : '';
  };

  const columns = [
    {
      title: (
        <div className='flex flex-col'>
          <span>Name</span>
          <Input
            placeholder='Search'
            onChange={(e) => setNameFilter(e.target.value)}
            className='mt-1 border-[#9333ea] border rounded-md'
          />
        </div>
      ),
      dataIndex: 'student_name',
      key: 'student_name',
      render: (text) => <span className='text-gray-700'>{text}</span>,
    },
    {
      title: (
        <div className='flex flex-col'>
          <span>Tribu</span>
          <Input
            placeholder='Search'
            onChange={(e) => setTribuFilter(e.target.value)}
            className='mt-1 border-[#9333ea] border rounded-md'
          />
        </div>
      ),
      dataIndex: 'tribu',
      key: 'tribu',
      render: (text) => <span className='text-gray-700'>{text}</span>,
    },
    {
      title: (
        <div className='flex flex-col'>
          <span>Year</span>
          <Input
            placeholder='Search'
            onChange={(e) => setYearFilter(e.target.value)}
            className='mt-1 border-[#9333ea] border rounded-md'
          />
        </div>
      ),
      dataIndex: 'year',
      key: 'year',
      render: (text) => <span className='text-gray-700'>{text}</span>,
    },
    {
      title: 'CHECK IN',
      dataIndex: 'IN',
      key: 'IN',
      render: (text) => <span className='text-gray-700'>{formatTime(text)}</span>,
    },
    {
      title: 'CHECK OUT',
      dataIndex: 'OUT',
      key: 'OUT',
      render: (text) => <span className='text-gray-700'>{formatTime(text)}</span>,
    },
    {
      title: 'DATE CHECKED IN/OUT',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span className='text-gray-700'>{moment(text).format('YYYY-MM-DD')}</span>,
    },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : null);
  };

  const filterData = () => {
    let newFilteredData = data;

    // Apply date filter
    if (selectedDate) {
      newFilteredData = newFilteredData.filter((item) => moment(item.date).format('YYYY-MM-DD') === selectedDate);
    }

    // Apply column filters
    if (nameFilter) {
      newFilteredData = newFilteredData.filter((item) =>
        item.student_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (tribuFilter) {
      newFilteredData = newFilteredData.filter((item) => item.tribu.toLowerCase().includes(tribuFilter.toLowerCase()));
    }
    if (yearFilter) {
      newFilteredData = newFilteredData.filter((item) =>
        String(item.year).toLowerCase().includes(yearFilter.toLowerCase())
      );
    }

    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    filterData();
  }, [selectedDate, nameFilter, tribuFilter, yearFilter, data]);

  return (
    <DashboardLayout>
      <div className='p-4 bg-gray-100 h-screen'>
        <div className='mb-4'>
          <span className='text-xl font-semibold text-[#9333ea]'>Attendance</span>
        </div>
        {error && (
          <Space direction='vertical' style={{ width: '100%', marginBottom: '1rem' }}>
            <Alert message={error} type='error' showIcon />
          </Space>
        )}
        <div className='mb-4'>
          <DatePicker
            format='YYYY-MM-DD'
            onChange={handleDateChange}
            className='w-full border-[#9333ea] border rounded-md'
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData} // Use filteredData instead of data
          rowKey='student_name' // Change this to 'student_id' if you have a unique ID field
          pagination={false}
          scroll={{ y: 'calc(80vh - 2rem)' }}
          className='bg-white shadow-md rounded-lg'
        />
      </div>
    </DashboardLayout>
  );
};

export default AttendanceTable;
