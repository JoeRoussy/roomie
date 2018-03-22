import React from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';

import './styles.css';

const MeetingCard = ({
    acceptMeeting,
    declineMeeting,
    participants,
    date,
    start,
    end,
    listing = ' '
}) => (
    <Card>
        <Card.Content>
            <Card.Header>
                {participants}
            </Card.Header>
            <Card.Meta>
                {listing} <br/>
                {date} <br/>
                Start: {start} <br/>
                End: {end} <br/>
            </Card.Meta>
        </Card.Content>

        <Card.Content extra>
            <div className='ui two buttons'>
                <Button basic color='green' onClick={acceptMeeting}>Approve</Button>
                <Button basic color='red' onClick={declineMeeting}>Decline</Button>
            </div>
        </Card.Content>
    </Card>
)

export default MeetingCard;
