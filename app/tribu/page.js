'use client';

import React from 'react';
import { Form, Button, Card, Input, Typography, Alert, Space } from 'antd';
import { notification } from 'antd';
import DashboardLayout from '../components/DashboardLayout'; // Adjust the path as needed
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported

const { Title } = Typography;

const AddTribuType = () => {
  const [form] = Form.useForm(); // Initialize form instance
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/nextjs/attendance/saveTribuType.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TribuName: values.tribuName }),
      });
      const result = await response.json();
      if (response.ok) {
        notification.success({
          message: 'Success',
          description: 'Tribu type added successfully!',
        });
        form.resetFields(); // Clear input fields after successful submission
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      notification.error({
        message: 'Error',
        description: error.message || 'There was an error adding the tribu type.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout className='mt-5'>
      <Card
        title={
          <Title level={1} style={{ textAlign: 'center', margin: 0, color: '#4CAF50' }}>
            Add Tribu Type
          </Title>
        }
        bordered={false}
        style={{ maxWidth: '600px', margin: 'auto', padding: '1.5rem', backgroundColor: '#f0f2f5' }}
      >
        {error && (
          <Space direction='vertical' style={{ width: '100%', marginBottom: '1rem' }}>
            <Alert message={error} type='error' showIcon style={{ marginTop: '16px' }} />
          </Space>
        )}
        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Form.Item
            name='tribuName'
            label='Tribu Name:'
            rules={[{ required: true, message: 'Please enter the tribu name!' }]}
          >
            <Input
              placeholder='Enter tribu name'
              style={{
                borderColor: '#4CAF50',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: 'black',
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='w-100'
              loading={loading}
              style={{
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
                borderRadius: '4px',
              }}
            >
              Add Tribu Type
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </DashboardLayout>
  );
};

export default AddTribuType;
