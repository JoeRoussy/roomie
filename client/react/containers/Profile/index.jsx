import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container } from 'semantic-ui-react';

import ProfileForm from '../../components/ProfileForm';
import ProfileDisplay from '../../components/ProfileDisplay';
import { submitForm, editProfile, cancelEditProfile } from '../../../redux/actions/profileActions';

import './styles.css';

const Profile = ({
    formData,
    onSubmit,
    user,
    isFormProcessing,
    errorMessage,
    isEditing,
    onEditClicked,
    onEditCancelClicked
}) => {
    const redirectSection = user ? '' : <Redirect to='/sign-in'/>;

    const bodySection = isEditing ? (
        <ProfileForm
            onSubmit={onSubmit(formData)}
            onEditCancelClicked={onEditCancelClicked}
            initialValues={{ ...user }}
            isProcessing={isFormProcessing}
            errorMessage={errorMessage}
        />
    ) : (
        <ProfileDisplay user={user} onEditClicked={onEditClicked} />
    )

    return (
        <Container>
            <h1>Profile</h1>
            {redirectSection}
            {bodySection}
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
        errorMessage,
        isEditing
    } = {}
}) => ({
    user,
    formData: values,
    isFormProcessing,
    errorMessage,
    isEditing
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData)),
    onEditClicked: () => dispatch(editProfile()),
    onEditCancelClicked: () => dispatch(cancelEditProfile())
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
