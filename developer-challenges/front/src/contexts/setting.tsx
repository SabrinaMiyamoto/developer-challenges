'use client'; // Marca este componente como um Client Component

import * as React from 'react';

// Define o tipo para as configurações da aplicação.
// Pode expandir com mais propriedades como 'language', 'notifications', etc.
export interface Settings {
  theme?: 'light' | 'dark'; // Exemplo: tema claro ou escuro
  // Adicione outras configurações globais aqui
}

// Define o tipo para o contexto de configurações.
// Inclui as configurações e uma função para atualizá-las.
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Cria o Contexto React.
// O valor inicial é 'undefined' e será preenchido pelo Provider.
const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

// Hook personalizado para consumir as configurações.
// Garante que o hook é usado dentro do SettingsProvider.
export function useSettings(): SettingsContextType {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Componente Provider que envolve a aplicação e fornece as configurações.
export function SettingsProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  // Estado para armazenar as configurações.
  // Pode carregar configurações iniciais de localStorage ou de um backend.
  const [settings, setSettings] = React.useState<Settings>(() => {
    // Exemplo de como carregar um tema padrão ou de localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('app-theme')) {
      return { theme: localStorage.getItem('app-theme') as 'light' | 'dark' };
    }
    return { theme: 'light' }; // Tema padrão
  });

  // Função para atualizar as configurações.
  const updateSettings = React.useCallback((newSettings: Partial<Settings>): void => {
    setSettings((prevSettings) => {
      const updated = { ...prevSettings, ...newSettings };
      // Opcional: Salvar configurações no localStorage
      if (newSettings.theme) {
        localStorage.setItem('app-theme', newSettings.theme);
      }
      return updated;
    });
  }, []);

  // O valor do contexto que será fornecido aos componentes filhos.
  const contextValue = React.useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}
