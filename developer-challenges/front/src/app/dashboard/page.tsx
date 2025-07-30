import * as React from 'react';
import { Grid, Box } from '@mui/material';
import MachineList from '@/components/machine/machine-list';
import MachineAddForm from '@/components/machine/machine-add-form';

export default function Page(): React.JSX.Element {
  return (
    <Box sx={{ p: 2 }}> 
      <Grid container spacing={12}>
        <Grid item xs={12} md={8}>
          <MachineAddForm />
        </Grid>
        <Grid item xs={12}>
          <MachineList />
        </Grid>
      </Grid>
    </Box>
  )}