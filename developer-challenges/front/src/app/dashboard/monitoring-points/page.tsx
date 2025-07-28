'use client';

import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography, CircularProgress, Alert, TextField } from '@mui/material';
import { useGetMonitoringPointsQuery } from '@/api/machines-api';
import { MonitoringPointsTable } from '@/components/monitoring-points/monitoring-points-table';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';


interface ErrorWithMessage {
  message: string;
}

// Função auxiliar para extrair mensagem de erro de forma tipada
const getErrorMessage = (error: unknown): string => {

  if (error) { // Loga o erro se ele não for null/undefined
    console.error('Um erro ocorreu:', error);
  }

  if (!error) {
    return 'Erro desconhecido.';
  }


  // eslint-disable-next-line unicorn/consistent-function-scoping
  const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError => {
    return typeof err === 'object' && err !== null && 'status' in err;
  };


  // eslint-disable-next-line unicorn/consistent-function-scoping
  const isSerializedError = (err: unknown): err is SerializedError => {
    return typeof err === 'object' && err !== null && 'message' in err;
  };


  // eslint-disable-next-line unicorn/consistent-function-scoping
  const isErrorWithMessage = (errData: unknown): errData is ErrorWithMessage => {
    return typeof errData === 'object' && errData !== null &&
           'message' in errData && typeof (errData as Record<string, unknown>).message === 'string';
  };


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


const MonitoringPointsPageContent = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

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

  const { data, isLoading, isError, error } = useGetMonitoringPointsQuery({
    page,
    pageSize: rowsPerPage,
    searchTerm,
  });

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
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Pontos de Monitoramento
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <TextField
                    fullWidth
                    label="Pesquisar por Nome, Máquina ou Sensor"
                    variant="outlined"
                    value={searchTerm ?? ''} 
                    onChange={handleSearchChange}
                    sx={{ maxWidth: '300px' }}
                  />
                </Stack>
              </Stack>
              <div>
              </div>
            </Stack>

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {isError && (
              <Alert severity="error">
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
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default MonitoringPointsPageContent;