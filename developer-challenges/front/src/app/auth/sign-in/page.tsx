import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { Box, Divider, Stack } from '@mui/material';

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 6, md: 8 }}
          divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />} 
          sx={{
            justifyContent: 'center',
            alignItems: 'flex-start', 
            mt: 4,
            width: '100%', 
             maxWidth: 'lg',
            mx: 'auto',
            p: 2,
          }}
        >
          <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
            <SignInForm />
          </Box>
          <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
            <SignUpForm />
          </Box>
        </Stack>
      </GuestGuard>
    </Layout>
  );
}