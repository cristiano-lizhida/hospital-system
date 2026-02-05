import {
    Home, UserPlus, Stethoscope, CreditCard,
    Package, FileText, Settings
} from 'lucide-react';
import { ROLES } from './roles';

export const menuConfig = [
    {
        path: 'overview',
        label: '概览',
        icon: <Home size={18} />,
        roles: Object.values(ROLES)
    },
    {
        path: 'bookings',
        label: '预约挂号',
        icon: <UserPlus size={18} />,
        roles: [ROLES.GENERAL_USER, ROLES.REGISTRATION]
    },
    {
        path: 'doctor',
        label: '医生工作台',
        icon: <Stethoscope size={18} />,
        roles: [ROLES.DOCTOR]
    },
    {
        path: 'payment',
        label: '缴费中心',
        icon: <CreditCard size={18} />,
        roles: [ROLES.GENERAL_USER]
    },
    {
        path: 'storehouse',
        label: '物资库房',
        icon: <Package size={18} />,
        roles: [ROLES.STOREKEEPER]
    },
    {
        path: 'record',
        label: '记录',
        icon: <FileText size={18} />,
        roles: Object.values(ROLES)
    },
    {
        path: 'users',
        label: '账号管理',
        icon: <Settings size={18} />,
        roles: [ROLES.ORG_ADMIN, ROLES.GLOBAL_ADMIN]
    }
];