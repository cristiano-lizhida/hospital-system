import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { AccountBookOutlined } from '@ant-design/icons';

const Finance = () => {
    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card>
                        <Statistic title="今日总流水" value={112893} prefix="¥" />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="本月营收" value={8823} prefix={<AccountBookOutlined />} />
                    </Card>
                </Col>
            </Row>
            <Card title="近期流水明细">
                <Table columns={[{ title: '时间', dataIndex: 'time' }, { title: '金额', dataIndex: 'amount' }]} dataSource={[]} />
            </Card>
        </div>
    );
};
export default Finance;