import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Input, Message } from 'semantic-ui-react';
import { LabelInputField } from 'react-semantic-redux-form';


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
    onEditCancelClicked
}) => (
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
            <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Update Profile</Button>
        </Form>
    </div>
);

export default reduxForm({
    form: 'profile',
    validate
})(ProfileForm);
