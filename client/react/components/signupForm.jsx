import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button } from 'semantic-ui-react';
import { LabelInputField } from 'react-semantic-redux-form';

const SignUpForm = ({
    onSubmit,
    validate = () => ({}) // Return no errors by default
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
            label={{ content: <Icon color='blue' name='user' size='large' /> }}
            labelPosition='left'
            placeholder='Email'
        />
        <Field
            name='password'
            component={LabelInputField}
            label={{ content: <Icon color='blue' name='user' size='large' /> }}
            labelPosition='left'
            placeholder='Password'
        />
    </Form>
);

export default reduxForm({
    form: 'signUp'
})(SignUpForm);
