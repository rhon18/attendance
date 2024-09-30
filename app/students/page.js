'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { notification, Button, Input, Select, Table, Space, Alert, Form, Typography, Card } from 'antd';
import DashboardLayout from '../components/DashboardLayout'; // Adjust the path as needed

const { Option } = Select;
const { Title } = Typography;

const StudentForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tribuModalOpen, setTribuModalOpen] = useState(false); // State for tribu modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tribuOptions, setTribuOptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    studentId: '',
    contact: '',
    tribu: '',
    yearLevel: '',
  });
  const [form] = Form.useForm(); // Create form instance

  useEffect(() => {
    const fetchTribuOptions = async () => {
      try {
        const response = await fetch('http://localhost/attendance/getTribuOptions.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok) {
          setTribuOptions(Array.isArray(result) ? result : []);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error fetching TRIBU options:', error);
        notification.error({
          message: 'Error',
          description: error.message || 'There was an error fetching TRIBU options.',
        });
      }
    };

    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost/nextjs/attendance/getStudentRecords.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok) {
          setRecords(Array.isArray(result) ? result : []);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error fetching student records:', error);
        notification.error({
          message: 'Error',
          description: error.message || 'There was an error fetching student records.',
        });
      }
    };

    fetchTribuOptions();
    fetchRecords();
  }, []);

  const yearLevelOptions = [
    { id: '1', level: '1st Year' },
    { id: '2', level: '2nd Year' },
    { id: '3', level: '3rd Year' },
    { id: '4', level: '4th Year' },
  ];

  const handleStudentSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/nextjs/attendance/saveStudentDetails.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      const result = await response.json();
      if (response.ok) {
        notification.success({
          message: 'Success',
          description: 'Student details saved successfully!',
        });
        setFormValues({
          name: '',
          studentId: '',
          contact: '',
          tribu: '',
          yearLevel: '',
        });
        // Refresh records after saving
        const updatedRecords = await fetch('http://localhost/nextjs/attendance/getStudentRecords.php')
          .then((response) => response.json())
          .then((result) => (response.ok ? result : []));
        setRecords(updatedRecords);
        setIsOpen(false); // Close the student form modal
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'There was an error saving the student details.');
      notification.error({
        message: 'Error',
        description: error.message || 'There was an error saving the student details.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTribuSubmit = async (values) => {
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
        setTribuModalOpen(false); // Close the tribu modal
        // Refresh tribu options after saving
        const updatedTribuOptions = await fetch('http://localhost/nextjs/attendance/getTribuOptions.php')
          .then((response) => response.json())
          .then((result) => (response.ok ? result : []));
        setTribuOptions(updatedTribuOptions);
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

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'TRIBU',
      dataIndex: 'tribu_name',
      key: 'tribu_name',
    },
    {
      title: 'Year Level',
      dataIndex: 'year_level',
      key: 'year_level',
      render: (text) => yearLevelOptions.find((option) => option.id === text)?.level || text,
    },
  ];

  return (
    <DashboardLayout>
      <div className='p-4 bg-gray-100 h-screen'>
        <div className='mb-4 flex space-x-2'>
          <Button
            onClick={() => setIsOpen(true)}
            className='bg-[#9333ea] border-[#9333ea] text-white hover:bg-[#7e22ce]'
          >
            Add Student
          </Button>
          <Button
            onClick={() => setTribuModalOpen(true)} // Open tribu modal
            className='bg-[#9333ea] border-[#9333ea] text-white hover:bg-[#7e22ce]'
          >
            Add Tribu
          </Button>
        </div>

        <Table
          dataSource={records}
          columns={columns}
          rowKey='student_id'
          pagination={false}
          scroll={{ x: '100%', y: 'calc(80vh - 15rem)' }}
          className='bg-white shadow-md rounded-lg'
        />

        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <Dialog.Panel className='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg'>
              {error && (
                <Space direction='vertical' style={{ width: '100%', marginBottom: '1rem' }}>
                  <Alert message={error} type='error' showIcon />
                </Space>
              )}
              <h2 className='text-xl font-semibold mb-4'>Add Student</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStudentSubmit();
                }}
              >
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Full Name</label>
                    <Input
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
                      placeholder='Enter full name'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Student ID</label>
                    <Input
                      value={formValues.studentId}
                      onChange={(e) => setFormValues({ ...formValues, studentId: e.target.value })}
                      className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
                      placeholder='Enter student ID'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <label className='block text-sm font-medium text-gray-700'>Contact Information</label>
                  <Input
                    value={formValues.contact}
                    onChange={(e) => setFormValues({ ...formValues, contact: e.target.value })}
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
                    placeholder='Enter contact information'
                  />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>TRIBU</label>
                    <Select
                      value={formValues.tribu}
                      onChange={(value) => setFormValues({ ...formValues, tribu: value })}
                      className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
                      placeholder='Select TRIBU'
                    >
                      {tribuOptions.map((tribu) => (
                        <Option key={tribu.id} value={tribu.id}>
                          {tribu.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Year Level</label>
                    <Select
                      value={formValues.yearLevel}
                      onChange={(value) => setFormValues({ ...formValues, yearLevel: value })}
                      className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
                      placeholder='Select Year Level'
                    >
                      {yearLevelOptions.map((year) => (
                        <Option key={year.id} value={year.id}>
                          {year.level}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className='flex justify-end mt-4'>
                  <Button
                    type='button'
                    className='mr-2 bg-gray-500 text-white hover:bg-gray-600'
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='bg-[#9333ea] text-white hover:bg-[#7e22ce]'
                    loading={loading}
                    onClick={() => handleStudentSubmit()}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Tribu Modal */}
        <Dialog open={tribuModalOpen} onClose={() => setTribuModalOpen(false)}>
          <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <Dialog.Panel className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg'>
              <Title level={2} className='mb-4'>
                Add Tribu
              </Title>
              <Form form={form} onFinish={handleTribuSubmit} layout='vertical'>
                {error && (
                  <Space direction='vertical' style={{ width: '100%', marginBottom: '1rem' }}>
                    <Alert message={error} type='error' showIcon />
                  </Space>
                )}
                <Form.Item
                  name='tribuName'
                  label='Tribu Name'
                  rules={[{ required: true, message: 'Please enter the tribu name!' }]}
                >
                  <Input placeholder='Enter tribu name' />
                </Form.Item>
                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={loading}
                    className='w-full'
                    style={{ backgroundColor: '#9333ea', borderColor: '#9333ea' }}
                  >
                    Add Tribu
                  </Button>
                </Form.Item>
              </Form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StudentForm;
