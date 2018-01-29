import React from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';

const ProfileDisplay = ({
    user,
    onEditClicked
}) => (
    <div id='profileDisplayWrapper'>
        <Grid id='prodileDisplayGrid' columns={2}>
            <Grid.Column>
                <Image src={user.profileImage} />
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

export default ProfileDisplay;
