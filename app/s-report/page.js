'use client';

import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Space, Alert, DatePicker, Row, Col, Select, Button, Tag } from 'antd'; // Add 'Tag' to the import statement
import DashboardLayout from '../components/DashboardLayout'; // Adjust the path as needed
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AttendanceByStudent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    // Fetch student data for the dropdown
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost/nextjs/attendance/getStudents.php'); // Make sure to create this endpoint
        const result = await response.json();
        if (response.ok) {
          setStudents(result);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'There was an error fetching students data.');
      }
    };

    fetchStudents();
  }, []);

  const fetchAttendanceByStudent = async () => {
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    setError(null);

    try {
      const fromDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
      const toDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
      const response = await fetch(
        `http://localhost/nextjs/attendance/getAttendanceByStudent.php?student_id=${selectedStudent}&from_date=${fromDate}&to_date=${toDate}`
      );
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'There was an error fetching attendance data.');
    }
  };

  const formatTime = (time) => {
    return time ? moment(time).format('hh:mm A') : '';
  };

  const columns = [
    {
      title: 'NAME',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'TRIBU',
      dataIndex: 'tribu',
      key: 'tribu',
    },
    {
      title: 'YEAR',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'IN',
      dataIndex: 'IN',
      key: 'IN',
      render: (text, record) => (
        <>
          {formatTime(text)}
          {record.is_late ? (
            <Tag color='red' style={{ marginLeft: 8 }}>
              Late
            </Tag>
          ) : null}
        </>
      ),
    },
    {
      title: 'OUT',
      dataIndex: 'OUT',
      key: 'OUT',
      render: (text, record) => (
        <>
          {formatTime(text)}
          {record.left_early ? (
            <Tag color='orange' style={{ marginLeft: 8 }}>
              Left Early
            </Tag>
          ) : null}
        </>
      ),
    },
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
  ];

  return (
    <DashboardLayout>
      <Card
        title={
          <Title level={1} style={{ textAlign: 'center', margin: 0, color: '#4CAF50' }}>
            Attendance by Student
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
        <Row gutter={16} style={{ marginBottom: '1rem' }}>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder='Select Student'
              onChange={(value) => setSelectedStudent(value)}
            >
              {students.map((student) => (
                <Option key={student.id} value={student.id}>
                  {student.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <RangePicker format='YYYY-MM-DD' onChange={(dates) => setDateRange(dates)} style={{ width: '100%' }} />
          </Col>
          <Col span={4}>
            <Button type='primary' onClick={fetchAttendanceByStudent} style={{ width: '100%' }}>
              Generate Report
            </Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={data}
          rowKey='date' // Assuming date is unique per student
          pagination={false}
          scroll={{ y: 'calc(80vh - 2rem)' }}
          style={{ flex: 1, overflowY: 'auto' }}
        />
      </Card>
    </DashboardLayout>
  );
};

export default AttendanceByStudent;
