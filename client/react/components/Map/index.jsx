import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { Dimmer, Loader } from 'semantic-ui-react';


export default compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBQMMJ8Tjvh9dFmshAM_eMGCqOHzBFUwRw&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: '100%' }} />,
        containerElement: <div style={{ height: '75vh' }} />,
        mapElement: <div style={{ height: '100%' }} />,
    }),
    withScriptjs,
    withGoogleMap
)(({
    position,
    loaded
}) => {
    if(loaded){
        return (
            <Dimmer active>
                <Loader>Loading Map...</Loader>
            </Dimmer>
        );
    }

    return (
        <GoogleMap
            defaultZoom={15}
            center={position}
        >
            <Marker position={position} />
        </GoogleMap>
    );
});
