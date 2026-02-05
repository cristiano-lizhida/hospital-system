import React from 'react';
import { Row, Col, Card, List, Form, Input, Button, Select, Tag } from 'antd';

const Doctor = () => {
    return (
        <div style={{ height: 'calc(100vh - 120px)' }}>
            <Row gutter={16} style={{ height: '100%' }}>
                {/* 左侧：候诊列表 */}
                <Col span={6} style={{ height: '100%' }}>
                    <Card title="候诊患者 (Pending)" style={{ height: '100%', overflowY: 'auto' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={[{name: '张三', id: 1}, {name: '李四', id: 2}]}
                            renderItem={item => (
                                <List.Item actions={[<a>接诊</a>]}>
                                    <List.Item.Meta
                                        title={item.name}
                                        description={<Tag color="blue">排号: A0{item.id}</Tag>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* 中间：病历编辑 */}
                <Col span={12} style={{ height: '100%' }}>
                    <Card title="正在接诊：张三" style={{ height: '100%' }}>
                        <Form layout="vertical">
                            <Form.Item label="患者主诉" required>
                                <Input.TextArea rows={4} placeholder="患者描述的症状..." />
                            </Form.Item>
                            <Form.Item label="初步诊断" required>
                                <Input.TextArea rows={4} placeholder="医生的判断..." />
                            </Form.Item>
                            <Button type="primary" block size="large">提交病历并生成订单</Button>
                        </Form>
                    </Card>
                </Col>

                {/* 右侧：处方/药品库 */}
                <Col span={6} style={{ height: '100%' }}>
                    <Card title="开具处方" style={{ height: '100%' }}>
                        <Form.Item label="选择药品">
                            <Select placeholder="搜索药品..." />
                        </Form.Item>
                        <Form.Item label="数量">
                            <Input type="number" />
                        </Form.Item>
                        <Button type="dashed" block>+ 添加药品</Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default Doctor;