import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container } from 'semantic-ui-react';

import ProfileForm from '../../components/ProfileForm';
import { submitForm } from '../../../redux/actions/profileActions';


const Profile = ({
    formData,
    onSubmit,
    user,
    isFormProcessing,
    errorMessage
}) => {
    const redirectSection = user ? '' : <Redirect to='/sign-in'/>;

    return (
        <Container>
            <h1>Profile</h1>
            {redirectSection}
            <ProfileForm
                onSubmit={onSubmit(formData)}
                initialValues={{ ...user }}
                isProcessing={isFormProcessing}
                errorMessage={errorMessage}
            />
        </Container>
    );
};

const mapStateToProps = ({
    userReducer: {
        user
    } = {},
    form: {
        profile: {
            values
        } = {}
    } = {},
    profileReducer: {
        isFormProcessing,
        errorMessage
    } = {}
}) => ({
    user,
    formData: values,
    isFormProcessing,
    errorMessage
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData))
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
