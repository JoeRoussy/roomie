import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';

import SignUpForm from '../../components/signupForm';
import { chooseUserType, submitForm } from '../../../redux/actions/signupActions';

import styles from './styles.css.js';

// NOTE: We use the initialValues prop instead of a hidden field for the user type in the form
// With a redux form, the initalValues prop initalizes the values of the form so hidden form fields are
// never nessesary
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
                    {userType === process.env.USER_TYPE_TENANT ? (
                        <Button onClick={() => chooseUser(process.env.USER_TYPE_LANDLORD)}>Signup as a landlord</Button>
                    ) : (
                        <Button onClick={() => chooseUser(process.env.USER_TYPE_TENANT)}>Signup as a tenant</Button>
                    )}
                </div>
                <SignUpForm style={styles.form} onSubmit={onSubmit(formValues, userType)} isProcessing={isFormProcessing}></SignUpForm>
            </div>
        )
    }

    return (
        <div>
            <Button onClick={() => chooseUser(process.env.USER_TYPE_TENANT)}>Choose Tenant</Button>
            <Button onClick={() => chooseUser(process.env.USER_TYPE_LANDLORD)}>Choose Landlord</Button>
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
    onSubmit: (formData, userType) => () => dispatch(submitForm(formData, userType))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
