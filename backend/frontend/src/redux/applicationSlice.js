import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applications: [],
        loading: false,
        error: null
    },
    reducers: {
        setApplications: (state, action) => {
            // store applications array in `applications`
            state.applications = action.payload;
        },
        setSingleApplication: (state, action) => {
            state.singleApplication = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setApplications, setSingleApplication, setLoading, setError } = applicationSlice.actions;
export default applicationSlice.reducer;
export const applicationSliceReducer = applicationSlice.reducer;