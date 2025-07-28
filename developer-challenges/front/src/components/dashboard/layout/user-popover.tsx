// src/components/dashboard/layout/user-popover.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { logout } from '@/store/auth-slice';

import { paths } from '@/paths';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element | null {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    dispatch(logout());
    router.push(paths.auth.signIn);
  }, [dispatch, router]);

  // Se o Redux ainda não tem o usuário (por exemplo, logo após o logout), não renderize
  if (!user) {
    return null;
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px' }}>
        <Typography variant="subtitle1">{user.email}</Typography>
        <Typography color="text.secondary" variant="body2">
          Seu cargo
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: '8px' }}>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          <ListItemText>Sign out</ListItemText>
        </MenuItem>
      </Box>
    </Popover>
  );
}