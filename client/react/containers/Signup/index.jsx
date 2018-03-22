import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container } from 'semantic-ui-react';

import SignUpBody from '../../components/SignUpBody';
import { chooseUserType, submitForm } from '../../../redux/actions/signupActions';

import './styles.css';

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
        <Container className='rootContainer'>
            <h1>Sign Up</h1>
            {userRedirect}
            <SignUpBody
                userType={userType}
                chooseUser={chooseUser}
                onSubmit={onSubmit}
                formValues={formValues}
                isFormProcessing={isFormProcessing}
                errorMessage={errorMessage}
            />
    </Container  >
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
