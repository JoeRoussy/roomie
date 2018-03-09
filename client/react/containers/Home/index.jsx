import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import { Redirect } from 'react-router';

import HomeSearch from '../../components/Search/HomeSearch';
import ViewListingsSearch from '../../components/Search/ViewListingsSearch';
import { search, handleLocationChange } from '../../../redux/actions/searchActions';
import { setPasswordResetToken } from '../../../redux/actions/forgotPasswordFormActions';

import './styles.css';

@connect((store)=>({
    searchArgs: store.form.homeSearch,
    user: store.userReducer.user,
    searchState: store.searchReducer
}))
class Home extends Component {
    constructor(props){
        super(props)

        this.navigateToCreateListing = this.navigateToCreateListing.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.processLocation = this.processLocation.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        this.onPasswordResetToken = this.onPasswordResetToken.bind(this);
    }

    navigateToCreateListing(user) {
        return user ? this.props.dispatch(push('/login')):this.props.dispatch(push('/create-listing'));
    }

    processLocation(searchArgs) {
        if(searchArgs === '') return null;
        const processedArgs = `location=${searchArgs.trim()}`; //TODO PROCESS LOCATION
        return processedArgs;
    }
    submitSearch(event,searchArgs) {
        if(event.keyCode === 13){
            const processedArgs = this.processLocation(searchArgs);
            if(processedArgs === null || processedArgs === '') return;
            this.props.dispatch(search(processedArgs));
            return this.props.dispatch(push('/browse-listings'));
        }
    }

    handleLocationChange(val){
        this.props.dispatch(handleLocationChange(val))
    }

    onPasswordResetToken(token) {
        this.props.dispatch(setPasswordResetToken(token));
    }

    render(){
         const locationProps = {
            value: this.props.searchState.location,
            onChange: (event) => this.handleLocationChange(event),
            onKeyUp: (event) => this.submitSearch(event, this.props.searchState.location)
        };

        // TODO: There has to be a better way with server side rendering
        const queryParams = queryString.parse(this.props.location.search);
        let passwordResetRedirect = '';

        if (queryParams.passwordResetToken) {
            passwordResetRedirect = (<Redirect to='/forgot-password-form'/>);
            this.onPasswordResetToken(queryParams.passwordResetToken);
        }

        return (
            <div>
                {passwordResetRedirect}
                <HomeSearch
                    navigateToCreateListing={() => this.navigateToCreateListing(this.props.user)}
                    inputProps = {locationProps}
                />

                {/* INSERT 5 POPULAR LISTINGS HERE */}
            </div>
        )
    }

}

export default Home;
