'use client'

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

export function ReduxProvider({ children } : { children: React.ReactNode }){
    console.log("Valor do store no ReduxProvider:", store);
    return <Provider store={store}>{children}</Provider>
}