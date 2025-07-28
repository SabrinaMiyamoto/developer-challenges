'use client';

import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  Button, 
  SvgIcon 
} from '@mui/material';

import type { IMonitoringPoint } from '@/types/machine';
import type { SensorModel } from '@/types/sensor'; 


import SensorAfIcon from '../../../public/assets/assets-desafio-01/sensor-af.png';
import SensorHfIcon from '../../../public/assets/assets-desafio-01/sensor-hf.png';
import SensorTcaIcon from '../../../public/assets/assets-desafio-01/sensor-tca.png';


const sensorImageMap: Record<string, string> = {
  'AF': SensorAfIcon.src,
  'HF+': SensorHfIcon.src,
  'TcAg': SensorTcaIcon.src,
  'TcAs': SensorTcaIcon.src,
};

interface MonitoringPointsTableProps {
  count: number;
  items: (IMonitoringPoint & { machineName: string; machineType: string; })[];
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page?: number;
  rowsPerPage?: number;
}

export const MonitoringPointsTable = (props: MonitoringPointsTableProps) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange = () => {},
    page = 0,
    rowsPerPage = 0
  } = props;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Nome do Ponto
              </TableCell>
              <TableCell>
                Máquina (Nome)
              </TableCell>
              <TableCell>
                Máquina (Tipo)
              </TableCell>
              <TableCell>
                Sensor
              </TableCell>
              <TableCell>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  Nenhum ponto de monitoramento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              items.map((point) => {
                // Obtém a URL da imagem com base no modelo do sensor
                const sensorImageUrl = point.sensor ? sensorImageMap[point.sensor.model] : undefined;

                return (
                  <TableRow
                    hover
                    key={point.id}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">
                        {point.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {point.machineName}
                    </TableCell>
                    <TableCell>
                      {point.machineType}
                    </TableCell>
                    <TableCell>
                      {/* Lógica para exibir o Sensor */}
                      {point.sensor && point.sensor.id && point.sensor.model ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* Exibe a imagem do sensor se existir e tiver uma URL mapeada */}
                          {sensorImageUrl ? (
                            <img
                              src={sensorImageUrl}
                              alt={point.sensor.model}
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: 8,
                                borderRadius: '4px',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <Box sx={{ width: 40, height: 40, marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            </Box>
                          )}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {point.sensor.model}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display={"none"}>
                              {`(ID: ${point.sensor.id})`}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                           Não Associado 
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {/* Espaço para botões de ação (editar, desassociar, etc.) TENHO QUE IMPLEMENTAR */}
                      <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                        Editar
                      </Button>
                      <Button variant="outlined" color="error" size="small">
                        Desassociar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
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