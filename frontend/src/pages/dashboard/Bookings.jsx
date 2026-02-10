import { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, InputNumber, Tag, message, Avatar } from 'antd';
import { PlusOutlined, UserOutlined, PhoneOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import request from '../../utils/request';

const { Option } = Select;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]); // 1. 新增：存储医生列表
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 获取当前用户信息
  const userRole = localStorage.getItem('role');
  const currentUsername = localStorage.getItem('username');

  // === 1. 获取挂号列表 ===
  const fetchBookings = async () => {
    try {
      const res = await request.get('/dashboard/bookings');
      // 🔥 现在的 res.data 已经是后端根据权限过滤好的数据了
      // 这里的 || [] 是为了防止 null
      setBookings(res.data || []); 
    } catch (error) {
      message.error('获取列表失败');
    }
  };

  // === 2. 获取医生列表 ===
  const fetchDoctors = async () => {
    try {
      // 🔥 调用后端新写的专用接口，不需要权限很大的 /users 接口了
      const res = await request.get('/dashboard/doctors'); 
      setDoctors(res.data || []);
    } catch (error) {
      console.error("获取医生列表失败", error);
    }
  };

useEffect(() => {
    // 定义一个内部自执行的异步函数
    const initData = async () => {
        try {
            // 同时发起两个请求，提高效率
            await Promise.all([
                fetchBookings(),
                fetchDoctors()
            ]);
        } catch (err) {
            console.error("初始化数据失败:", err);
        }
    };

    initData();
}, []); // 确保依赖数组为空，只在挂载时执行一次

  // === 打开弹窗时的初始化逻辑 ===
  const handleOpenModal = () => {
    setIsModalOpen(true);
    // 如果是普通用户，强制填入自己的名字
    if (userRole === 'general_user') {
      form.setFieldsValue({ patient_name: currentUsername });
    }
  };

  // === 3. 提交挂号 ===
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await request.post('/dashboard/bookings', values);
      message.success('🎉 挂号成功！');
      setIsModalOpen(false);
      form.resetFields();
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: '挂号ID', dataIndex: 'id', key: 'id' },
    { title: '患者姓名', dataIndex: 'patient_name', key: 'patient_name', render: t => <b>{t}</b> },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    { title: '科室', dataIndex: 'department', key: 'department', render: t => <Tag color="blue">{t}</Tag> },
    {
      title: '指定医生',
      dataIndex: 'doctor_id',
      key: 'doctor_id',
      render: (id) => {
        // 在医生列表中查找名字
        const doc = doctors.find(d => d.id === id);
        return doc ? <Tag icon={<MedicineBoxOutlined />} color="cyan">{doc.username}</Tag> : '未指定';
      }
    },
    { title: '状态', dataIndex: 'status', key: 'status', render: t => <Tag color={t === 'Pending' ? 'orange' : 'green'}>{t === 'Pending' ? '候诊中' : '已就诊'}</Tag> },
    { title: '挂号时间', dataIndex: 'created_at', key: 'created_at', render: t => new Date(t).toLocaleString() },
  ];

  return (
    <Card title="🏥 门诊挂号大厅" extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
        {userRole === 'general_user' ? '我要挂号' : '现场挂号登记'}
      </Button>
    }>
      <Table rowKey="id" dataSource={bookings} columns={columns} />

      <Modal title="填写挂号单" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">

          {/* 🔥 核心修改：根据角色控制姓名输入框 */}
          <Form.Item name="patient_name" label="患者姓名" rules={[{ required: true }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入姓名"
              disabled={userRole === 'general_user'} // 如果是患者，禁用输入
            />
          </Form.Item>

          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Select><Option value="男">男</Option><Option value="女">女</Option></Select>
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <InputNumber min={1} max={120} style={{ width: '100%' }} />
          </Form.Item>

          {/* 🔥 新增：选择医生 */}
          <Form.Item name="doctor_id" label="选择医生" rules={[{ required: true, message: '请选择医生' }]}>
            <Select placeholder="请选择就诊医生">
              {doctors.map(doc => (
                <Option key={doc.id} value={doc.id}>
                  {doc.username} (ID: {doc.id})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="department" label="挂号科室" rules={[{ required: true }]}>
            <Select>
              <Option value="内科">内科 (Internal Med)</Option>
              <Option value="外科">外科 (Surgery)</Option>
              <Option value="儿科">儿科 (Pediatrics)</Option>
              <Option value="骨科">骨科 (Orthopedics)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Bookings;