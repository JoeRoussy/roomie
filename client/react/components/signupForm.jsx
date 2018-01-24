import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Input } from 'semantic-ui-react';
import { LabelInputField, InputField } from 'react-semantic-redux-form';

const validate = (values) => {
    // TODO ...

    return {};
}

const SignUpForm = ({
    onSubmit,
    isProcessing
}) => (
    <Form onSubmit={onSubmit}>
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
        <Button type='submit' color='green' loading={isProcessing} disabled={isProcessing}>Join</Button>
    </Form>
);

export default reduxForm({
    form: 'signUp',
    validate
})(SignUpForm);
