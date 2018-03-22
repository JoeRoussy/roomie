import React from 'react';
import { Button } from 'semantic-ui-react';

import SignUpForm from '../SignupForm';
import './styles.css'

export default ({
    userType,
    chooseUser,
    onSubmit,
    formValues,
    isFormProcessing,
    errorMessage
}) => {
    if (userType) {
        const chooseUserButton = userType === process.env.USER_TYPE_TENANT ? (
            <Button onClick={() => chooseUser(process.env.USER_TYPE_LANDLORD)}>Signup as a landlord</Button>
        ) : (
            <Button onClick={() => chooseUser(process.env.USER_TYPE_TENANT)}>Signup as a tenant</Button>
        );

        return (
            <div>
                <div className='rightAligned'>
                    {chooseUserButton}
                </div>
                <SignUpForm
                    className='signUpForm'
                    onSubmit={onSubmit(formValues, userType)}
                    isProcessing={isFormProcessing}
                    errorMessage={errorMessage}
                />
            </div>
        )
    }

    return (
        <div id='signUpBody'>
            <div className='ui two buttons'>
                <Button className='primaryColour' onClick={() => chooseUser(process.env.USER_TYPE_TENANT)}>Choose Tenant</Button>
                <Button className='primaryColourAlt' onClick={() => chooseUser(process.env.USER_TYPE_LANDLORD)}>Choose Landlord</Button>
            </div>
        </div>
    );
}
