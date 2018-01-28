import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Input, Message } from 'semantic-ui-react';
import { LabelInputField } from 'react-semantic-redux-form';


const validate = (values) => {
    let errors = {};

    const {
        email,
        password
    } = values;

    if (!email) {
        errors = {
            email: 'Please enter your email',
            ...errors
        };
    }

    if (!password) {
        errors = {
            password: 'Please enter your password',
            ...errors
        };
    }

    return errors;
};

// NOTE: Valid is a prop passed in from redux from.
const SignInForm = ({
    valid,
    onSubmit,
    errorMessage,
    isProcessing
}) => (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />
        <Field
            name='email'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='user' size='large' /> }}
            labelPosition='left'
            placeholder='Email'
        />
        <Field
            name='password'
            type='password'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='lock' size='large' /> }}
            labelPosition='left'
            placeholder='Password'
        />
        <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Log In</Button>
    </Form>
);

export default reduxForm({
    form: 'signIn',
    validate
})(SignInForm);
