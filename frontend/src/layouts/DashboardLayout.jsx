import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Dropdown, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { menuConfig } from '../config/menuConfig';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    // 1. 从本地存储获取用户信息 (这些是在登录成功后存入的)
    const userRole = localStorage.getItem('role') || 'general_user';
    const username = localStorage.getItem('username') || '未登录用户';

    // 2. 根据角色过滤菜单项
    const authorizedItems = menuConfig
        .filter(item => item.roles.includes(userRole))
        .map(item => ({
            key: item.path,
            icon: item.icon,
            label: item.label,
        }));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const userMenuItems = [
        { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)' }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#1677ff' }}>
                    {collapsed ? 'logo' : 'logo 智慧医院系统'}
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    selectedKeys={[location.pathname]}
                    items={authorizedItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    <Dropdown menu={{ items: userMenuItems }}>
                        <Space style={{ cursor: 'pointer' }}>
                            <UserOutlined />
                            <span>{username} ({userRole})</span>
                        </Space>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'initial' }}>
                    {/* Outlet 是子路由渲染的占位符 */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;