import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import SignUpBody from '../../components/SignUpBody';
import { chooseUserType, submitForm } from '../../../redux/actions/signupActions';

const Signup = ({
    userType,
    chooseUser,
    onSubmit,
    formValues,
    isFormProcessing,
    user,
    errorMessage
}) => {
    const userRedirect = user ? (<Redirect to='/'/>) : ('');

    return (
        <div>
            <h1>Sign up</h1>
            {userRedirect}
            <SignUpBody
                userType={userType}
                chooseUser={chooseUser}
                onSubmit={onSubmit}
                formValues={formValues}
                isFormProcessing={isFormProcessing}
                errorMessage={errorMessage}
            />
        </div>
    );
};

const mapStateToProps = ({
    signUpReducer: {
        userType,
        isFormProcessing,
        errorMessage
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
    user,
    errorMessage
})

const mapDispatchToProps = (dispatch) => ({
    chooseUser: (type) => dispatch(chooseUserType(type)),
    onSubmit: (formData, userType) => () => dispatch(submitForm(formData, userType))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
