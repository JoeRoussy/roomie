import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import { Dimmer, Loader } from 'semantic-ui-react';


class MapComponent extends Component {
    constructor(props){
        super(props)
        this.fetchPlaces = this.fetchPlaces.bind(this);
    }

    fetchPlaces() {
        const {
            google
        } = this.props;
        const maps = google.maps;
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);
        const center = new maps.LatLng(this.props.position.lat, this.props.position.lng);
        const mapConfig = Object.assign({},{
            center: center,
            zoom: 15
        })
        this.map = new maps.Map(node, mapConfig);
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

        const marker = <Marker 
            position = {position}
        />

        if(!this.props.loaded){
            return (
                <Dimmer active>
                    <Loader>Loading Map...</Loader>
                </Dimmer>
            )
        }

        return (
            <div>
                <Map    
                    google = {this.props.google}
                    style = {style}
                    zoom = {zoom}
                    initialCenter={position}
                >
                    {marker}
                </Map>
            </div>
        )
    }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBQMMJ8Tjvh9dFmshAM_eMGCqOHzBFUwRw'
})(MapComponent)