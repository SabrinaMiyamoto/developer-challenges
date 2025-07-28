import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Image from 'next/image';

import DynamoxLogo from '../../../public/assets/assets-desafio-01/logo-dynamox.png';
import { Traffic } from '@/components/dashboard/overview/traffic';
import MachineList from '@/components/machine/machine-list';
import MachineAddForm from '@/components/machine/machine-add-form'; 
import Paper from '@mui/material/Paper';

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      {/* Seção da logo */}
      <Grid item  xs={12}>
        <Paper>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 2 }}>
          <Image
            src={DynamoxLogo}
            alt="Dynamox Logo"
            priority
            width={60}
            height={60}
            style={{ borderRadius: '8px', marginRight: '16px' }}
          />
        </Box>
        </Paper>
      </Grid>


      <Grid item lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={4} md={6} xs={12}>

      </Grid>
      <Grid item lg={8} md={12} xs={12}>
        
      </Grid>

      {/* Grid para o nosso MachineList */}
      <Grid item xs={12}>
        <MachineList />
      </Grid>

      {/* NOVO: Grid para o formulário de adição de máquinas */}
      <Grid item xs={12}>
        <MachineAddForm />
      </Grid>
    </Grid>
  );
}
