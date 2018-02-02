import React from 'react';
import { Button } from 'semantic-ui-react';

import ListingForm from '../ListingForm';
import './styles.css'

export default ({
    onSubmit,
    formValues,
    isFormProcessing,
    errorMessage
}) => {
    return (
        <div>
            <ListingForm
                className='listingForm'
                onSubmit={onSubmit(formValues)}
                isProcessing={isFormProcessing}
                errorMessage={errorMessage}
            />
        </div>
    )
}
