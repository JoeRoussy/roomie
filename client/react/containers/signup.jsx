import React from 'react';
import SignUpForm from '../components/signupForm';

const onSubmit = (e) => {

};

// TODO: Actually validate stuff
const validate = (values) => {
    let errors = {};

    return errors;
}

const signup = () => (
    <div>
        <h1>Sign up</h1>
        <SignUpForm onSubmit={onSubmit} validate={validate}></SignUpForm>
    </div>
);

export default signup;
