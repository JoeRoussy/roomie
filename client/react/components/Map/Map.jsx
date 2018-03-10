import React, { Component } from 'react';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

export class MapComponent extends Component {
    constructor(props){
        super(props)
    }
    render(){
        const style = {
            width: '60%',
            height: '60%'
        }

        const zoom = 15;

        const {
            position = {lat: 37.762, lng: -122.439}
        } = this.props

        const marker = <Marker 
            name = {"Test"}
            position = {position}
        />

         return (
            <Map    
                    google = {this.props.google}
                    style = {style}
                    zoom = {zoom}
                    initialCenter={position}
            >
                {marker}
            </Map>
        )
    }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBQMMJ8Tjvh9dFmshAM_eMGCqOHzBFUwRw'
})(MapComponent)