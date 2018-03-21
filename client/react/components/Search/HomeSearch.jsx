import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, Button, Icon, Divider } from 'semantic-ui-react';
import PlacesAutoComplete from 'react-places-autocomplete';

import './styles.css';


const HomeSearch = ({
    submitSearch,
    navigateToCreateListing,
    inputProps,
    renderLocationBar,
    isLandlord
}) => {
    const postListingButton = isLandlord ? (
        <div>
            <Button
                className='listingsButton primaryColour'
                content='Post new listing'
                onClick={navigateToCreateListing}
            />
        </div>
    ) : ('');

    return (
        <div id='searchWrapper' className='search' >
            <PlacesAutoComplete inputProps={{...inputProps, placeholder: "Enter a destination..."}}/>
            <Divider id='searchDivider' horizontal>Or</Divider>
            {postListingButton}
        </div>
    )
}

export default HomeSearch;
