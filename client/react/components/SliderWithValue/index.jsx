import React from 'react';

import { Slider } from 'react-semantic-ui-range';
import { Label } from 'semantic-ui-react';

import './styles.css';

// We had some problems getting the values of the sliders into redux form so the parent must pass in an onValueChange callback that takes care of that
export const SliderWithValue = ({
    currentValue,
    onValueChange,
    label,
    sliderSettings,
    fieldName,
    input
}) => (
    <div className='sliderWithValue'>
        <p className='label'>{label}</p>
        <input
            type='hidden'
            {...input}
        />
        <Slider
            color='blue'
            inverted={false}
            settings={{
                ...sliderSettings,
                onChange: (value) => {
                    onValueChange(input.name, value)
                }
            }}
        />
    <Label color='blue'>{input.value}</Label>
    </div>

)
