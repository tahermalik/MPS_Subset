import { configureStore, combineReducers } from "@reduxjs/toolkit";

import layoutReducer from "./slices/layoutSlice.js";
import userReducer from "./slices/userSlice.js";
import filterReducer from "./slices/filterSlice.js";
import productReducer from "./slices/productSlice.js";
import activeReducer from "./slices/activeSlice.js";
import wishListReducer from "./slices/wishListSlice.js";
import chatReducer from "./slices/chatSlice.js"

import { enableMapSet } from "immer";
import { 
    persistStore, 
    persistReducer, 
    FLUSH, 
    REHYDRATE, 
    PAUSE, 
    PERSIST, 
    PURGE, 
    REGISTER 
} from "redux-persist";


// ✅ Define storage manually — fixes Vite's module resolution issue
const storage = {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};


enableMapSet();
const wishListPersistConfig = {
    key: "wishList",
    storage
};

const filterPersistConfig = {
    key: "filter",
    storage
};

const productPersistConfig = {
    key: "product",
    storage
};

const persistedWishListReducer = persistReducer(
    wishListPersistConfig,
    wishListReducer
);

const persistedFilterReducer = persistReducer(
    filterPersistConfig,
    filterReducer
);

const persistedProductReducer = persistReducer(
    productPersistConfig,
    productReducer
);

// both filter and wishlist redux data now persist on reload
const store=configureStore({
    reducer:{
        layout:layoutReducer, 
        user:userReducer,
        active:activeReducer,
        product:persistedProductReducer,
        filter:persistedFilterReducer,
        wishList: persistedWishListReducer,
        chat:chatReducer
    },
     middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export default store
export const persistor = persistStore(store);