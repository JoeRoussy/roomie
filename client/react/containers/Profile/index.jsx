import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container } from 'semantic-ui-react';

import ProfileForm from '../../components/ProfileForm';


const Profile = ({
    formData,
    onSubmit,
    user
}) => {
    const redirectSection = user ? '' : <Redirect to='/sign-in'/>;

    return (
        <Container>
            <h1>Profile</h1>
            {redirectSection}
            <ProfileForm
                onSubmit={onSubmit(formData)}
                initialValues={{ ...user }}
            />
        </Container>
    );
};

const mapStateToProps = ({
    userReducer: {
        user
    } = {},
    form: {
        profile: {
            values
        } = {}
    } = {}
}) => ({
    user,
    formData: values
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => console.log(formData)
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
