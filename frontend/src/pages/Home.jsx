import React from 'react';
import { Layout, Button, Card, Row, Col, Typography, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    MedicineBoxOutlined,
    SafetyCertificateOutlined,
    ArrowRightOutlined,
    HeartOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
    const navigate = useNavigate();

    // 模拟医院设施与医生数据
    const features = [
        { title: '先进医疗设施', desc: '配备最新一代核磁共振(MRI)与达芬奇手术机器人。', icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1677ff' }} /> },
        { title: '资深专家团队', desc: '汇聚省内外知名专家，覆盖内、外、妇、儿等全科室。', icon: <UserOutlined style={{ fontSize: 24, color: '#1677ff' }} /> },
        { title: '便捷就医流程', desc: '全流程数字化管理，支持在线预约挂号、缴费与查报告。', icon: <MedicineBoxOutlined style={{ fontSize: 24, color: '#1677ff' }} /> }
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            {/* 顶部导航 */}
            <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <HeartOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginRight: '8px' }} />
                    <Title level={4} style={{ margin: 0 }}>智慧医疗系统</Title>
                </div>
                <Space>
                    <Button type="text" onClick={() => navigate('/login')}>关于我们</Button>
                    <Button type="text" onClick={() => navigate('/experts')}>专家团队</Button>
                    <Button type="primary" onClick={() => navigate('/login')}>登录</Button>
                    <Button onClick={() => navigate('/register')}>注册</Button>
                </Space>
            </Header>

            <Content>
                {/* Hero Section: 医院概况展示 */}
                <div style={{ background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)', padding: '80px 0', textAlign: 'center', color: '#fff' }}>
                    <Title style={{ color: '#fff', fontSize: '48px' }}>守护生命，智慧医疗</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', maxWidth: '800px', margin: '0 auto 40px' }}>
                        本系统由安徽建筑大学团队研发，旨在为患者提供高效的就医体验，为医生提供精准的工作辅助，实现医疗资源的高效分配。
                    </Paragraph>
                    <Button type="primary" size="large" shape="round" icon={<ArrowRightOutlined />} onClick={() => navigate('/login')}>
                        立即开启就医之旅
                    </Button>
                </div>

                {/* 核心功能入口 */}
                <div style={{ maxWidth: '1200px', margin: '-40px auto 0', padding: '0 20px 60px' }}>
                    <Row gutter={[24, 24]}>
                        {features.map((item, index) => (
                            <Col xs={24} md={8} key={index}>
                                <Card hoverable style={{ textAlign: 'center', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    <div style={{ marginBottom: '16px' }}>{item.icon}</div>
                                    <Title level={4}>{item.title}</Title>
                                    <Paragraph type="secondary">{item.desc}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Divider style={{ margin: '60px 0' }} />

                    {/* 角色引导区域 */}
                    <Title level={3} style={{ textAlign: 'center', marginBottom: '40px' }}>多角色协同办公</Title>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card title="挂号员" bordered={false} className="role-card" extra={<a href="/login">进入</a>}>
                                管理窗口挂号与预约分诊。
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card title="临床医生" bordered={false} className="role-card" extra={<a href="/login">进入</a>}>
                                电子病历、诊断开方与检查。
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card title="财务收费" bordered={false} className="role-card" extra={<a href="/login">进入</a>}>
                                订单结算与收银管理。
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card title="物资管理" bordered={false} className="role-card" extra={<a href="/login">进入</a>}>
                                药品库存进销存管理。
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
                智慧医疗管理系统 ©2026 基于 Go + React + SQLite 构建
            </Footer>
        </Layout>
    );
};

export default Home;