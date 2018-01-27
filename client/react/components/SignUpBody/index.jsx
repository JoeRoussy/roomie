import React from 'react';
import { Button } from 'semantic-ui-react';

import SignUpForm from '../signUpForm';
import styles from './styles.css.js';

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
                <div style={styles.rightAligned}>
                    {chooseUserButton}
                </div>
                <SignUpForm
                    style={styles.form}
                    onSubmit={onSubmit(formValues, userType)}
                    isProcessing={isFormProcessing}
                    errorMessage={errorMessage}
                />
            </div>
        )
    }

    return (
        <div>
            <Button onClick={() => chooseUser(process.env.USER_TYPE_TENANT)}>Choose Tenant</Button>
            <Button onClick={() => chooseUser(process.env.USER_TYPE_LANDLORD)}>Choose Landlord</Button>
        </div>
    );
}
