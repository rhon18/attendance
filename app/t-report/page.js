'use client';

import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Space, Alert } from 'antd';
import DashboardLayout from '../components/DashboardLayout'; // Adjust the path as needed

const { Title } = Typography;

const AttendanceByTribu = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/attendance/getAttendanceByTribu.php');
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'There was an error fetching tribu attendance data.');
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'TRIBU',
      dataIndex: 'tribu',
      key: 'tribu',
    },
    {
      title: 'Total Attendance',
      dataIndex: 'total_attendance',
      key: 'total_attendance',
    },
    {
      title: 'Late',
      dataIndex: 'total_late',
      key: 'total_late',
    },
    {
      title: 'Left Early',
      dataIndex: 'total_left_early',
      key: 'total_left_early',
    },
  ];

  return (
    <DashboardLayout>
      <Card
        title={
          <Title level={1} style={{ textAlign: 'center', margin: 0, color: '#4CAF50' }}>
            ATTENDANCE BY TRIBU
          </Title>
        }
        bordered={false}
        style={{
          height: '80vh',
          padding: '1.5rem',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {error && (
          <Space direction='vertical' style={{ width: '100%', marginBottom: '1rem' }}>
            <Alert message={error} type='error' showIcon style={{ marginTop: '16px' }} />
          </Space>
        )}
        <Table
          columns={columns}
          dataSource={data}
          rowKey='tribu'
          pagination={false}
          scroll={{ y: 'calc(80vh - 2rem)' }}
          style={{ flex: 1, overflowY: 'auto' }}
        />
      </Card>
    </DashboardLayout>
  );
};

export default AttendanceByTribu;
