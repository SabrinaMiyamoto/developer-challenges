'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';


import { paths } from '@/paths';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';


export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated } =useSelector((state: RootState) => state.auth)
  
 

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace(paths.auth.signIn)
    }
  }, [isAuthenticated,router])
    if (!isAuthenticated){
      return null
    }
    return <React.Fragment>{children}</React.Fragment>}
