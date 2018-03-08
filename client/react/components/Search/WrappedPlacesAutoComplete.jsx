import React from 'react';
import PlacesAutoComplete from 'react-places-autocomplete';

const WrappedPlacesAutoComplete = ({   
    inputProps
}) => (
     <PlacesAutoComplete 
        inputProps={{...inputProps, placeholder: 'Enter a destination...'}}
    />
)

export default WrappedPlacesAutoComplete;


