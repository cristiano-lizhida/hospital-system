import { useEffect, useState } from 'react';
import { Table, Card, Tag, message, Avatar, Button, Modal, Form, Input, Select } from 'antd';
import { UserOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import request from '../../utils/request';

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 1. 获取人员名单
  const fetchUsers = async () => {
    try {
      const res = await request.get('/dashboard/users');
      setUsers(res.data || []);
    } catch (error) {
      message.error('获取用户名单失败');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. 提交新增用户
  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      await request.post('/dashboard/users', values);
      
      message.success('🎉 用户账号创建成功！');
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers(); // 刷新表格
    } catch (error) {
        const errorMsg = error.response?.data?.error || '创建失败';
        message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    'global_admin': 'magenta',
    'org_admin': 'red',
    'doctor': 'blue',
    'registration': 'cyan',
    'finance': 'gold',
    'storekeeper': 'purple',
    'general_user': 'default'
  };

  const roleNames = {
    'global_admin': '超级管理员',
    'org_admin': '院区负责人',
    'doctor': '医生',
    'registration': '挂号员',
    'finance': '财务',
    'storekeeper': '库管员',
    'general_user': '患者'
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { 
      title: '用户名', 
      dataIndex: 'username', 
      key: 'username',
      render: text => <b>{text}</b>
    },
    { 
      title: '角色身份', 
      dataIndex: 'role', 
      key: 'role',
      render: role => (
        <Tag color={roleColors[role] || 'default'}>
          {roleNames[role] || role}
        </Tag>
      )
    },
    { title: '注册时间', dataIndex: 'created_at', key: 'created_at', render: t => new Date(t).toLocaleDateString() },
  ];

  return (
    <Card 
      title="👥 医院人员编制管理" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          新增用户
        </Button>
      }
    >
      <Table rowKey="id" dataSource={users} columns={columns} pagination={{ pageSize: 8 }} />

      {/* 新增用户弹窗 */}
      <Modal 
        title="📝 录入新用户信息" 
        open={isModalOpen} 
        onOk={handleCreate} 
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="登录账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input prefix={<UserOutlined />} placeholder="例如：doctor_li" />
          </Form.Item>
          
          <Form.Item name="password" label="初始密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="建议设置为复杂密码" />
          </Form.Item>

          <Form.Item name="role" label="分配岗位" rules={[{ required: true, message: '请选择岗位角色' }]}>
            <Select placeholder="请选择角色">
              <Option value="doctor">临床医生 (Doctor)</Option>
              <Option value="registration">挂号员 (Registration)</Option>
              <Option value="finance">财务 (Finance)</Option>
              <Option value="storekeeper">库房管理员 (Storekeeper)</Option>
              <Option value="org_admin">院区管理者 (Org Admin)</Option>
              {/* 通常不在这里创建 global_admin 或 general_user */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Users;