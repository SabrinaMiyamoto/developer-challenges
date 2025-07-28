'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import { useCreateMachineMutation } from '@/api/machines-api';
import { MachineType } from '@/types/machine';

interface ApiErrorWithData {
  data?: {
    message?: string;
  };
  status?: number;
}

interface ApiErrorWithErrorString {
  error: string;
}
function isErrorWithData(error: unknown): error is ApiErrorWithData {
  return typeof error === 'object' && error != null && 'data' in error;
}

function isErrorWithErrorString(error: unknown): error is ApiErrorWithErrorString {
  return typeof error === 'object' && error != null && 'error' in error && typeof (error as ApiErrorWithErrorString).error === 'string';
}

const MACHINE_TYPE_OPTIONS = Object.values(MachineType);

const MachineAddForm = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<MachineType>(MACHINE_TYPE_OPTIONS[0]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isSubmitting, setSubmitting] = useState(false);

  const [createMachine, { isLoading, isSuccess, isError, error }] = useCreateMachineMutation();

  useEffect(() => {
    if (isSuccess) {
      setSnackbarMessage('Máquina adicionada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setName('');
      setType(MACHINE_TYPE_OPTIONS[0]);
    }
    if (isError) {
      let errorMessage = 'Erro desconhecido ao adicionar máquina.';
      if (isErrorWithData(error)) {
        errorMessage = error.data?.message ?? errorMessage;
      } else if (isErrorWithErrorString(error)) {
        errorMessage = error.error;
      }

      setSnackbarMessage(`Erro: ${errorMessage}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Erro na criação da máquina:', error);
    }
  }, [isSuccess, isError, error]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !type) {
      setSnackbarMessage('Por favor, preencha todos os campos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      setSubmitting(true);
      const result = await createMachine({ name, type }).unwrap();

      setSnackbarMessage(`Máquina cadastrada com sucesso!\nNome: ${result.name}\nTipo: ${result.type}`);
      setSnackbarSeverity('success');
      setName('');
      setType(MACHINE_TYPE_OPTIONS[0]);
    } catch (error_) {
      const apiError = error_ as ApiErrorWithData; 
      const errorMessage = apiError?.data?.message ?? 'Erro ao cadastrar máquina';
      console.error('Erro no cadastro:', {
        message: apiError.data?.message,
        status: apiError.status,
        error: error_
      });
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
    } finally {
      setSubmitting(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Card sx={{ p: 2, mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Adicionar Nova Máquina
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome da Máquina"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            select
            label="Tipo da Máquina"
            variant="outlined"
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value as MachineType)}
            required
            autoComplete="off"
          >
            {MACHINE_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Máquina'}
          </Button>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MachineAddForm;