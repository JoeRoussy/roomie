import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';

import ChangePasswordForm from '../../components/ChangePasswordForm';
import { navigateTo as getNavigateTo } from '../../utils';
import { submitForm } from '../../../redux/actions/changePasswordActions';

import './styles.css';

const ChangePassword = ({
    onSubmit,
    errorMessage,
    navigateTo
}) => {
    return (
        <Container>
            <h1>Change Password</h1>
            <ChangePasswordForm onSubmit={onSubmit} errorMessage={errorMessage} navigateTo={navigateTo} />
        </Container>
    );
}

const mapStateToProps = ({
    changePasswordReducer: {
        errorMessage
    } = {}
}) => ({
    errorMessage
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => dispatch(submitForm(formData)),
    navigateTo: getNavigateTo(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
