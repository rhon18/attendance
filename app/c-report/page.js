'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, Space, Alert } from 'antd';
import DashboardLayout from '../components/DashboardLayout'; // Adjust the path as needed

const { Title, Text } = Typography;

const CombinedReports = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/nextjs/attendance/getCombinedReports.php');
        const result = await response.json();
        if (response.ok) {
          setAttendanceData(result);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'There was an error fetching combined reports data.');
      }
    };

    fetchData();
  }, []);

  const renderAttendance = (attendanceData) => {
    return Object.entries(attendanceData).map(([tribu, yearLevels]) => (
      <div key={tribu}>
        <Title level={3}>{tribu}</Title>
        {Object.entries(yearLevels).map(([yearLevel, dates]) => (
          <div key={yearLevel}>
            <Text strong>{yearLevel} Year</Text>
            {Object.entries(dates).map(([date, records]) => (
              <div key={date} style={{ margin: '10px 0' }}>
                <Text strong>{date}</Text>
                <table style={{ width: '100%', margin: '10px 0' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>NAME</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>IN</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>OUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px' }}>{record.name}</td>
                        <td style={{ padding: '8px' }}>{record.in}</td>
                        <td style={{ padding: '8px' }}>{record.out}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <DashboardLayout>
      <Card
        title={
          <Title level={1} style={{ textAlign: 'center', margin: 0, color: '#4CAF50' }}>
            COMBINED REPORTS (Tribu/Year Level)
          </Title>
        }
        bordered={false}
        style={{ height: '80vh', padding: '1.5rem', boxShadow: 'none', display: 'flex', flexDirection: 'column' }}
      >
        {error && (
          <Space direction='vertical' style={{ width: '100%', marginBottom: '1rem' }}>
            <Alert message={error} type='error' showIcon style={{ marginTop: '16px' }} />
          </Space>
        )}
        {renderAttendance(attendanceData)}
      </Card>
    </DashboardLayout>
  );
};

export default CombinedReports;
