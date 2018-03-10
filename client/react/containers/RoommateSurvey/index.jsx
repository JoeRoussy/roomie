import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { submitForm } from '../../../redux/actions/signInActions';
import RoommateSurveyForm from '../../components/RoommateSurveyForm';

import './styles.css';

const RoommateSurvey = ({
    user,
    onSubmit,
    isFormProcessing,
    errorMessage,
    formValues
}) => (
    <div>
        {user ? (<Redirect to='/'/>) : ('')}
        <h1>Roommate Matching</h1>
        <h2>Complete the following survey to get matched with potential roomates based on your interests</h2>
        <p>The survey has statements associated with sliders from 1 to 10. Choose 10 if you strongly agree with the statement and choose 1 if you completely disagree with the statement.</p>
        <RoommateSurveyForm
            onSubmit={onSubmit(formValues)}
            isProcessing={isFormProcessing}
            errorMessage={errorMessage}
        >
        </RoommateSurveyForm>
    </div>
);

const mapStateToProps = ({
    userReducer: {
        user
    } = {},
    signInReducer: {
        isFormProcessing,
        errorMessage
    } = {},
    form: {
        roommateSurvey: {
            values
        } = {}
    } = {}
}) => ({
    user,
    isFormProcessing,
    errorMessage,
    formValues: values
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoommateSurvey);
