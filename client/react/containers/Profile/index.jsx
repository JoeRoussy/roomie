import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container, Button } from 'semantic-ui-react';
import { change } from 'redux-form';

import ProfileForm from '../../components/ProfileForm';
import ProfileDisplay from '../../components/ProfileDisplay';
import {
    submitForm,
    editProfile,
    cancelEditProfile,
    editProfilePicture,
    cancelEditProfilePicture,
    deleteProfile,
    cancelDeleteProfile,
    confirmDeleteProfile
} from '../../../redux/actions/profileActions';
import { navigateTo as getNavigateTo } from '../../../components';

import './styles.css';

const Profile = ({
    formData,
    onSubmit,
    user,
    isFormProcessing,
    errorMessage,
    isEditing,
    onEditClicked,
    onEditCancelClicked,
    onPictureEditClicked,
    onCancelPictureEditClicked,
    isEditingPicture,
    navigateTo,
    isDeleting,
    onDeleteClicked,
    onCancelDeleteClicked,
    onDeleteConfirmedClicked,
    isDeletePending
}) => {
    const redirectSection = user ? '' : <Redirect to='/sign-in'/>;

    // Defualt assignment is so app does not error out when user disappears from state (before the redirect happens)
    const {
        profilePictureLink = ''
    } = user || {};

    const bodySection = isEditing ? (
        <ProfileForm
            onSubmit={onSubmit(formData)}
            onEditCancelClicked={onEditCancelClicked}
            initialValues={{ ...user }}
            isProcessing={isFormProcessing}
            errorMessage={errorMessage}
            profilePictureLink={profilePictureLink}
            onPictureEditClicked={onPictureEditClicked}
            onCancelPictureEditClicked={onCancelPictureEditClicked}
            isEditingPicture={isEditingPicture}
            navigateTo={navigateTo}
        />
    ) : (
        <ProfileDisplay
            user={user}
            isDeleting={isDeleting}
            onDeleteClicked={onDeleteClicked}
            onCancelDeleteClicked={onCancelDeleteClicked}
            onDeleteConfirmedClicked={onDeleteConfirmedClicked}
            onEditClicked={onEditClicked}
            isDeletePending={isDeletePending}
            navigateTo={navigateTo}
        />
    )

    return (
        <Container className='rootContainer'>
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
        isEditing,
        isEditingPicture,
        isDeleting,
        isDeletePending
    } = {}
}) => ({
    user,
    formData: values,
    isFormProcessing,
    errorMessage,
    isEditing,
    isEditingPicture,
    isDeleting,
    isDeletePending
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData)),
    onEditClicked: () => dispatch(editProfile()),
    onEditCancelClicked: () => dispatch(cancelEditProfile()),
    onPictureEditClicked: () => dispatch(editProfilePicture()),
    onCancelPictureEditClicked: () => {
        // When we cancel editting the profile picutre, we want to dispatch an associated aciton and also tell
        // redux form to set the value of the profile picture field to null so it is not changed in case the user submits
        // the form.
        dispatch(cancelEditProfilePicture());
        dispatch(change('profile', 'profilePic', null));
    },
    navigateTo: getNavigateTo(dispatch),
    onDeleteClicked: () => dispatch(deleteProfile()),
    onCancelDeleteClicked: () => dispatch(cancelDeleteProfile()),
    onDeleteConfirmedClicked: () => dispatch(confirmDeleteProfile)
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
