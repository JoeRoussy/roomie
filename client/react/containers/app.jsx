import React from 'react';
import { Route, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Home from './home';
import SignUp from './signup';
import { history } from '../../redux/store';

const style = {
    marginTop: '50px'
};

// We pass location off to the NavBar so it updates when the location changes
const app = ({

}) => (
    <div>
        <Navbar location={location}/>
        <main style={style}>
            <Route exact path="/" component={Home} />
            <Route exact path="/sign-up" component={SignUp} />
        </main>
    </div>
);

export default app;
