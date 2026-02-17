import React from 'react';
import { Layout, Card, Row, Col, Typography, Button, Avatar, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// 模拟专家数据
const experts = [
  { id: 1, name: '李华', title: '主任医师', dept: '心血管内科', desc: '从事心血管临床工作30余年，擅长冠心病、高血压的诊治。', tags: ['专家号', '周一坐诊'] },
  { id: 2, name: '张伟', title: '副主任医师', dept: '神经外科', desc: '在微创神经外科手术方面有极高造诣，发表SCI论文10余篇。', tags: ['手术专家', '周三坐诊'] },
  { id: 3, name: '王芳', title: '主治医师', dept: '儿科', desc: '对小儿呼吸系统常见病、多发病有丰富的临床经验，深受家长信赖。', tags: ['耐心细致', '周五坐诊'] },
  { id: 4, name: '赵强', title: '主任医师', dept: '骨科', desc: '擅长脊柱外科及关节置换手术，曾获省级医疗进步奖。', tags: ['骨科权威', '周二/四坐诊'] },
  { id: 5, name: '孙梅', title: '副主任医师', dept: '妇产科', desc: '擅长高危妊娠管理及妇科内分泌疾病诊治。', tags: ['女性健康', '周四坐诊'] },
  { id: 6, name: '周杰', title: '主治医师', dept: '眼科', desc: '专注于青少年近视防控及白内障超声乳化手术。', tags: ['光明使者', '周六坐诊'] },
];

const Experts = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 顶部导航 */}
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>返回首页</Button>
        <Divider type="vertical" />
        <Title level={4} style={{ margin: '0 0 0 8px', color: '#1677ff' }}>专家团队介绍</Title>
        <div style={{ flex: 1 }} />
        <Button type="primary" onClick={() => navigate('/login')}>去挂号</Button>
      </Header>

      <Content style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <Title level={2}>汇聚名医，守护健康</Title>
            <Paragraph type="secondary" style={{ fontSize: 16 }}>我们拥有一支医德高尚、医术精湛的专业医疗团队，为您提供最优质的医疗服务。</Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {experts.map(expert => (
            <Col xs={24} sm={12} md={8} key={expert.id}>
              <Card 
                hoverable 
                style={{ borderRadius: 12, textAlign: 'center', height: '100%' }}
                cover={
                  <div style={{ background: '#e6f7ff', padding: '30px 0' }}>
                      <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', fontSize: 50 }} />
                  </div>
                }
              >
                <Title level={4} style={{ marginBottom: 4 }}>{expert.name}</Title>
                <Tag color="blue">{expert.title}</Tag>
                <Tag color="cyan">{expert.dept}</Tag>
                
                <Paragraph style={{ margin: '20px 0', minHeight: 66, color: '#666', textAlign: 'left' }} ellipsis={{ rows: 3 }}>
                    {expert.desc}
                </Paragraph>
                
                <div style={{ marginBottom: 20 }}>
                    {expert.tags.map(tag => <Tag key={tag} color="geekblue" style={{ marginBottom: 4 }}>{tag}</Tag>)}
                </div>
                
                <Button type="primary" ghost block onClick={() => navigate('/login')}>
                    预约{expert.name}医生
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
        智慧医疗系统 ©2026
      </Footer>
    </Layout>
  );
};

export default Experts;