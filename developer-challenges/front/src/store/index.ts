import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import { machinesApi } from "@/api/machines-api";


//Configuração do cofre global para fiscalizar a segurança dos dados

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [machinesApi.reducerPath]: machinesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        //pedi para desarivar o eslint por conta de tipagem e segurança!
        // eslint-disable-next-line unicorn/prefer-spread 
        getDefaultMiddleware().concat(machinesApi.middleware),
})

console.log('Estado atual:', store.getState());

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch =  typeof store.dispatch