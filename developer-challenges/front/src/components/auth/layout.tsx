import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', bgcolor: '#692746', fontSize: 0 }}>
            <Box
                component="img"
                src="/assets/assets-desafio-01/logo.png"
                alt="Logo Dynapredict"
                sx={{ height: '4rem', width:'4rem' }}
              />
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          color: '#3d3b3bff',
          background: '#f3eaeaff',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography color="inherit" sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
              Welcome to{' '}
              <Box component="span" sx={{ color: '#692746' }}>
              Dynamox
              </Box>
            </Typography>
            <Typography align="center" variant="subtitle1">
              Sua parceira no monitoramento da saúde e performance de ativos
            </Typography>
          </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography align="center" variant="body1" sx={{ maxWidth: 600 }}>
                O ecossistema Dynamox é uma solução integrada para otimização de
                performance, aumentando a confiabilidade e a disponibilidade de máquinas
                e componentes industriais.
              </Typography>
            </Box>
        </Stack>
      </Box>
    </Box>
  );
}
