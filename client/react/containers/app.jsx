import React from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from '../components/navbar';
import Home from './home';
import SignUp from './Signup';
import { history } from '../../redux/store';
import { getCurrentUser } from '../../redux/actions/userActions';

// No need for state in props but we need the dispatch in the props
@connect((store)=>({

}))
class App extends React.Component {
    componentWillMount() {
        this.props.dispatch(getCurrentUser());
    }
    render() {
        return (
            <div>
                <Navbar />
                <main>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/sign-up" component={SignUp} />
                </main>
            </div>
        )
    }
}

// We need to decorate App using withRouter so it has access to the location as a prop and will thus, render based on location changes done using push from react-router-redux
// This happens with any stateful react component that is connected to the redux store
export default withRouter(App);
