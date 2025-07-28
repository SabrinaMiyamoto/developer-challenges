// src/components/dashboard/layout/config.ts (ou .tsx)

import type { NavItemConfig } from '@/types/nav';
// Não importe os componentes de ícone aqui se você for usar strings
// import { ChartBarIcon, UsersIcon, UserIcon, WifiIcon } from '@heroicons/react/24/solid';

export const navItems: NavItemConfig[] = [
  {
    key: 'overview',
    title: 'Overview',
    href: '/',
    icon: 'ChartBarIcon', // MUDANÇA AQUI: de (<ChartBarIcon />) para 'ChartBarIcon' (uma string)
  },
  {
    key: 'account',
    title: 'Account',
    href: '/dashboard/account',
    icon: 'UserIcon', // MUDANÇA AQUI
  },
  {
    key: 'monitoring-points',
    title: 'Pontos de Monitoramento',
    href: '/dashboard/monitoring-points',
    icon: 'WifiIcon', // MUDANÇA AQUI
  },
];