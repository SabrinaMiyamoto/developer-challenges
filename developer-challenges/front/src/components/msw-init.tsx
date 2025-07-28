'use client';

import { useEffect } from 'react';
import { setupWorker } from 'msw/browser';
import { handlers } from 'mocks/handlers';

export function MSWInit() {
  useEffect(() => {
    if (globalThis.window !== undefined) {
      const worker = setupWorker(...handlers);
      worker.start({ onUnhandledRequest: 'bypass' });
      console.log('MSW Worker iniciado no navegador.');
    }
  }, []);

  return null;
}
