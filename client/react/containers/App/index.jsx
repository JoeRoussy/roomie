import React from 'react';
import { Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { history } from '../../../redux/store';

import BrowseListings from '../BrowseListings';
import Home from '../Home';
import Navbar from '../../components/Navbar';
import SignUp from '../Signup';
import SignIn from '../SignIn';
import Listing from '../Listing';
import CreateListing from '../CreateListing';
import Profile from '../Profile';
import ChangePassword from '../ChangePassword';
import ForgotPassword from '../ForgotPassword';
import Chat from '../Chat';
import RoommateSurvey from '../RoommateSurvey';
import ForgotPasswordForm from '../ForgotPasswordForm';
import Schedule from '../Schedule';
import MyListings from '../MyListings';
import ScheduleMeeting from '../ScheduleMeeting';
import Lease from '../Lease';
import Footer from '../../components/Footer'
import './styles.css';

const App = ({

}) => (
    <div>
        <header>
            <Navbar />
        </header>
        <main>
            <ToastContainer />
            <Route exact path="/" component={Home} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/chat" component={Chat} />
            <Route exact path="/listings" component={BrowseListings} />
            <Route exact path="/listings/:id" component={Listing} />
            <Route exact path="/create-listing" component={CreateListing} />
            <Route exact path="/sign-in" component={SignIn} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/change-password" component={ChangePassword} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/forgot-password-form" component={ForgotPasswordForm} />
            <Route exact path="/schedule" component={Schedule} />
            <Route exact path="/schedule-meeting" component={ScheduleMeeting} />
            <Route exact path="/roommate-survey" component={RoommateSurvey} />
            <Route exact path="/my-listings" component={MyListings} />
            <Route exact path="/lease" component={Lease} />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
)

export default App;
