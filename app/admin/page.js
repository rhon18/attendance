'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost/nextjs/attendance/login.php', { adminId, password });

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
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', color: '#4CAF50' }}>
          Admin Login
        </Title>
        <Form layout='vertical' onFinish={handleLogin}>
          <Form.Item
            label='Admin ID'
            name='adminId'
            rules={[{ required: true, message: 'Please enter your Admin ID!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder='Enter Admin ID'
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please enter your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter Password'
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              style={{
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
                borderRadius: '4px',
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        {error && <Alert message={error} type='error' showIcon style={{ marginTop: '16px' }} />}
      </Card>
    </div>
  );
};

export default AdminLogin;
