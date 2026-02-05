import React, { useState } from 'react';
import { Table, Button, Card, Popconfirm, message } from 'antd';
import { PayCircleOutlined } from '@ant-design/icons';

const Payment = () => {
    const [orders, setOrders] = useState([]);

    const handlePay = (orderId) => {
        message.success(`订单 ${orderId} 支付成功，库存已扣减`);
        // TODO: 调用 POST /api/v1/dashboard/payment/pay
    };

    const columns = [
        { title: '订单号', dataIndex: 'id' },
        { title: '关联挂号', dataIndex: 'booking_id' },
        { title: '金额 (¥)', dataIndex: 'total_amount', render: val => `¥ ${val}` },
        { title: '状态', dataIndex: 'status' },
        { 
            title: '操作', 
            key: 'action',
            render: (_, record) => (
                <Popconfirm title="确认收费？" onConfirm={() => handlePay(record.id)}>
                    <Button type="primary" size="small" icon={<PayCircleOutlined />}>收费</Button>
                </Popconfirm>
            )
        },
    ];

    return (
        <Card title="待缴费订单 (Unpaid)">
            <Table rowKey="id" columns={columns} dataSource={orders} />
        </Card>
    );
};
export default Payment;