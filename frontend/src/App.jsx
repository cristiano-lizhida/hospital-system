import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // 需新建，见下方
import DashboardLayout from './layouts/DashboardLayout';

// 公开页面组件
import Home from './pages/Home'; // 包含概况、医生、设施等入口
import Login from './pages/Login';
import Register from './pages/Register';

// 业务页面组件
import Overview from './pages/dashboard/Overview';
import Bookings from './pages/dashboard/Bookings';
import Payment from './pages/dashboard/Payment';
import Record from './pages/dashboard/Record';
import Doctor from './pages/dashboard/Doctor';
import Storehouse from './pages/dashboard/Storehouse';
import Finance from './pages/dashboard/Finance';
import Users from './pages/dashboard/Users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 公开入口 (对应你的设计图第一部分) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. 受保护的 Dashboard (对应设计图第二部分) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* 通用子路由 */}
          <Route path="overview" element={<Overview />} />
          <Route path="record" element={<Record />} />

          {/* 角色专属子路由 (根据你的设计图分配权限) */}
          <Route path="bookings" element={
            <ProtectedRoute allowedRoles={['registration', 'org_admin', 'global_admin']}>
              <Bookings />
            </ProtectedRoute>
          } />

          <Route path="doctor" element={
            <ProtectedRoute allowedRoles={['doctor', 'global_admin']}>
              <Doctor />
            </ProtectedRoute>
          } />

          <Route path="payment" element={
            <ProtectedRoute allowedRoles={['finance', 'org_admin', 'global_admin', 'general_user']}>
              <Payment />
            </ProtectedRoute>
          } />

          <Route path="storehouse" element={
            <ProtectedRoute allowedRoles={['storekeeper', 'org_admin', 'global_admin']}>
              <Storehouse />
            </ProtectedRoute>
          } />

          <Route path="users" element={
            <ProtectedRoute allowedRoles={['org_admin', 'global_admin']}>
              <Users />
            </ProtectedRoute>
          } />
        </Route>

        {/* 通配符：找不到路径时重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;