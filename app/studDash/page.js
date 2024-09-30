'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, Spin, Layout, Space, Alert, Dropdown, Menu, Table, Tag } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get('http://localhost/nextjs/attendance/studentInfo.php', {
          withCredentials: true,
        });
        if (response.data.success) {
          setStudent(response.data.student);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost/nextjs/attendance/studentAttendance.php', {
          withCredentials: true,
        });

        console.log(response.data); // Log the raw data

        if (Array.isArray(response.data)) {
          setAttendance(response.data);
        } else {
          setError('Unexpected response structure.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching attendance data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
    fetchAttendanceData();
  }, []);

  const handleLogout = () => {
    router.push('/'); // Navigate to the home page
  };

  const menu = (
    <Menu>
      <Menu.Item key='logout' onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const formatTime = (time) => {
    if (!time) return 'Not Checked Out';
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'DATE',
      key: 'DATE',
    },
    {
      title: 'IN',
      dataIndex: 'IN',
      key: 'IN',
      render: (text) => formatTime(text),
    },
    {
      title: 'OUT',
      dataIndex: 'OUT',
      key: 'OUT',
      render: (text) => formatTime(text) || '—', // Display a placeholder if OUT is blank
    },
    {
      title: 'Status',
      key: 'status',
      render: (text, record) => (
        <>
          {record.is_late ? (
            <Tag color='red' style={{ marginRight: 8 }}>
              Late
            </Tag>
          ) : (
            <Tag color='green' style={{ marginRight: 8 }}>
              Arrived on Time
            </Tag>
          )}
          {record.left_early ? (
            <Tag color='orange'>Left Early</Tag>
          ) : (
            record.OUT && <Tag color='blue'>Left on Time</Tag>
          )}
        </>
      ),
    },
  ];

  if (loading) {
    return <Spin size='large' style={{ display: 'block', margin: 'auto', marginTop: '20%' }} />;
  }

  if (error) {
    return (
      <Layout>
        <Space direction='vertical' style={{ width: '100%', marginBottom: '1rem' }}>
          <Alert message={error} type='error' showIcon style={{ marginTop: '16px' }} />
        </Space>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        className='header'
        style={{
          background: '#4CAF50',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1,
          transition: 'z-index 0.3s ease',
          margin: '24px',
          borderRadius: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flexGrow: 1 }} /> {/* Spacer to push the icon to the right */}
        <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Avatar icon={<SettingOutlined />} style={{ marginRight: '8px', color: '#fff' }} />
              <span style={{ color: '#fff' }}>{loading ? 'Loading...' : student?.name || 'Student'}</span>
            </div>
          </div>
        </Dropdown>
      </Header>
      <Content>
        <Card
          bordered={false}
          style={{
            height: '80vh',
            padding: '1.5rem',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Avatar
              size={100}
              src={`https://robohash.org/${student?.student_id}.png`}
              style={{ marginBottom: '20px' }}
            />
            <Title level={2}>{student?.name}</Title>
            <Text type='secondary'>{student?.student_id}</Text>
            <div style={{ marginTop: '10px' }}>
              <Text strong>Tribu: </Text>
              <Text>{student?.tribu_name}</Text>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Text strong>Year Level: </Text>
              <Text>{student?.year_level}</Text>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Text strong>Contact: </Text>
              <Text>{student?.contact}</Text>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={attendance}
            rowKey={(record) => record.IN} // Use a unique identifier for rows
            pagination={false}
            scroll={{ y: 'calc(80vh - 2rem)' }}
            style={{ flex: 1, overflowY: 'auto' }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default StudentDashboard;
