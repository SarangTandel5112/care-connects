import { MouseEvent, ReactNode } from 'react';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  FolderOutlined,
  SettingOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';

/**
 * Menu Item Interface
 * Defines the structure of each navigation menu item
 */
export interface MenuItem {
  label: ReactNode;
  icon: ReactNode;
  path?: string;
  onClick?: (event: MouseEvent) => void;
}

/**
 * Navigation Menu Items
 * Centralized configuration for sidebar navigation
 */
export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
    path: '/dashboard',
  },
  {
    label: 'Appointments',
    icon: <CalendarOutlined style={{ fontSize: '18px' }} />,
    path: '/appointments',
  },
  {
    label: 'Patients',
    icon: <TeamOutlined style={{ fontSize: '18px' }} />,
    path: '/patients',
  },
  {
    label: 'Consultation',
    icon: <MedicineBoxOutlined style={{ fontSize: '18px' }} />,
    path: '/consultations',
  },
  {
    label: 'Templates',
    icon: <FolderOutlined style={{ fontSize: '18px' }} />,
    path: '/templates',
  },
];

// Bottom menu items (Settings)
export const bottomMenuItems: MenuItem[] = [
  {
    label: 'Settings',
    icon: <SettingOutlined style={{ fontSize: '18px' }} />,
    path: '/settings',
  },
];
