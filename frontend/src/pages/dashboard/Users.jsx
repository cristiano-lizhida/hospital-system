import React from 'react';
import { Table, Tag, Button, Card, Switch } from 'antd';

const Users = () => {
    const columns = [
        { title: '用户ID', dataIndex: 'id' },
        { title: '用户名', dataIndex: 'username' },
        { title: '角色', dataIndex: 'role', render: role => <Tag color="blue">{role}</Tag> },
        { title: '所属机构', dataIndex: 'org_id' },
        { title: '状态', render: () => <Switch defaultChecked /> },
        { title: '操作', render: () => <a>编辑</a> },
    ];

    return (
        <Card title="系统人员管理">
            <Table rowKey="id" columns={columns} dataSource={[]} />
        </Card>
    );
};
export default Users;