import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, Message } from 'semantic-ui-react';
import { InputField } from 'react-semantic-redux-form';

import { isEmail } from '../../../../common/validation';

import './styles.css';

const validate = (values) => {
    let errors = {};

    const {
        email
    } = values;

    if (!isEmail(email)) {
        errors = {
            email: 'Please enter a valid email'
        };
    }

    return errors;
};


const ForgotPasswordEmailForm = ({
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
            name='email'
            component={InputField}
            placeholder='Email'
        />
    <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Send Email</Button>
    </Form>
);

export default reduxForm({
    form: 'forgotPasswordEmail',
    validate
})(ForgotPasswordEmailForm);
