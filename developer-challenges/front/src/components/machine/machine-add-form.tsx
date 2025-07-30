'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useCreateMachineMutation, useGetMachinesQuery } from '@/api/machines-api';
import { MachineType } from '@/types/machine';

const MACHINE_TYPE_OPTIONS = Object.values(MachineType);

const MachineAddForm = () => {
  // Busca as máquinas existentes da API mockada
  const { data: existingMachines = [] } = useGetMachinesQuery();
  const [createMachine, { isLoading }] = useCreateMachineMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    type: MACHINE_TYPE_OPTIONS[0] as MachineType
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({ ...prev, type: e.target.value as MachineType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showSnackbar('Por favor, insira um nome para a máquina', 'error');
      return;
    }

    // Verificação de duplicata usando a API mockada
    const isDuplicate = existingMachines.some(
      machine => 
        machine.name.toLowerCase() === formData.name.trim().toLowerCase() && 
        machine.type === formData.type
    );

    if (isDuplicate) {
      showSnackbar('Já existe uma máquina com este nome e tipo!', 'error');
      return;
    }

    try {
      await createMachine(formData).unwrap();
      showSnackbar(`Máquina "${formData.name}" criada com sucesso!`, 'success');
      resetForm();
    } catch (error) {
      showSnackbar('Erro ao criar máquina', 'error');
      console.error('Erro na criação:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: MACHINE_TYPE_OPTIONS[0]
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Card sx={{ p: 2, mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Adicionar Nova Máquina
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nome da Máquina"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ maxLength: 50 }}
            error={existingMachines.some(m => 
              m.name.toLowerCase() === formData.name.trim().toLowerCase() && 
              m.type === formData.type
            )}
            helperText={
              existingMachines.some(m => 
                m.name.toLowerCase() === formData.name.trim().toLowerCase() && 
                m.type === formData.type
              ) ? 'Já existe uma máquina com este nome e tipo!' : ''
            }
          />
          
          <TextField
            select
            label="Tipo da Máquina"
            value={formData.type}
            onChange={handleSelectChange}
            fullWidth
            required
          >
            {MACHINE_TYPE_OPTIONS.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 1 }}
          >
            {isLoading ? 'Salvando...' : 'Adicionar Máquina'}
          </Button>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MachineAddForm;