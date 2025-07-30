'use client';

import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Button,
  InputAdornment,
  IconButton, 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import {
  useGetMonitoringPointsQuery,
  useDeleteMonitoringPointMutation,
} from '@/api/machines-api';
import { MonitoringPointsTable } from '@/components/monitoring-points/monitoring-points-table';
import { AddMonitoringPointModal } from '@/components/monitoring-points/add-monitoring-point-modal';
import { EditMonitoringPointModal } from '@/components/monitoring-points/edit-monitoring-points-modal' 
import {
  IMonitoringPoint,
  SortableField,
  SortDirection,
} from '@/types/machine';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

interface ErrorWithMessage {
  message: string;
}

const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError => {
  return typeof err === 'object' && err !== null && 'status' in err;
};

const isSerializedError = (err: unknown): err is SerializedError => {
  return typeof err === 'object' && err !== null && 'message' in err;
};

const isErrorWithMessage = (errData: unknown): errData is ErrorWithMessage => {
  return typeof errData === 'object' && errData !== null &&
             'message' in errData && typeof (errData as Record<string, unknown>).message === 'string';
};

const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'Erro desconhecido.';
  }

  if (isFetchBaseQueryError(error)) {
    if (typeof error.data === 'string') {
      return error.data;
    }
    
    if (isErrorWithMessage(error.data)) {
      return error.data.message ?? 'Erro da API (mensagem não especificada).';
    }
  }

  if (isSerializedError(error)) {
    return error.message ?? 'Erro de serialização (mensagem não especificada).';
  }

  return 'Ocorreu um erro desconhecido ao carregar os dados. Por favor, tente novamente mais tarde.';
};

const MonitoringPointsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPointToEdit, setSelectedPointToEdit] = useState<IMonitoringPoint | null>(null);
  const [isAddPointModalOpen, setIsAddPointModalOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useGetMonitoringPointsQuery({
    page,
    pageSize: rowsPerPage,
    searchTerm,
    sortBy,
    sortDirection,
  });

  const [deleteMonitoringPoint, { isLoading: isDeleting }] = useDeleteMonitoringPointMutation();

  const handlePageChange = useCallback((e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setPage(0);
  }, []);

  const handleSortChange = useCallback((field: SortableField, direction: SortDirection) => {
    setSortBy(field);
    setSortDirection(direction);
    setPage(0);
  }, []);

  const handleEditPoint = useCallback((point: IMonitoringPoint) => {
    setSelectedPointToEdit(point);
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedPointToEdit(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    toast.success('Ponto de monitoramento editado com sucesso!');
    refetch();
    handleEditModalClose();
  }, [refetch, handleEditModalClose]);

  const handleAddPointModalOpen = useCallback(() => setIsAddPointModalOpen(true), []);
  const handleAddPointModalClose = useCallback(() => setIsAddPointModalOpen(false), []);

  const handleAddPointSuccess = useCallback(() => {
    toast.success('Ponto de monitoramento adicionado com sucesso!');
    refetch();
    handleAddPointModalClose();
  }, [refetch, handleAddPointModalClose]);

  const handleDeletePoint = useCallback(async (pointId: string) => {
    if (globalThis.window.confirm('Tem certeza que deseja desassociar este ponto de monitoramento?')) {
      try {
        await deleteMonitoringPoint(pointId).unwrap();
        toast.success('Ponto de monitoramento desassociado com sucesso!');
        refetch();
      } catch (error_) {
        const message = getErrorMessage(error_);
        toast.error(`Falha ao desassociar ponto: ${message}`);
        console.error('Erro ao deletar ponto de monitoramento:', error_);
      }
    }
  }, [deleteMonitoringPoint, refetch]);


  return (
    <>
      <Head>
        <title>
          Pontos de Monitoramento | Dynamox
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            >
              <Stack spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Typography variant="h4">
                  Pontos de Monitoramento
                </Typography>
                <TextField
                  fullWidth
                  label="Pesquisar por Nome, Máquina ou Sensor"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ maxWidth: { sm: '400px' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    // CORREÇÃO AQUI: Garante que o IconButton esteja presente e o onClick correto
                    endAdornment: searchTerm ? ( // Só mostra o botão de limpar se houver texto
                      <InputAdornment position="end">
                        <IconButton onClick={handleClearSearch} size="small">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null, // Se não houver searchTerm, o endAdornment é null
                  }}
                />
              </Stack>
              <div>
                <Button
                  variant="contained"
                  onClick={handleAddPointModalOpen}
                  sx={{ height: '56px' }}
                >
                  Adicionar Ponto de Monitoramento
                </Button>
              </div>
            </Stack>

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {isError && (
              <Alert severity="error" sx={{ mt: 4 }}>
                Ocorreu um erro ao carregar os pontos de monitoramento: {getErrorMessage(error)}
              </Alert>
            )}

            {!isLoading && !isError && data && (
              <MonitoringPointsTable
                items={data.data || []}
                count={data.total || 0}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                onEditPoint={handleEditPoint}
                onDeletePoint={handleDeletePoint}
                isDeleting={isDeleting}
              />
            )}
          </Stack>
        </Container>
      </Box>

      <AddMonitoringPointModal
        open={isAddPointModalOpen}
        onClose={handleAddPointModalClose}
        onSuccess={handleAddPointSuccess}
      />

      <EditMonitoringPointModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        point={selectedPointToEdit}
        onSaveSuccess={handleEditSuccess}
      />
    </>
  );
};

export default MonitoringPointsPage;