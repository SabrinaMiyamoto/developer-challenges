'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Machine, MachineType } from '@/types/machine';
import { useUpdateMachineMutation } from '@/api/machines-api';

interface MachineEditModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine | null;
}

const style = {
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
} as const;

const MachineEditModal: React.FC<MachineEditModalProps> = ({ open, onClose, machine }) => {
  const [editedName, setEditedName] = useState(machine?.name || '');
  const [editedType, setEditedType] = useState<MachineType>(machine?.type || MachineType.PUMP);

  const [updateMachine, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateMachineMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (machine) {
      setEditedName(machine.name);
      setEditedType(machine.type);
    }
  }, [machine]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setSnackbarMessage('Máquina atualizada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onClose();
    } else if (isUpdateError) {
      console.error('Erro ao atualizar máquina:', updateError);
      setSnackbarMessage('Erro ao atualizar máquina.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [isUpdateSuccess, isUpdateError, updateError, onClose]);

  const handleSave = async () => {
    if (!machine) return;

    try {
      await updateMachine({ id: machine.id, name: editedName, type: editedType }).unwrap();
    } catch (apiError) { 
      console.error('Erro inesperado ao salvar máquina:', apiError);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Editar Máquina
          </Typography>

          <TextField
            fullWidth
            label="Nome da Máquina"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={isUpdating}
          />

          <FormControl fullWidth margin="normal" variant="outlined" disabled={isUpdating}>
            <InputLabel id="machine-type-label">Tipo</InputLabel>
            <Select
              labelId="machine-type-label"
              value={editedType}
              onChange={(e) => setEditedType(e.target.value as MachineType)}
              label="Tipo"
            >
              <MenuItem value={MachineType.PUMP}>{MachineType.PUMP}</MenuItem>
              <MenuItem value={MachineType.FAN}>{MachineType.FAN}</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isUpdating}
              startIcon={isUpdating ? <CircularProgress size={20} /> : null}
            >
              {isUpdating ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Modal>

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
    </>
  );
};

export default MachineEditModal;