import React from 'react';
import SignUpForm from '../components/signupForm';

const onSubmit = (e) => {

};

const signup = () => (
    <div>
        <h1>Sign up</h1>
        <SignUpForm onSubmit={onSubmit}></SignUpForm>
    </div>
);

export default signup;
