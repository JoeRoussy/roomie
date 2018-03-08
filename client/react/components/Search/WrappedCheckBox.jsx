import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import _without from 'lodash/without'

const onChange = (input, label) => (event, data) => {
    var oldValues = input.value || [];
    var newValues = _without(oldValues, label);
    if (data.checked) {
        newValues = oldValues.concat(label);
    }
    input.onChange(newValues);
}

const WrappedCheckBox = ({
    label,
    input
}) => (
    <Checkbox  
        label = {label}
        checked={input.value.indexOf(label) != -1}
        onChange={onChange(input, label)}
    />
)

export default WrappedCheckBox;
