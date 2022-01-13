import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ThemeProvider } from 'styled-components';

import rootReducer from 'store/rootReducer';
import rootSaga from 'store/rootSaga';
import theme from './styles/Theme';
import App from './App';
import './styles/index.css';

import { QueryClientProvider, QueryClient } from 'react-query';

const initialState = {};
const enhancers = [];
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(sagaMiddleware), ...enhancers)
);

sagaMiddleware.run(rootSaga);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Router>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </Router>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
