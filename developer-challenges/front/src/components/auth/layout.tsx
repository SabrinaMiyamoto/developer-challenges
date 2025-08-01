import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';

import { paths } from '@/paths';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        p: 3,
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 4 }}>
        <Box
          component={RouterLink}
          href={paths.home}
          sx={{ display: 'inline-block' }}
        >
          <Box
            component="img"
            src="/assets/assets-desafio-01/logo.png"
            alt="Logo Dynapredict"
            sx={{ height: '4rem', width: '4rem' }}
          />
        </Box>
      </Box>

      {/* Container dos dois formulários lado a lado */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: '1 1 auto',
          gap: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
