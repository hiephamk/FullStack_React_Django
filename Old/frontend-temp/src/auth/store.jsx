import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../auth/authSlice"


export const store = configureStore({
    reducer: {
        auth: authReducer
    },
})
export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import authReducer from "../features/auth/authSlice"

// const persistConfig = {
//     key: "auth",
//     storage, //store in the local storage
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// const store = configureStore({
//     reducer: {
//         auth: persistedReducer,
//         // other reducers
//     },
// });

// export const persistor = persistStore(store);
// export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import authReducer from "../auth/authSlice";


// // Persist configuration for the auth slice
// const persistConfig = {
//     key: "auth",
//     storage,
// };

// // Create a persisted reducer
// const persistedReducer = persistReducer(persistConfig, authReducer);

// // Configure the Redux store
// const store = configureStore({
//     reducer: {
//         auth: persistedReducer,  // Add persisted reducer
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 // Ignore non-serializable values in these specific actions
//                 ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//             },
//         }),
// });

// export const persistor = persistStore(store);
// export default store;
