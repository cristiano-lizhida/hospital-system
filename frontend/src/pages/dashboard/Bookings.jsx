import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from '../../utils/request';

const Bookings = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    // 模拟表头
    const columns = [
        { title: '挂号ID', dataIndex: 'id', key: 'id' },
        { title: '患者姓名', dataIndex: 'patient_name', key: 'patient_name' },
        { title: '预约医生', dataIndex: 'doctor_name', key: 'doctor_name' },
        { title: '状态', dataIndex: 'status', key: 'status', render: text => <Tag color={text === 'pending' ? 'orange' : 'green'}>{text}</Tag> },
        { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
    ];

    useEffect(() => {
        // TODO: 调用 GET /api/v1/dashboard/bookings
    }, []);

    return (
        <Card title="预约挂号列表" extra={<Button type="primary" icon={<PlusOutlined />}>现场挂号</Button>}>
            <Table 
                rowKey="id" 
                columns={columns} 
                dataSource={list} 
                loading={loading} 
            />
        </Card>
    );
};
export default Bookings;