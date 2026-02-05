import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 1. 检查是否登录
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. 检查角色权限
    if (allowedRoles && !allowedRoles.includes(role)) {
        // 权限不足时跳转到通用概览页
        return <Navigate to="/dashboard/overview" replace />;
    }

    return children;
};

export default ProtectedRoute;