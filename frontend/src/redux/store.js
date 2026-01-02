import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobSlice from "./jobSlice";
import jobReducer from "./jobSlice";
import { createRoot } from "react-dom/client";
import { combineReducers } from "redux";
import companySlice from "./companyslice";
import companyReducer from "./companyslice";
import storage from "redux-persist/lib/storage";
import applicationSlice from "./applicationSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    job: jobSlice,
    jobs: jobReducer,
    company: companySlice,
    company: companyReducer,
    application: applicationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});


export default store;

