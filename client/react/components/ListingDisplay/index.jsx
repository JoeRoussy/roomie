import React from 'react';
import { Container, Header, Icon, Image, Item, Label } from 'semantic-ui-react';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.css';

const showImages = (images) => images.map((image, i) =>
        <img key={i} src={`${process.env.ASSETS_ROOT}${image}`} />)

const ListingDisplay = ({
    listing,
    carouselWidth = '80%',
    centered = false
}) => {
    const imagePortion = listing.images ? (
        <Carousel width={carouselWidth}>
            {showImages(listing.images)}
        </Carousel>
    ) : (
        ''
    );

    return (
        <Container id='listingDisplayWrapper'>
            <Header as='h1' textAlign='center'>
              <Header.Content>
                  { listing.name }
              </Header.Content>
            </Header>
            <p className='address'>{ `${listing.street}, ${listing.city} ${listing.postalCode}` }</p>
            <p className='price' color='green'>${listing.price.toFixed(2)}</p>
            <p className={`description${centered ? ' centered' : ''}`}>{listing.description}</p>
            {imagePortion}
        </Container>
    );
}

export default ListingDisplay;
