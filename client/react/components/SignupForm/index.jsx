import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import { LabelInputField, UploadField } from 'react-semantic-redux-form';

import FileInput from '../FileInput';

import './styles.css';

const validate = (values) => {
    let errors = {};

    const {
        name,
        email,
        confirmEmail,
        password,
        confirmPassword
    } = values;

    if (!name) {
        errors = {
            name: 'Please enter your name',
            ...errors
        };
    }

    if (!email) {
        errors = {
            email: 'Please enter your email',
            ...errors
        };
    }

    if (!password) {
        errors = {
            password: 'Please choose a password',
            ...errors
        };
    }

    if (email && confirmEmail !== email) {
        errors = {
            confirmEmail: 'Emails must match',
            ...errors
        };
    }

    if (password && confirmPassword !== password) {
        errors = {
            confirmPassword: 'Passwords must match',
            ...errors
        };
    }

    return errors;
}

// NOTE: Valid is a prop passed in by redux-form
const SignUpForm = ({
    onSubmit,
    isProcessing,
    valid,
    errorMessage,
    className
}) => (
    <Form className={className} onSubmit={onSubmit} error={!!errorMessage}>
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
        <Field
            name='confirmEmail'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='mail' size='large' /> }}
            labelPosition='left'
            placeholder='Confirm Email'
        />
        <Field
            name='password'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='lock' size='large' /> }}
            labelPosition='left'
            placeholder='Password'
            type='password'
        />
        <Field
            name='confirmPassword'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='lock' size='large' /> }}
            labelPosition='left'
            placeholder='Confirm Password'
            type='password'
        />
        <Field
            name='profilePic'
            component={FileInput}
            label='Upload a profile picture'
            accept='image/x-png,image/jpeg'
            iconName='image'
        />
        <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Register</Button>
    </Form>
)

export default reduxForm({
    form: 'signUp',
    validate
})(SignUpForm);
