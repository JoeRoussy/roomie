import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { change } from 'redux-form';
import { Container } from 'semantic-ui-react';

import { submitForm } from '../../../redux/actions/roommateSurveyActions';
import { getProvinces, getCitiesForProvince } from '../../../redux/actions/locationActions'
import RoommateSurveyForm from '../../components/RoommateSurveyForm';
import { roommateSurvey as constants } from '../../../../common/constants';

import './styles.css';

@connect(({
    userReducer: {
        user
    } = {},
    roommateSurveyReducer: {
        isFormProcessing,
        errorMessage
    } = {},
    form: {
        roommateSurvey: {
            values
        } = {}
    } = {},
    locationReducer: {
        provinces,
        cities,
        isProvincesLoading
    } = {}
}) => ({
    user,
    isFormProcessing,
    errorMessage,
    formValues: values,
    provinces,
    cities,
    isProvincesLoading
}))
class RoommateSurvey extends React.Component {
    constructor() {
        super();

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
        this.fetchCitiesForProvince = this.fetchCitiesForProvince.bind(this);
        this.questions = constants.questions;
        this.initialFormValues = this.questions.reduce((accumulator, currentValue, currentIndex) => ({
            [`question${currentIndex}`]: 5,
            ...accumulator
        }), {});
    }

    componentWillMount() {
        this.props.dispatch(getProvinces());
    }

    onFormSubmit(formData) {
        return () => this.props.dispatch(submitForm(formData));
    }

    onSliderChange(slider, value) {
        this.props.dispatch(change('roommateSurvey', slider, value));
    }

    fetchCitiesForProvince(province) {
        this.props.dispatch(getCitiesForProvince(province))
    }

    render() {
        const {
            user,
            onSubmit,
            isFormProcessing,
            errorMessage,
            cities,
            provinces,
            isProvincesLoading,
            formValues
        } = this.props;

        return (
            <Container id='roommateSurveySection' className='rootContainer'>
                {!user ? (<Redirect to='/sign-in'/>) : ('')}
                <h1>Roommate Matching</h1>
                <h2>Complete the following survey to get matched with potential roomates based on your interests</h2>
                <div id='explainationSection'>
                    <p>The survey has statements associated with sliders from 0 to 10. Choose 10 if you strongly agree with the statement and choose 1 if you completely disagree with the statement.</p>
                    <p>Remember to answer honestly or you may be matched up with people you do not get along with. Your responses will never be shared with anyone.</p>
                </div>
                <RoommateSurveyForm
                    onSubmit={this.onFormSubmit(formValues)}
                    isProcessing={isFormProcessing}
                    errorMessage={errorMessage}
                    onSliderChange={this.onSliderChange}
                    questions={this.questions}
                    initialValues={this.initialFormValues}
                    provinces={provinces}
                    onProvinceSelected={(e, province) => this.fetchCitiesForProvince(province)}
                    cities={cities}
                    isProvincesLoading={isProvincesLoading}
                />
            </Container>
        );
    }
}

export default RoommateSurvey;
