import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Input, Message, Segment } from 'semantic-ui-react';
import { Dropdown, SelectField } from 'react-semantic-redux-form';
import { Slider } from 'react-semantic-ui-range';

import { SliderWithValue } from '../SliderWithValue';

import './styles.css'

const sliderSettings = {
    start: 5,
    min: 0,
    max: 10,
    step: 1
};

const validate = (values) => {
    let errors = {};

    const {
        city
    } = values;

    if (!city) {
        errors.city = 'Please select a city';
    }

    return errors;
};

const RoommateSurveyForm = ({
    valid,
    onSubmit,
    errorMessage,
    isProcessing,
    onSliderChange,
    formValues,
    questions,
    cities,
    provinces,
    isProvincesLoading,
    onProvinceSelected
}) => (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />
        <Field
            name='province'
            label='What province are you looking at?'
            component={SelectField}
            placeholder='Select Province'
            options={provinces}
            loading={isProvincesLoading}
            onChange={onProvinceSelected}
        />
        {cities ? (
            <Field
                name='city'
                label='What city are you looking at?'
                component={SelectField}
                placeholder='Select City'
                options={cities}
            />
        ) : ''}
        {questions.map((question, index) => {
            const name = `question${index}`;

            return (
                <Segment raised key={`${name}Segment`}>
                    <Field
                        key={name}
                        name={name}
                        component={SliderWithValue}
                        label={question}
                        sliderSettings={sliderSettings}
                        fieldName={name}
                        onValueChange={(id, value) => onSliderChange(id, value)}
                    />
                </Segment>
            );

        })}
        <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Submit</Button>
    </Form>
);

export default reduxForm({
    form: 'roommateSurvey',
    validate
})(RoommateSurveyForm);
