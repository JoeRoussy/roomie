import React from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';

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
            <Grid id='prodileDisplayGrid' columns={2}>
                <Grid.Column>
                    <Image src={`${process.env.ASSETS_ROOT}${user.profilePictureLink}`} />
                </Grid.Column>
                <Grid.Column>
                    <h2>{user.name}</h2>
                    <p id='profileEmail'>{user.email}</p>
                    <p id='profileJoined'>{user.createdAt}</p>
                </Grid.Column>
            </Grid>
            <Button onClick={onEditClicked}>Edit Profile</Button>
        </div>
    );
}

export default ProfileDisplay;
