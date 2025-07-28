import { http, HttpResponse, type HttpHandler } from 'msw';
import { Machine, NewMachine, MachineType } from '@/types/machine';

// ==================== CONSTANTES E TIPOS ====================
const MOCK_USERS = [
  { email: 'user@teste.com', password: 'senha123', token: 'mock-user-token-123' },
  { email: 'admin@teste.com', password: 'admin123', token: 'mock-admin-token-456' },
];

const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Máquina 01',
    type: MachineType.PUMP,
  },
  {
    id: '2',
    name: 'Máquina 02',
    type: MachineType.FAN,
  }
];
let nextId = 3; // Próximo ID a ser usado

type LoginRequest = {
  email: string;
  password: string;
};

// ==================== FUNÇÕES AUXILIARES ====================
function isLoginRequest(data: unknown): data is LoginRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'email' in data &&
    'password' in data &&
    typeof data.email === 'string' &&
    typeof data.password === 'string'
  );
}

function isValidMachineData(data: unknown): data is NewMachine {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'type' in data &&
    typeof data.name === 'string' &&
    Object.values(MachineType).includes(data.type as MachineType)
  );
}

function isAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  if(!authHeader) return false
  const token = authHeader.replace("Bearer", " ")
  return MOCK_USERS.some(user =>user.token === token)

}

// ==================== HANDLERS ====================
export const handlers: HttpHandler[] = [
  // ------------ Autenticação ------------
  http.post('/api/auth/login', async ({ request }) => {
    const data = await request.json();
    
    if (!isLoginRequest(data)) {
      return HttpResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const user = MOCK_USERS.find(u => 
      u.email === data.email && 
      u.password === data.password
    );

    if (user) {
      return HttpResponse.json(
        { 
          user: { email: user.email },
          token: user.token 
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { error: 'Email ou senha incorretos' },
      { status: 401 }
    );
  }),

  // ------------ Máquinas (protegidas) ------------
  // Listar máquinas
  http.get('/api/machines', ({ request }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    return HttpResponse.json(mockMachines);
  }),

  // Criar máquina
  http.post('/api/machines', async ({ request }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    if (!isValidMachineData(data)) {
      return HttpResponse.json(
        { error: 'Dados inválidos', message: 'Nome e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    const newMachine: Machine = {
      id: String(nextId++),
      name: data.name,
      type: data.type
    };

    mockMachines.push(newMachine);
    return HttpResponse.json(newMachine, { status: 201 });
  }),

  // Atualizar máquina
  http.put('/api/machines/:id', async ({ request, params }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();

    if (!isValidMachineData(data)) {
      return HttpResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const index = mockMachines.findIndex(m => m.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Máquina não encontrada' },
        { status: 404 }
      );
    }

    const updatedMachine = { 
      ...mockMachines[index],
      ...data
    };

    mockMachines[index] = updatedMachine;
    return HttpResponse.json(updatedMachine);
  }),

  // Deletar máquina
  http.delete('/api/machines/:id', ({ request, params }) => {
    if (!isAuthenticated(request)) {
      return HttpResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const index = mockMachines.findIndex(m => m.id === id);
    
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Máquina não encontrada' },
        { status: 404 }
      );
    }

    const [deletedMachine] = mockMachines.splice(index, 1);
    return HttpResponse.json(
      { message: 'Máquina removida com sucesso', deletedMachine },
      { status: 200 }
    );
  })
];