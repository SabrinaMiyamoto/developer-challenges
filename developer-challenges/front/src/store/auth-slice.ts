import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//Definição do estado da autenticação

interface AuthState {
    isAuthenticated: boolean;
    user: { email: string, token: string } | null
}

//Definição do estado inicial
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
}
//Definição da Slice
const authSlice = createSlice({
  name: 'auth', 
  initialState,
  reducers: {
    // Reducer para o login
    login(state, action: PayloadAction<{ email: string; token: string }>) {
      state.isAuthenticated = true;
      state.user = { 
      email: action.payload.email,
      token: action.payload.token };
    },
    // Reducer para o logout
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions

export default authSlice.reducer