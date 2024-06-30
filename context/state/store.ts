'use client';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import workspacesReducer from './workspace/workspaceSlice'

export const store = configureStore({
    reducer: {
        workspaces: workspacesReducer
    }
});

export const makeStore = () => {
    return configureStore({
        reducer: {
            workspaces: workspacesReducer
        }
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;