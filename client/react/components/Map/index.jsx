import React, { Component } from 'react';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

class MapComponent extends Component {
    constructor(props){
        super(props)
        this.fetchPlaces = this.fetchPlaces.bind(this);
    }

    fetchPlaces() {
        this.props.google.initialCenter = this.props.position;
    }

    render(){
        const style = {
            width: '60%',
            height: '60%'
        }

        const zoom = 15;

        const {
            position
        } = this.props
        console.log(position)

        const marker = <Marker 
            position = {position}
        />

         return (
            <Map    
                    google = {this.props.google}
                    style = {style}
                    zoom = {zoom}
                    initialCenter={position}
                    onReady = {this.fetchPlaces}
            >
                {marker}
            </Map>
        )
    }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBQMMJ8Tjvh9dFmshAM_eMGCqOHzBFUwRw'
})(MapComponent)