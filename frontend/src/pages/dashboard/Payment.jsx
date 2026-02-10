import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, message, Statistic, Row, Col, Tabs } from 'antd';
import { DollarOutlined, ReloadOutlined, AccountBookOutlined, HistoryOutlined } from '@ant-design/icons';
import request from '../../utils/request';

const Payment = () => {
  const [activeTab, setActiveTab] = useState('unpaid');

  // === 状态管理 ===
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [unpaidLoading, setUnpaidLoading] = useState(false);

  const [historyOrders, setHistoryOrders] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // === 1. 获取待缴费订单 ===
  const fetchUnpaidOrders = async () => {
    setUnpaidLoading(true);
    try {
      const res = await request.get('/dashboard/payment/'); // 对应后端 GET /
      setUnpaidOrders(res.data || []);
    } catch (error) {
      message.error('获取待缴费订单失败');
    } finally {
      setUnpaidLoading(false);
    }
  };

  // === 2. 获取历史记录 ===
  const fetchHistoryOrders = async () => {
    setHistoryLoading(true);
    try {
      const res = await request.get('/dashboard/payment/history'); // 对应后端 GET /history
      // 后端返回结构可能是 { orders: [...] } 或 { data: [...] }，做个兼容
      setHistoryOrders(res.orders || res.data || []);
    } catch (error) {
      message.error('获取历史记录失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUnpaidOrders();
  }, []);

  // 切换 Tab 时自动刷新对应数据
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'unpaid') {
      fetchUnpaidOrders();
    } else {
      fetchHistoryOrders();
    }
  };

  // === 3. 确认收费逻辑 ===
  const handleConfirm = async (orderId) => {
    try {
      await request.post('/dashboard/payment/', { order_id: orderId });
      message.success('收费成功！');
      fetchUnpaidOrders(); // 刷新待缴费列表
    } catch (error) {
      const errorMsg = error.response?.data?.error || '收费失败';
      message.error(errorMsg);
    }
  };

  // === 列定义：待缴费 ===
  const unpaidColumns = [
    { title: '订单号', dataIndex: 'id', key: 'id' },
    { 
      title: '应收金额', 
      dataIndex: 'total_amount', 
      key: 'total_amount',
      render: (val) => <span style={{color: '#cf1322', fontWeight: 'bold'}}>¥ {val}</span>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: () => <Tag color="orange">待支付</Tag>
    },
    { 
      title: '创建时间', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          icon={<DollarOutlined />}
          onClick={() => handleConfirm(record.id)}
        >
          确认收款
        </Button>
      )
    }
  ];

  // === 列定义：历史记录 ===
  const historyColumns = [
    { title: '订单号', dataIndex: 'id', key: 'id' },
    { 
      title: '实收金额', 
      dataIndex: 'total_amount', 
      key: 'total_amount',
      render: (val) => <span style={{color: '#389e0d', fontWeight: 'bold'}}>¥ {val}</span>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: () => <Tag color="green">已缴费</Tag>
    },
    { 
      title: '支付时间', 
      dataIndex: 'updated_at', // 假设后端更新了 updated_at，或者显示 created_at
      key: 'time',
      render: (text) => new Date(text).toLocaleString()
    }
  ];

  // Tabs 配置
  const tabItems = [
    {
      key: 'unpaid',
      label: <span><AccountBookOutlined /> 待缴费订单 ({unpaidOrders.length})</span>,
      children: (
        <Table 
          rowKey="id" 
          dataSource={unpaidOrders} 
          columns={unpaidColumns} 
          loading={unpaidLoading}
          pagination={{ pageSize: 5 }} 
        />
      ),
    },
    {
      key: 'history',
      label: <span><HistoryOutlined /> 历史缴费记录</span>,
      children: (
        <Table 
          rowKey="id" 
          dataSource={historyOrders} 
          columns={historyColumns} 
          loading={historyLoading}
          pagination={{ pageSize: 8 }} 
        />
      ),
    },
  ];

  return (
    <div>
      {/* 顶部统计 (只统计待处理，给财务紧迫感) */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="待处理收款" 
              value={unpaidOrders.length} 
              prefix={<DollarOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="🏥 财务收银台" 
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => handleTabChange(activeTab)}>
            刷新当前列表
          </Button>
        }
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange} 
          items={tabItems} 
        />
      </Card>
    </div>
  );
};

export default Payment;