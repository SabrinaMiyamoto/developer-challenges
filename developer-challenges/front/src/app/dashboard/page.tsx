// src/app/dashboard/page.tsx
import * as React from 'react';
import { Grid, Box } from '@mui/material';
import MachineList from '@/components/machine/machine-list';
import MachineAddForm from '@/components/machine/machine-add-form';

export default function Page(): React.JSX.Element {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <MachineAddForm />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              width: '100%',
              minWidth: {
                md: '400px',
                lg: '500px', 
                xl: '600px', 
              },

            }}
          >
            <MachineList />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}