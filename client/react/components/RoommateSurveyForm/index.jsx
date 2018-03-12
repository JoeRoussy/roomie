import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button, Input, Message, Segment } from 'semantic-ui-react';
import { Dropdown } from 'react-semantic-redux-form';
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
        email,
        password
    } = values;



    return errors;
};

const RoommateSurveyForm = ({
    valid,
    onSubmit,
    errorMessage,
    isProcessing,
    onSliderChange,
    formValues,
    questions
}) => (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Message
            error
            header='Error'
            content={errorMessage}
        />
        <Field
            name='cities'
            component={Dropdown}
            multiple
            search
            selection
        />
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
