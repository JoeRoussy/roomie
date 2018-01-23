import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Input, Button, Icon } from 'semantic-ui-react';
import './styles.css';

const BasicSearch = ({
    submitSearch,
    createListing
}) => {
    return (
        <div className='search' >
            <Form onSubmit={submitSearch}>
                <Field
                    className='searchBar'
                    name='searchBar'
                    component={Input}
                    placeholder="Enter a destination..."
                    icon='search'
                    onBlur={submitSearch}
                />
            </Form>
            <div> 
                <p> OR </p> 
            </div>
            <Button 
                className='listingsButton' 
                content='Post new listing'
                onClick={createListing}
            />
        </div>
    )
}

export default reduxForm({
    form: 'basicSearch'
})(BasicSearch);