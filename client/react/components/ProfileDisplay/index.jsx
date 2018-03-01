import React from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import moment from 'moment';

const ProfileDisplay = ({
    user,
    onEditClicked
}) => {
    // NOTE: Since this is an inner component we need to be worried about the user being ripped out the of the state
    if (!user) {
        return '';
    }

    return (
        <div id='profileDisplayWrapper'>
            <Grid id='prodileDisplayGrid' columns={2} centered>
                <Grid.Column>
                    <Image className='profilePicture' src={`${process.env.ASSETS_ROOT}${user.profilePictureLink}`} />
                </Grid.Column>
                <Grid.Column>
                    <h2>{user.name}</h2>
                    <p id='profileEmail'>{user.email}</p>
                    <p id='profileJoined'>Joined: {moment(user.createdAt).format('MMMM Do YYYY')}</p>
                    <Button id="editProfileButton" onClick={onEditClicked}>Edit Profile</Button>
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default ProfileDisplay;
