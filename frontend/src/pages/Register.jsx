import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../utils/request';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                role: 'general_user',
                org_id: 1
            };

            // 使用 request 实例，会自动指向 /api/v1/register
            await request.post('/register', payload);

            message.success('注册成功！');
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.error || '注册失败';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
            <Card style={{ width: 450, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2} style={{ color: '#1677ff', marginBottom: 8 }}>注册</Title>
                    <Text type="secondary">创建您的健康档案，开启便捷就医</Text>
                </div>

                <Form name="register_form" onFinish={onFinish} size="large" layout="vertical">
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用于登录的账号" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="设置密码"
                        rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '请再次输入密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不匹配'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            立即注册
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/login')}>
                            返回登录
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;