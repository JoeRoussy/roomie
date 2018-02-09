import React from 'react';
import { Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { history } from '../../../redux/store';

import BrowseListings from '../BrowseListings';
import Home from '../home';
import Navbar from '../../components/navbar';
import SignUp from '../signup';
import SignIn from '../SignIn';
import ViewListing from '../ViewListing';
import ManageListing from './ManageListing';
import Profile from '../Profile';
import Chat from '../chat';

import './styles.css';


const style = {
    marginTop: '3em'
};

const App = ({

}) => (
    <div>
        <header>
            <Navbar />
        </header>
        <main style={style}>
            <ToastContainer />
            <Route exact path="/" component={Home} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/chat" component={Chat} />
            <Route exact path="/listings" component={BrowseListings} />
            <Route exact path="/listings/:id" component={ViewListing} />
            <Route exact path="/sign-in" component={SignIn} />
            <Route exact path="/edit" component={ManageListing} />
            <Route exact path="/profile" component={Profile} />
        </main>
        <footer>
            Copyright © 2018 Roomie
        </footer>
    </div>
)

export default App;
