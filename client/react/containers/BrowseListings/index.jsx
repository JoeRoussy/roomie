import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Button, Card, Icon, Image, Grid , Loader, Dimmer, Segment} from 'semantic-ui-react';

import { getListings } from '../../../redux/actions/listingActions';
import ListingCard from '../../components/ListingCard';
import { search, handleLocationChange } from '../../../redux/actions/searchActions';
import ViewListingsSearch from '../../components/Search/ViewListingsSearch';
import './styles.css';

@connect((store) => ({
    listings: store.searchReducer.listings,
    waitingForSearch: store.searchReducer.pending,
    locationVal: store.searchReducer.location,
    formInfo: store.form.viewListingsSearch,
    errorMessage: store.searchReducer.errorMessage
}))

export default class Listings extends React.Component {
    constructor(props) {
        super(props);

        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.mapListings = this.mapListings.bind(this);
        this.processForm = this.processForm.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        this.viewListing = this.viewListing.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(search());
    }

    handleLocationChange(val){
        this.props.dispatch(handleLocationChange(val))
    }

    mapListings = (listings) => listings.map((listing, i) =>
        <ListingCard key = { i } listing = { listing } id = { i } viewListing = { () => this.viewListing(listing) } />)

    processForm(form) {
        const {
            values: {
                bathrooms,
                bedrooms,
                furnished,
                keywords,
                maxPrice,
                minPrice,
                type,
                utilities,
                parking,
                internet,
                laundry,
                ac
            } = {}
        } = form;

        const location = this.props.locationVal;

        const processedArgs = [];
        if(bathrooms) processedArgs.push(`bathrooms=${bathrooms}`);
        if(bedrooms) processedArgs.push(`bedrooms=${bedrooms}`);
        if(furnished) processedArgs.push(`furnished=${furnished}`);
        if(keywords) processedArgs.push(`keywords=${keywords}`);
        if(location) processedArgs.push(`location=${location}`);
        if(maxPrice) processedArgs.push(`maxPrice=${maxPrice}`);
        if(minPrice) processedArgs.push(`minPrice=${minPrice}`);
        if(type) processedArgs.push(`type=${type}`);
        if(utilities) processedArgs.push(`utilities=${utilities}`);
        if(parking) processedArgs.push(`parking=${parking}`);
        if(internet) processedArgs.push(`internet=${internet}`);
        if(laundry) processedArgs.push(`laundry=${laundry}`);
        if(ac) processedArgs.push(`ac=${ac}`);

        return processedArgs;
    }

    submitSearch() {
        const processedForm = this.processForm(this.props.formInfo);
        if(!processedForm) return;
        this.props.dispatch(search(processedForm, processedForm.length));
    }

    // Called when a listing card is clicked.
    // Route to the appropriate listing page using the id.
    viewListing(listing) {
        // Route to the view listing page with the id of this listing
        const path = `/listings/${listing._id}`;
        this.props.dispatch(push(path));
    }

    render() {
        const locationProps = {
            value: this.props.locationVal,
            onChange: (event) => this.handleLocationChange(event),
            onKeyUp: (event) => {if(event.keyCode==13) this.submitSearch()}
        }

        const { listings, waitingForSearch} = this.props;

        let body;
        if(waitingForSearch){
            //TODO: fix css such that the dimmer doesnt flow into menu bar
            body = (<div>
                        <Dimmer active>
                            <Loader inline inverted>Fetching Results</Loader>
                        </Dimmer>
                    </div>)
        } else{
            body = listings.length ? (
                <Card.Group>
                    { this.mapListings(listings) }
                </Card.Group>
            ) : (
                <p>No listings found</p>
            );
        }


        return (
            <Container className='rootContainer'>
                <Grid>
                    <Grid.Column width={4}>
                        <ViewListingsSearch locationProps={locationProps} submitSearch={this.submitSearch} errorMessage={this.props.errorMessage} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {body}
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}
