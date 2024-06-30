'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {WorkspaceWithRole} from "@/lib/types/types";

type InitialStateType = {
    value: WorkspaceWithRole[];
}

const initialState: InitialStateType = {
    value: [],
}

export const workspacesReducer = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {
        set: (state, action: PayloadAction<WorkspaceWithRole[]>) => {
            state.value = action.payload
        }
    }
});

export const fetchAllWorkspaces = () => async (dispatch: any) => {
    const res = await fetch("/api/get-workspaces");
    const data = await res.json();
    dispatch(set(data.workspaces));
}



export const { set } = workspacesReducer.actions;

export default workspacesReducer.reducer;