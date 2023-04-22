import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import Store from './redux/Store';
import { BrowserRouter } from 'react-router-dom';
import { persistStore, autoRehydrate } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
let { store2, persistor } = Store();

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            {/* <Provider store={store2} persisto={persistor}> */}
            <Provider store={store2}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);
