import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const Overview = () => {
    return (
        <div>
            <h2 style={{ marginBottom: 20 }}>🏥 系统概览</h2>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic title="今日挂号量" value={112} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="待处理订单" value={5} prefix={<ShoppingCartOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="药品库存预警" value={2} valueStyle={{ color: '#cf1322' }} prefix={<MedicineBoxOutlined />} />
                    </Card>
                </Col>
            </Row>
            
            <Card style={{ marginTop: 20 }} title="快捷公告">
                <p>欢迎登录智慧医院管理系统。请根据左侧菜单选择您的工作台。</p>
            </Card>
        </div>
    );
};
export default Overview;