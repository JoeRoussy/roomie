import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';
import { InputField } from 'react-semantic-redux-form';

import { isPassword } from '../../../../common/validation';

import './styles.css';

const validate = (values) => {
    let errors = {};

    const {
        password,
        confirmPassword
    } = values;

    const isPasswordValid = isPassword(password);

    if (!isPasswordValid) {
        errors = {
            ...errors,
            password: 'Please choose a password that is at least 6 character in length'
        };
    }

    if (isPasswordValid && password !== confirmPassword) {
        errors = {
            ...errors,
            confirmPassword: 'Passwords must match'
        };
    }

    return errors;
};


const PasswordResetForm = ({
    onSubmit,
    errorMessage,
    valid,
    isProcessing
}) => (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />
        <Field
            name='password'
            component={InputField}
            placeholder='Password'
            type='password'
        />
        <Field
            name='confirmPassword'
            component={InputField}
            placeholder='Confirm Password'
            type='password'
        />
        <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Update Password</Button>
    </Form>
);

export default reduxForm({
    form: 'passwordResetForm',
    validate
})(PasswordResetForm);
