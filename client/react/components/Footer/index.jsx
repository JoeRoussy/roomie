import React from 'react';
import { Container, Grid, Image, Icon } from 'semantic-ui-react';


import './styles.css';


const Footer = () => (
    <Container>
        <div id='footerParent'>
            <Grid centered stackable columns={2}>
                <Grid.Column textAlign='center'>
                    <div>
                        <Image id='footerLogo' src='/images/logo-white.png'/>
                    </div>
                    <div>
                        <span>© Roomie 2018</span>
                    </div>
                </Grid.Column>
                <Grid.Column id='footerContactSection' textAlign='center'>
                    <div className='row'>
                        <span className='heading'>Contact Us</span>
                    </div>
                    <div className='row'>
                        <Icon name='mail'/>
                        <a className='besideIcon' href="mailto:support@roomie.tech">support@roomie.tech</a>
                    </div>
                    <div className='row'>
                        <Icon name='phone'/>
                        <a className='besideIcon' href="tel:+15196701312">(519) 670-1312</a>
                    </div>
                </Grid.Column>
            </Grid>
        </div>
    </Container>
);

export default Footer;