import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';

import { getMyListings } from '../../../redux/actions/listingActions';
import ListingCard from '../../components/ListingCard';

import './styles.css';

@connect(({
    listingReducer: {
        listing,
        isEditing,
        isFormProcessing,
        errorMessage
    } = {},
    userReducer: {
        user
    } = {}
}) => ({
    listing,
    user
}))

export default class MyListings extends React.Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {
        // Get all the listings for this user.
        this.props.dispatch(getMyListings());
    }

    render() {
        const {
            listing,
            user
        } = this.props;

        let bodySection;



        return (
            <Container>

            </Container>
        )
    }
}
