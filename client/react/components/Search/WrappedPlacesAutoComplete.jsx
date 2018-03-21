import React from 'react';
import PlacesAutoComplete from 'react-places-autocomplete';

const WrappedPlacesAutoComplete = ({   
    inputProps
}) => (
    <div>
         <PlacesAutoComplete 
            inputProps={{...inputProps, placeholder: 'Enter a destination...'}}
        />
    </div>
)

export default WrappedPlacesAutoComplete;


