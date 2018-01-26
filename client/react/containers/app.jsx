import React from 'react';
import { Route, Link, withRouter } from 'react-router-dom';

import Navbar from '../components/navbar';
import Home from './home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { history } from '../../redux/store';

const style = {
    marginTop: '3em'
};

const App = ({

}) => (
    <div>
        <Navbar />
        <main style={style}>
            <Route exact path="/" component={Home} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/sign-in" component={SignIn} />
        </main>
    </div>
)

export default App;
