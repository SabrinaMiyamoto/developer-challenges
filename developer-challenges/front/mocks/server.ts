import { setupServer } from 'msw/node';
import { handlers } from './handlers';


// intercetar requisições no ambiente Node.js (servidor)
export const server = setupServer(...handlers);