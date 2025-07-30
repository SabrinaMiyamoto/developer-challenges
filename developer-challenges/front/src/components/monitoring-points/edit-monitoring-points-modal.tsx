// src/components/monitoring-points/edit-monitoring-point-modal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  MenuItem,
  Alert
} from '@mui/material';
import { IMonitoringPoint, MachineType } from '@/types/machine';
import { ISensor, SensorModel } from '@/types/sensor';
import { useUpdateMonitoringPointMutation } from '@/api/machines-api';

interface EditMonitoringPointModalProps {
  open: boolean;
  onClose: () => void;
  point: IMonitoringPoint | null; // O ponto que está sendo editado
  onSaveSuccess: () => void; // Callback para quando a edição for bem-sucedida
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const EditMonitoringPointModal = ({ open, onClose, point, onSaveSuccess }: EditMonitoringPointModalProps) => {
  const [editedPoint, setEditedPoint] = useState<IMonitoringPoint | null>(point);
  const [updateMonitoringPoint, { isLoading, error }] = useUpdateMonitoringPointMutation();
  const [formError, setFormError] = useState<string | null>(null);

  // Sincroniza o estado interno `editedPoint` com a prop `point` sempre que a prop muda
  useEffect(() => {
    setEditedPoint(point);
    setFormError(null); // Limpa erros quando o modal abre/ponto muda
  }, [point]);

  // Não renderiza o modal se não houver um ponto para editar
  if (!editedPoint) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPoint((prev) => {
      if (!prev) return null;
      if (name === 'lastMaintenanceDate') {
        // Assegura que a data é salva no formato ISO string completo
        const date = new Date(value);
        return { ...prev, [name]: date.toISOString() };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSensorModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newModel = e.target.value as SensorModel;
    setEditedPoint((prev) => prev ? { ...prev, sensor: { ...prev.sensor, model: newModel, id: prev.sensor.id } } : null);
    // Preserva o ID do sensor, apenas muda o modelo
  };

  const handleSave = async () => {
    setFormError(null); // Limpa erros anteriores
    if (!editedPoint) {
      setFormError('Nenhum ponto de monitoramento para salvar.');
      return;
    }
    // Validação básica
    if (!editedPoint.name || !editedPoint.machineId || !editedPoint.machineName || !editedPoint.lastMaintenanceDate || !editedPoint.sensor.model) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await updateMonitoringPoint(editedPoint).unwrap();
      onSaveSuccess(); // Notifica o componente pai sobre o sucesso (para refetch)
      onClose(); // Fecha o modal
    } catch (err) {
      console.error('Falha ao salvar alterações do ponto:', err);
      if (err && typeof err === 'object' && 'data' in err && typeof (err as any).data === 'string') {
        setFormError((err as any).data);
      } else {
        setFormError('Ocorreu um erro ao salvar o ponto de monitoramento. Tente novamente.');
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Box sx={style}>
        <Typography id="edit-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Editar Ponto de Monitoramento: {editedPoint.name}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Nome do Ponto"
            name="name"
            value={editedPoint.name}
            onChange={handleChange}
            fullWidth
            required
          />
          {/* Machine ID e Machine Name geralmente não são editáveis diretamente aqui,
              mas sim através da re-associação do ponto a outra máquina.
              Deixando como `disabled` por enquanto. */}
          <TextField
            label="ID da Máquina"
            name="machineId"
            value={editedPoint.machineId}
            fullWidth
            disabled
          />
          <TextField
            label="Nome da Máquina"
            name="machineName"
            value={editedPoint.machineName}
            fullWidth
            disabled
          />
           <TextField
            label="Tipo da Máquina"
            name="machineType"
            value={editedPoint.machineType}
            onChange={handleChange}
            select
            fullWidth
            required
            disabled // Geralmente o tipo da máquina é definido pela associação, não editável diretamente
          >
            {Object.values(MachineType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Modelo do Sensor"
            name="sensor.model"
            value={editedPoint.sensor?.model || ''}
            onChange={handleSensorModelChange}
            select
            fullWidth
            required
          >
            {Object.values(SensorModel).map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Data da Última Manutenção"
            name="lastMaintenanceDate"
            type="date"
            // Garante que o valor no input `date` esteja no formato "YYYY-MM-DD"
            value={editedPoint.lastMaintenanceDate ? new Date(editedPoint.lastMaintenanceDate).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Stack>
        {formError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {formError}
          </Alert>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};