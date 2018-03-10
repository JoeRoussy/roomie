import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, Button, Icon } from 'semantic-ui-react';
import PlacesAutoComplete from 'react-places-autocomplete';

import './styles.css';


const HomeSearch = ({
    submitSearch,
    createListing,
    inputProps,
    renderLocationBar
}) => {
    return (
        <div className='search' >
            <PlacesAutoComplete inputProps={{...inputProps, placeholder: "Enter a destination..."}}/>
            <div>
                <p> OR </p>
            </div>
            <Button
                className='listingsButton primaryColour'
                content='Post new listing'
                onClick={createListing}
            />
        </div>
    )
}

export default HomeSearch;
