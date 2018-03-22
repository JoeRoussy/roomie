import React from 'react';
import { Grid, Image, Button, Card } from 'semantic-ui-react';
import moment from 'moment';

import './styles.css';

const ProfileDisplay = ({
    user,
    isDeleting,
    isDeletePending,
    onEditClicked,
    onDeleteClicked,
    onCancelDeleteClicked,
    onDeleteConfirmedClicked,
    navigateTo
}) => {
    // NOTE: Since this is an inner component we need to be worried about the user being ripped out the of the state
    if (!user) {
        return '';
    }

    let editSection;

    const viewListingsButton = user.isLandlord ? (
        <Button className='primaryColour' id="viewListingsProfileButton" onClick = { () => navigateTo('/my-listings') }>View my listings</Button>
    ) : ('');

    if (isDeleting) {
        editSection = (
            <Card id="deleteProfileConfirmation">
                <Card.Content>
                    <Card.Header>Warning</Card.Header>
                    <Card.Description>
                        <p>This action will permanently delete your account.</p>
                        <p>Are you sure?</p>
                        <Button id="confirmDeleteProfileButton" color="red" loading={isDeletePending} onClick={onDeleteConfirmedClicked}>Permanently Delete My Account</Button>
                        <Button id="cancelDeleteProfileButton" color="green" onClick={onCancelDeleteClicked}>Keep My Account</Button>
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    } else {
        editSection = (
            <div>
                {viewListingsButton}
                <Button className='primaryColour' id="editProfileButton" onClick={onEditClicked}>Edit Profile</Button>
                <Button id="deleteProfileButton" color="red" onClick={onDeleteClicked}>Delete Profile</Button>
            </div>
        );
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
                    {editSection}
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default ProfileDisplay;
