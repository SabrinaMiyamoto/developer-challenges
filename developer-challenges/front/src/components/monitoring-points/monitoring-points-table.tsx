'use client';

import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  Button,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import type { IMonitoringPoint, SortableField, SortDirection } from '@/types/machine';
import { SensorModel } from '@/types/sensor';
import SensorHfIcon from '../../../public/assets/assets-desafio-01/sensor-hf.png';
import SensorAfIcon from '../../../public/assets/assets-desafio-01/sensor-af.png'
import SensorTcaIcon from '../../../public/assets/assets-desafio-01/sensor-tca.png';


const sensorImageMap: { [key: string]: StaticImageData } = {
  [SensorModel.TC_AG]: SensorAfIcon,
  [SensorModel.TC_AS]: SensorTcaIcon,
  [SensorModel.HF_PLUS]: SensorHfIcon,
};

interface MonitoringPointsTableProps {
  count: number;
  items: IMonitoringPoint[];

  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  sortBy: SortableField;
  sortDirection: SortDirection;
  onSortChange: (field: SortableField, direction: SortDirection) => void;
  onEditPoint: (point: IMonitoringPoint) => void;
  onDeletePoint: (pointId: string) => void;
  isDeleting: boolean;
}

export const MonitoringPointsTable = (props: MonitoringPointsTableProps) => {
  const {
    count,
    items,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    sortBy,
    sortDirection,
    onSortChange,
    onEditPoint,
    onDeletePoint,
    isDeleting,
  } = props;

  const renderSortableHeader = (field: SortableField, label: string) => {
    const isActive = sortBy === field;
    return (
      <TableCell key={field}>
        <TableSortLabel
          active={isActive}
          direction={isActive ? sortDirection : 'asc'}
          onClick={() => {
            const newDirection = isActive && sortDirection === 'asc' ? 'desc' : 'asc';
            onSortChange(field, newDirection);
          }}
          IconComponent={isActive ?
            (sortDirection === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon) :
            undefined
          }
        >
          {label}
        </TableSortLabel>
      </TableCell>
    );
  };

  return (
    <Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              {renderSortableHeader('name', 'Nome do Ponto')}
              {renderSortableHeader('machineName', 'Máquina')}
              {renderSortableHeader('machineType', 'Tipo Máquina')}
              {renderSortableHeader('sensorModel', 'Sensor')}
              {renderSortableHeader('createdAt', 'Criado Em')}
              {renderSortableHeader('lastMaintenanceDate', 'Última Manutenção')}
              <TableCell key="actions">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  Nenhum ponto de monitoramento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              items.map((point) => {
                const sensorImage = point.sensor && point.sensor.model in sensorImageMap
                                      ? sensorImageMap[point.sensor.model as keyof typeof sensorImageMap]
                                      : undefined;
                return (
                  <TableRow hover key={point.id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {point.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{point.machineName}</TableCell>
                    <TableCell>{point.machineType}</TableCell>
                    <TableCell>
                      {point.sensor && sensorImage ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Image
                            src={sensorImage}
                            alt={`Sensor ${point.sensor.model}`}
                            width={40}
                            height={40}
                            style={{
                              marginRight: 8,
                              borderRadius: '4px',
                              objectFit: 'cover'
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {point.sensor.model}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Não Associado
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(point.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {point.lastMaintenanceDate
                        ? new Date(point.lastMaintenanceDate).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => onEditPoint(point)}
                      >
                        Editar
                      </Button>
                      <Tooltip title="Desassociar Ponto">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => onDeletePoint(point.id)}
                          disabled={isDeleting}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};