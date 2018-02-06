import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';
import _without from 'lodash/without'

class WrappedCheckBox extends Component {
    constructor(){
        super();
        this.onChange = this.onChange.bind(this);
    }
    onChange(event, data) {
        const { input, label } = this.props;
        var oldValues = input.value || [];
        var newValues = _without(oldValues, label);
        if (data.checked) {
            newValues = oldValues.concat(label);
        }
        input.onChange(newValues);
    }
    render(){
        const {input, label} = this.props;
        return(
            <Checkbox  
                label = {this.props.label}
                checked={input.value.indexOf(label) != -1}
                onChange={this.onChange}
            />
        )
    }
}

export default WrappedCheckBox;