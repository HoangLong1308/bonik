import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { infoUserReducer } from '../components/userProfile/infoUserSlice';
import RootReducer from './reducers/RootReducer';
import localStorage from 'redux-persist/es/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/CartSlice';
// import CartReducer from './reducers/CartReducer';

const rootReducer = combineReducers({
    infoUserReducer,
});
const initialState = {};
const middlewares = [thunk];
let devtools = (x) => x;

//lưu state vào storage
const persistConfig = {
    key: 'root',
    storage: localStorage,
    whitelist: ['auth', 'cart'],
};
const persistedReducer = persistReducer(persistConfig, RootReducer);
const Store1 = createStore(
    // RootReducer,
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middlewares), devtools),
);

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    let store2 = Store1;
    let persistor = persistStore(store2);
    return { store2, persistor };
};
