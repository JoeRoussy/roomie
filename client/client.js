import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './redux/store';
import App from './react/containers/app';

const target = document.getElementById('app');

ReactDOM.render(
		<Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
		</Provider>,
        target
);
