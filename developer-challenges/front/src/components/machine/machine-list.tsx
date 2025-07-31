'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGetMachinesQuery, useDeleteMachineMutation } from '@/api/machines-api';
import { Machine, MachineType } from '@/types/machine';
import MachineEditModal from './machine-edit-modal'; 

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import DeleteIcon from '@mui/icons-material/Delete';

const MachineList = () => {
  const { data: machines, error, isLoading } = useGetMachinesQuery();
  const [deleteMachine, { isLoading: isDeleting, isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError }] = useDeleteMachineMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [filterType, setFilterType] = useState<MachineType | null>(null);
  const listRef = useRef<HTMLUListElement>(null);


  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const handleEditClick = (machineId: string) => {
    const machineToEdit = machines?.find(m => m.id === machineId);
    if (machineToEdit) {
      setSelectedMachine(machineToEdit);
      setOpenEditModal(true); 
    }
  };

  const handleDeleteClick = async (machineId: string) => {
    if (globalThis.window.confirm(`Tem certeza que deseja deletar a máquina com ID: ${machineId}?`)) {
      try {
        await deleteMachine(machineId).unwrap();
        setSnackbarMessage('Máquina deletada com sucesso!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } catch (error_) { 
        console.error('Falha ao deletar a máquina:', error_);
        setSnackbarMessage('Erro ao deletar a máquina.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  useEffect(() => {
    if (error) {
      setSnackbarMessage('Ocorreu um erro ao buscar as máquinas.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    if (isDeleteSuccess) 
    if (isDeleteError) {
      console.error('Erro retornado pela mutação de deleção:', deleteError);
    }
  }, [isDeleteSuccess, isDeleteError, deleteError]);


  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedMachine(null);
  };

  const handleFilterClick = (type: MachineType | null) => {
    setFilterType(type);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredMachines = machines?.filter(machine =>
    filterType === null || machine.type === filterType
  );



  if (isLoading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando máquinas...</Typography>
      </Box>
    );
  }

  if (!machines || machines.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Nenhuma máquina encontrada.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, display:'flex', flexWrap:'wrap', flexDirection:'column', }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Lista de Máquinas
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button
          variant={filterType === null ? 'contained' : 'outlined'}
          onClick={() => handleFilterClick(null)}
        >
          Todas
        </Button>
        <Button
          variant={filterType === MachineType.PUMP ? 'contained' : 'outlined'}
          onClick={() => handleFilterClick(MachineType.PUMP)}
        >
          {MachineType.PUMP}
        </Button>
        <Button
          variant={filterType === MachineType.FAN ? 'contained' : 'outlined'}
          onClick={() => handleFilterClick(MachineType.FAN)}
        >
          {MachineType.FAN}
        </Button>
      </Box>
      <List ref={listRef}>
        {filteredMachines?.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Nenhuma máquina encontrada para o tipo selecionado.
          </Typography>
        ) : (
          filteredMachines?.map((machine, index) => (
            <ListItem
              key={machine.id}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                borderRadius: '8px',
                mb: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: index % 2 === 0 ? '#e0e0e0' : '#f0f0f0',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    {machine.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Tipo: {machine.type}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(machine.id)}>
                  <EditDocumentIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteClick(machine.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {openEditModal && selectedMachine && (
        <MachineEditModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          machine={selectedMachine}
        />
      )}
    </Box>
  );
};

export default MachineList;