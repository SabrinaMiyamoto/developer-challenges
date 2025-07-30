import type { NavItemConfig } from '@/types/nav';


export const navItems: NavItemConfig[] = [
  {
    key: 'overview',
    title: 'Overview',
    href: '/',
    icon: 'ChartBarIcon',
  },
  {
    key: 'account',
    title: 'Account',
    href: '/dashboard/account',
    icon: 'UserIcon', 
  },
  {
    key: 'monitoring-points',
    title: 'Pontos de Monitoramento',
    href: '/dashboard/monitoring-points',
    icon: 'WifiIcon',
  },
];