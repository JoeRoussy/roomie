import React from 'react';
import moment from 'moment';
import { Card, Image } from 'semantic-ui-react';

const ProfileCard = ({
    topExtras = '',
    bottomExtras = '',
    user,
    raised = false,
    ...props
}) => (
    <Card className='profileCard' raised {...props}>
        {topExtras}
        <Card.Content>
            <Image size='tiny' floated='right' src={`${process.env.ASSETS_ROOT}${user ? user.profilePictureLink : ''}`} />
            <Card.Header>
                {user ? user.name : ''}
            </Card.Header>
            <Card.Meta>
                <span>Joined:</span>
            </Card.Meta>
            <Card.Meta>
                <span>{user ? moment(user.createdAt).format('MMMM Do YYYY') : ''}</span>
            </Card.Meta>
        </Card.Content>
        {bottomExtras}
    </Card>
);

export default ProfileCard;
