'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { MachineType, Machine } from '@/types/machine';
import { SensorModel } from '@/types/sensor';
import { useCreateMonitoringPointMutation, useGetMachinesQuery } from '@/api/machines-api';
import { toast } from 'react-hot-toast';

interface IMonitoringPointInput {
  name: string;
  machineId: string;
  sensorModel: SensorModel;
  lastMaintenanceDate: string;
}

interface AddMonitoringPointModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const initialFormState: IMonitoringPointInput = {
  name: '',
  machineId: '',
  sensorModel: SensorModel.HF_PLUS,
  lastMaintenanceDate: new Date().toISOString().split('T')[0],
};

export const AddMonitoringPointModal = ({ 
  open, 
  onClose, 
  onSuccess 
}: AddMonitoringPointModalProps) => {
  const [formData, setFormData] = useState<IMonitoringPointInput>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createPoint, { isLoading, error: creationError }] = useCreateMonitoringPointMutation();
  const { 
    data: machines, 
    isLoading: loadingMachines, 
    error: machinesError 
  } = useGetMachinesQuery();

  // Reset form when opening modal
  useEffect(() => {
    if (open) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [open]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    },
    []
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.machineId) {
      newErrors.machineId = 'Selecione uma máquina';
    }

    const selectedMachine = machines?.find(m => m.id === formData.machineId);
    if (selectedMachine?.type === MachineType.PUMP && 
        [SensorModel.TC_AG, SensorModel.TC_AS].includes(formData.sensorModel)) {
      newErrors.sensorModel = 'Sensores TcAg/TcAs não são compatíveis com bombas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createPoint(formData).unwrap();
      toast.success('Ponto criado com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao criar ponto');
      console.error('Creation error:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" mb={3}>
          Novo Ponto de Monitoramento
        </Typography>

        <Stack spacing={3}>
          {/* Nome do Ponto */}
          <TextField
            label="Nome do Ponto"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          {/* Seletor de Máquina */}
          {loadingMachines ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : machinesError ? (
            <Alert severity="error">
              Erro ao carregar máquinas
            </Alert>
          ) : (
            <FormControl fullWidth error={!!errors.machineId}>
              <InputLabel>Máquina</InputLabel>
              <Select
                name="machineId"
                value={formData.machineId}
                label="Máquina"
                onChange={handleInputChange}
              >
                {machines?.map(machine => (
                  <MenuItem key={machine.id} value={machine.id}>
                    {machine.name} ({machine.type})
                  </MenuItem>
                ))}
              </Select>
              {errors.machineId && (
                <Typography color="error" variant="caption">
                  {errors.machineId}
                </Typography>
              )}
            </FormControl>
          )}

          {/* Seletor de Sensor */}
          <FormControl fullWidth error={!!errors.sensorModel}>
            <InputLabel>Modelo do Sensor</InputLabel>
            <Select
              name="sensorModel"
              value={formData.sensorModel}
              label="Modelo do Sensor"
              onChange={handleInputChange}
            >
              {Object.values(SensorModel).map(model => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
            {errors.sensorModel && (
              <Typography color="error" variant="caption">
                {errors.sensorModel}
              </Typography>
            )}
          </FormControl>

          {/* Data de Manutenção */}
          <TextField
            label="Última Manutenção"
            name="lastMaintenanceDate"
            type="date"
            value={formData.lastMaintenanceDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Mensagens de Erro */}
          {creationError && (
            <Alert severity="error">
              Erro ao criar ponto de monitoramento
            </Alert>
          )}

          {/* Botões de Ação */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};