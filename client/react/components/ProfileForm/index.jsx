import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Input, Message, Grid, Image } from 'semantic-ui-react';
import { LabelInputField, UploadField, Upload } from 'react-semantic-redux-form';

import FileInput from '../FileInput';

import './styles.css';

const validate = (values) => {
    let errors = {};

    const {
        email,
        name
    } = values;

    if (!email) {
        errors = {
            email: 'Please update your email',
            ...errors
        };
    }

    if (!name) {
        errors = {
            name: 'Please update your name',
            ...errors
        };
    }

    return errors;
};

// NOTE: Valid is a prop passed in from redux from.
const ProfileForm = ({
    valid,
    onSubmit,
    errorMessage,
    isProcessing,
    onEditCancelClicked,
    profilePictureLink,
    isEditingPicture,
    onPictureEditClicked,
    onCancelPictureEditClicked
}) => {
    const profilePictureRightSection = isEditingPicture ? (
        <Grid.Column>
            <Field
                name='profilePic'
                component={FileInput}
                label='Upload a profile picture'
                accept='image/x-png,image/jpeg'
                iconName='image'
            />
        <Button type='button' id='profileKeepOldPictureButton' onClick={onCancelPictureEditClicked}>Keep Old Profile Picture</Button>
        </Grid.Column>
    ) : (
        <Grid.Column>
            <Button type='button' onClick={onPictureEditClicked}>Upload New Profile Picture</Button>
        </Grid.Column>

    );

    return (
        <div id='profileEditFormWrapper'>
            <Button onClick={onEditCancelClicked}>Back to Profile</Button>
            <Form id='profileEditForm' onSubmit={onSubmit} error={!!errorMessage}>
                <Message
                    error
                    header='Error'
                    content={errorMessage}
                />
                <Field
                    name='name'
                    component={LabelInputField}
                    label={{ content: <Icon color='blue' name='user' size='large' /> }}
                    labelPosition='left'
                    placeholder='Name'
                />
                <Field
                    name='email'
                    component={LabelInputField}
                    label={{ content: <Icon color='blue' name='mail' size='large' /> }}
                    labelPosition='left'
                    placeholder='Email'
                />

                <Grid columns={2}>
                    <Grid.Column>
                        <Image className='profilePicture' src={`${process.env.ASSETS_ROOT}${profilePictureLink}`} />
                    </Grid.Column>
                    {profilePictureRightSection}
                </Grid>

                <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Update Profile</Button>
            </Form>
        </div>
    )
};

export default reduxForm({
    form: 'profile',
    validate
})(ProfileForm);
