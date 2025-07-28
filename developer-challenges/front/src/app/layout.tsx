import React from 'react'
import { Inter } from 'next/font/google'
import Box from '@mui/material/Box'
import { LocalizationProvider } from '@/components/core/localization-provider'
import { UserProvider } from '@/contexts/user-context'
import { SettingsProvider } from '@/contexts/setting'
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider'
import { ReduxProvider } from '@/app/providers'
import { MSWInit } from '@/components/msw-init'
import '@/styles/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Devias Kit',
  description: 'Devias Kit is a professional admin template for React.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <LocalizationProvider>
          <UserProvider>
            <ReduxProvider>
              <SettingsProvider>
                <ThemeProvider>
                  {/* Componente de inicialização do MSW */}
                  <MSWInit />
                  <Box sx={{ bgcolor: 'var(--mui-palette-background-default)' }}>
                    {children}
                  </Box>
                </ThemeProvider>
              </SettingsProvider>
            </ReduxProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  )
}