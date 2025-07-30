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
  SelectChangeEvent
} from '@mui/material';
import { Machine, MachineType } from '@/types/machine';
import { useUpdateMachineMutation, useGetMachinesQuery } from '@/api/machines-api';

interface MachineEditModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine | null;
}

const modalStyle = {
  position: 'absolute',
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
  const [formData, setFormData] = useState({
    name: '',
    type: MachineType.PUMP
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [updateMachine, { isLoading }] = useUpdateMachineMutation();
  const { data: machines = [] } = useGetMachinesQuery();

  useEffect(() => {
    if (machine) {
      setFormData({
        name: machine.name,
        type: machine.type
      });
    }
  }, [machine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<MachineType>) => {
    setFormData(prev => ({ ...prev, type: e.target.value as MachineType }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    if (!machine) return;

    // Validação de nome duplicado
    const duplicate = machines.some((m: Machine) => 
      m.name === formData.name && 
      m.type === formData.type && 
      m.id !== machine.id
    );

    if (duplicate) {
      showSnackbar('Já existe uma máquina com este nome e tipo!', 'error');
      return;
    }

    try {
      await updateMachine({ 
        id: machine.id, 
        ...formData 
      }).unwrap();
      showSnackbar('Máquina atualizada com sucesso!', 'success');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar máquina:', error);
      showSnackbar('Erro ao atualizar máquina', 'error');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="edit-machine-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={3}>
            Editar Máquina
          </Typography>

          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            disabled={isLoading}
            inputProps={{ maxLength: 50 }}
          />

          <FormControl fullWidth margin="normal" disabled={isLoading}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              onChange={handleSelectChange}
              label="Tipo"
            >
              {Object.values(MachineType).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MachineEditModal;