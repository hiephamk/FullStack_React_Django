// import { configureStore } from "@reduxjs/toolkit"
// import authReducer from "../auth/authSlice"


// export const store = configureStore({
//     reducer: {
//         auth: authReducer
//     },
// })

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "../auth/authSlice"

const persistConfig = {
    key: "auth",
    storage, //store in the local storage
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedReducer,
        // other reducers
    },
});

export const persistor = persistStore(store);
export default store;

