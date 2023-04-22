import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { infoUserReducer } from '../components/userProfile/infoUserSlice';
import RootReducer from './reducers/RootReducer';
import localStorage from 'redux-persist/es/storage';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
    infoUserReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const initialState = loadFromLocalStorage();
const initialState =  {};

function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem('cart', serializedStore);
    } catch (e) {
        console.log(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem('cart');
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}
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

    // compose(applyMiddleware(...middlewares), devtools),

    composeEnhancers(applyMiddleware(...middlewares), devtools),
);

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    let store2 = Store1;
    let persistor = persistStore(store2);
    return { store2, persistor };
};
