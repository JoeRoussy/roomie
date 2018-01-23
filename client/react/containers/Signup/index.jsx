import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';

import SignUpForm from '../../components/signupForm';
import { chooseUserType, submitForm } from '../../../redux/actions/signupActions';

import styles from './styles.css.js';

const getBody = ({
    userType,
    chooseUser,
    onSubmit,
    formValues,
    isFormProcessing
}) => {
    if (userType) {
        return (
            <div>
                <div style={styles.rightAligned}>
                    {userType === 'tenant' ? (
                        <Button onClick={() => chooseUser('landlord')}>Signup as a landlord</Button>
                    ) : (
                        <Button onClick={() => chooseUser('tenant')}>Signup as a tenant</Button>
                    )}
                </div>
                <SignUpForm style={styles.form} onSubmit={onSubmit(formValues)} userType={userType} isProcessing={isFormProcessing}></SignUpForm>
            </div>
        )
    }

    return (
        <div>
            <Button onClick={() => chooseUser('tenant')}>Choose Tenant</Button>
            <Button onClick={() => chooseUser('landlord')}>Choose Landlord</Button>
        </div>
    );
};

const Signup = ({
    userType,
    chooseUser,
    onSubmit,
    formValues,
    isFormProcessing,
    user
}) => (
    <div>
        <h1>Sign up</h1>

        {user ? (<Redirect to='/'/>) : ('')}

        {getBody({
            userType,
            chooseUser,
            onSubmit,
            formValues,
            isFormProcessing
        })}
    </div>
);

const mapStateToProps = ({
    signupReducer: {
        userType,
        isFormProcessing
    } = {},
    form: {
        signUp: {
            values
        } = {}
    } = {},
    userReducer: {
        user
    } = {}
}) => ({
    userType,
    isFormProcessing,
    formValues: values,
    user
})

const mapDispatchToProps = (dispatch) => ({
    chooseUser: (type) => dispatch(chooseUserType(type)),
    onSubmit: (formData) => () => dispatch(submitForm(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
