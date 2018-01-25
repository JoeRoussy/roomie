import React from 'react';
import { Route, Link } from 'react-router-dom';
import { history } from '../../redux/store';

import Navbar from '../components/navbar';
import Home from './home';
import SignUp from './signup';
import BrowseListings from './BrowseListings';
import ViewListing from './ViewListing';


const style = {
    marginTop: '3em'
};

// We pass location off to the NavBar so it updates when the location changes
const app = ({

}) => (
    <div>
        <Navbar />
        <main style={style}>
            <Route exact path="/" component={Home} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/listings" component={BrowseListings} />
            <Route exact path="/listings/:id" component={ViewListing} />
        </main>
    </div>
);

export default app;
