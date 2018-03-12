import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { change } from 'redux-form';
import { Container } from 'semantic-ui-react';

import { submitForm } from '../../../redux/actions/roommateSurveyActions';
import RoommateSurveyForm from '../../components/RoommateSurveyForm';
import { roommateSurvey as constants } from '../../../../common/constants';

import './styles.css';

const {
    questions
} = constants;

// Start all the sliders off at 5
const initialFormValues = questions.reduce((accumulator, currentValue, currentIndex) => ({
    [`question${currentIndex}`]: 5,
    ...accumulator
}), {});

const RoommateSurvey = ({
    user,
    onSubmit,
    isFormProcessing,
    errorMessage,
    formValues,
    onSliderChange
}) => (
    <Container id='roommateSurveySection'>
        {user ? (<Redirect to='/'/>) : ('')}
        <h1>Roommate Matching</h1>
        <h2>Complete the following survey to get matched with potential roomates based on your interests</h2>
        <div id='explainationSection'>
            <p>The survey has statements associated with sliders from 0 to 10. Choose 10 if you strongly agree with the statement and choose 1 if you completely disagree with the statement.</p>
            <p>Remember to answer honestly or you may be matched up with people you do not get along with. Your responses will never be shared with anyone.</p>
        </div>
        <RoommateSurveyForm
            onSubmit={onSubmit(formValues)}
            isProcessing={isFormProcessing}
            errorMessage={errorMessage}
            onSliderChange={onSliderChange}
            questions={questions}
            initialValues={initialFormValues}
        />
    </Container>
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

// For the sliders, dispatch value changes directly
const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData)),
    onSliderChange: (slider, value) => dispatch(change('roommateSurvey', slider, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoommateSurvey);
