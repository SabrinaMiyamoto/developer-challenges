import { worker } from './browser';
import { server } from './server';

async function initializeMockService() {
  try {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
      return;
    }

    if (globalThis.window === undefined) {
      // Ambiente Node.js (SSR/API Routes)
      server.listen({ onUnhandledRequest: 'bypass' });
      console.log('✅ MSW configurado para servidor');
    } else {
      // Ambiente Browser
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' }
      });
      console.log('✅ MSW configurado para navegador');
    }
  } catch (error) {
    console.error('❌ Falha ao iniciar MSW:', error);
  }
}

// Inicialização condicional
if (process.env.NODE_ENV === 'development') {
  await initializeMockService();
}

export { initializeMockService as startMockService };