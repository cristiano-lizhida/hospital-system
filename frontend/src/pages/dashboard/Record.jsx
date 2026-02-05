import React from 'react';
import { Table, Card, Input } from 'antd';

const Record = () => {

    return (
        <Card title="电子病历档案" extra={<Input.Search placeholder="搜索患者或诊断..." style={{ width: 200 }} />}>

        </Card>
    );
};
export default Record;