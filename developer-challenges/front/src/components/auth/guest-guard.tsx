'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

import { paths } from '@/paths';



export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(paths.dashboard.overview);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}