import React, { Component } from 'react';
import PlacesAutoComplete from 'react-places-autocomplete';

class WrappedPlacesAutoComplete extends Component{
    render(){
        return (
            <PlacesAutoComplete inputProps={{...this.props.inputProps, placeholder: 'Enter a destination...'}}/>
        )
    }
}

export default WrappedPlacesAutoComplete;