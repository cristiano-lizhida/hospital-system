import { useEffect, useState, useCallback } from 'react';
import { 
  Table, Card, Button, Modal, Form, Input, InputNumber, 
  Tag, message, Tabs, Space, Popconfirm, Select, Tooltip 
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  MedicineBoxOutlined, 
  ToolOutlined, 
  ExperimentOutlined, 
  AppstoreOutlined 
} from '@ant-design/icons';
import request from '../../utils/request';

const { Option } = Select;
const { Search } = Input;

const Storehouse = () => {
  // === 状态管理 ===
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // 当前编辑的对象
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchText, setSearchText] = useState('');

  const [form] = Form.useForm();

  // === 1. 获取库存列表 (核心逻辑) ===
  const fetchInventory = useCallback(async (category = activeCategory, search = searchText) => {
    setLoading(true);
    try {
      // 构造查询参数
      const params = {};
      if (category !== '全部') params.category = category;
      if (search) params.search = search;

      const res = await request.get('/dashboard/storehouse', { params });
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
      message.error('获取库存列表失败');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchText]); // 依赖项明确

  // === 2. 监听筛选条件变化 ===
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]); // 当 fetchInventory 变化时（即筛选条件变了）自动执行

  // === 3. 提交表单 (新增或编辑) ===
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        // 编辑模式
        await request.put(`/dashboard/storehouse/${editingItem.id}`, values);
        message.success('物资信息更新成功');
      } else {
        // 新增模式 (后端会自动合并同名同类项)
        const res = await request.post('/dashboard/storehouse', values);
        if (res.msg && res.msg.includes('合并')) {
            message.info(`已检测到同名物资，库存已自动合并！`);
        } else {
            message.success('新物资入库成功！');
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      fetchInventory(); // 刷新列表
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    }
  };

  // === 4. 删除物资 ===
  const handleDelete = async (id) => {
    try {
      await request.delete(`/dashboard/storehouse/${id}`);
      message.success('删除成功');
      fetchInventory();
    } catch (error) {
      console.log(error)
      message.error('删除失败');
    }
  };

  // 打开编辑弹窗
  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    // 默认分类跟随当前 Tab，如果是“全部”则默认“药品”
    form.setFieldsValue({ 
        category: activeCategory === '全部' ? '药品' : activeCategory 
    });
    setIsModalOpen(true);
  };

  // === UI 配置 ===
  const categoryTabs = [
    { label: <span><AppstoreOutlined /> 全部</span>, key: '全部' },
    { label: <span><MedicineBoxOutlined /> 药品</span>, key: '药品' },
    { label: <span><ToolOutlined /> 医疗器械</span>, key: '医疗器械' },
    { label: <span><ExperimentOutlined /> 卫生用品</span>, key: '卫生用品' },
    { label: '其他', key: '其他' },
  ];

  const columns = [
    { 
        title: '名称', 
        dataIndex: 'name', 
        key: 'name',
        render: (text, record) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>{text}</span>
                <span style={{ fontSize: '12px', color: '#999' }}>{record.description || '无规格描述'}</span>
            </div>
        )
    },
    { 
        title: '分类', 
        dataIndex: 'category', 
        key: 'category',
        render: (tag) => {
            let color = 'default';
            if (tag === '药品') color = 'blue';
            if (tag === '医疗器械') color = 'cyan';
            if (tag === '卫生用品') color = 'green';
            return <Tag color={color}>{tag}</Tag>;
        }
    },
    { 
        title: '单价', 
        dataIndex: 'price', 
        key: 'price',
        render: (val) => `¥ ${val ? val.toFixed(2) : '0.00'}`
    },
    { 
        title: '库存', 
        dataIndex: 'stock', 
        key: 'stock',
        render: (val) => (
            <Tag color={val < 10 ? 'red' : (val < 50 ? 'orange' : 'green')}>
                {val} {val < 10 && '(紧缺)'}
            </Tag>
        )
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Tooltip title="编辑信息">
                    <Button 
                        type="text" 
                        icon={<EditOutlined style={{ color: '#1890ff' }} />} 
                        onClick={() => handleEdit(record)} 
                    />
                </Tooltip>
                <Popconfirm 
                    title="确定删除该物资吗？" 
                    onConfirm={() => handleDelete(record.id)}
                    okText="删除"
                    cancelText="取消"
                >
                    <Tooltip title="删除物资">
                        <Button type="text" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
                    </Tooltip>
                </Popconfirm>
            </Space>
        )
    }
  ];

  return (
    <Card 
        title="📦 医院物资总库" 
        extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                物资入库
            </Button>
        }
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Tabs 
            activeKey={activeCategory} 
            onChange={setActiveCategory} 
            items={categoryTabs}
            style={{ marginBottom: -16, flex: 1 }}
        />
        <Space>
            <Search
                placeholder="搜索物资名称..."
                onSearch={val => setSearchText(val)}
                onChange={e => e.target.value === '' && setSearchText('')} // 清空时自动重置
                style={{ width: 250 }}
                allowClear
            />
        </Space>
      </div>

      <Table 
        rowKey="id" 
        dataSource={items} 
        columns={columns} 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* 新增/编辑 模态框 */}
      <Modal 
        title={editingItem ? "编辑物资信息" : "物资采购入库"} 
        open={isModalOpen} 
        onOk={handleSubmit} 
        onCancel={() => setIsModalOpen(false)}
        okText={editingItem ? "保存修改" : "确认入库"}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="物资名称" 
            rules={[{ required: true, message: '请输入名称' }]}
            help={!editingItem && "提示：如果名称和分类与现有物资一致，将自动合并库存"}
          >
            <Input placeholder="例如：N95口罩 / 阿莫西林" />
          </Form.Item>
          
          <Form.Item 
            name="category" 
            label="物资分类" 
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select>
                <Option value="药品">药品</Option>
                <Option value="医疗器械">医疗器械</Option>
                <Option value="卫生用品">卫生用品</Option>
                <Option value="其他">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="规格/描述">
            <Input placeholder="例如：500mg*24粒 / 独立包装" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item 
                name="price" 
                label="销售单价 (元)" 
                rules={[{ required: true }]}
                style={{ flex: 1 }}
            >
                <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item 
                name="stock" 
                label={editingItem ? "当前库存" : "入库数量"} 
                rules={[{ required: true }]}
                style={{ flex: 1 }}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          {/* OrgID 隐藏字段，默认 1 */}
          <Form.Item name="org_id" hidden initialValue={1}><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Storehouse;