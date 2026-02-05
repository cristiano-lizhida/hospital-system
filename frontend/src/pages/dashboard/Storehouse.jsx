import React from 'react';
import { Table, Button, Card, Statistic } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Storehouse = () => {
    const columns = [
        { title: '药品ID', dataIndex: 'id' },
        { title: '药品名称', dataIndex: 'name' },
        { title: '当前库存', dataIndex: 'stock', sorter: (a, b) => a.stock - b.stock },
        { title: '单价', dataIndex: 'price' },
    ];

    return (
        <Card title="药品库存管理" extra={<Button type="primary" icon={<PlusOutlined />}>新增入库</Button>}>
            <Table rowKey="id" columns={columns} dataSource={[]} />
        </Card>
    );
};
export default Storehouse;