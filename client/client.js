import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './ReactComponents/Routes';
import { Provider } from 'react-redux';
import store from './redux/store';
/* Client side entry */
ReactDOM.render(
		<Provider store={store}>
			<Routes/>
		</Provider>,
		document.getElementById('app')
);
