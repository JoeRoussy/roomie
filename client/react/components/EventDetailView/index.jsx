import React from 'react';
import { Transition, Modal, Button, Icon } from 'semantic-ui-react';
import moment from 'moment';

import './styles.css';

const EventDetailView = ({
    event,
    onClose,
    onDelete
}) => {
    const {
        title = '',
        start,
        end,
        location
    } = event || {};

    const titleDisplay = title.replace(/,/g , ', ');
    const startMoment = moment(start);
    const endMoment = moment(end);
    const locationSection = location ? (
        <p className='subTitle'>{location}</p>
    ) : (
        ''
    );

    const deleteSection = onDelete && event ? (
        <Modal.Actions>
            <Button negative onClick={onDelete(event)}>Delete</Button>
        </Modal.Actions>
    ) : (
        ''
    );

    return (
        <Transition visible={!!event} animation='fly down' duration={500}>
            <Modal
                id='eventDetailView'
                open={!!event}
                className='eventDisplayModal'
                closeIcon={<Icon name='close' onClick={onClose}/>}
            >
                <Modal.Header>Event Details</Modal.Header>
                <Modal.Content>
                    <p className='title'>{titleDisplay}</p>
                    {locationSection}
                    <p>
                        <span className='rowTitle'>Date:&nbsp;</span>
                        <span>{startMoment.format('MMMM Do YYYY')}</span>
                    </p>
                    <p>
                        <span className='rowTitle'>Start:&nbsp;</span>
                        <span>{startMoment.format('h:mm a')}</span>
                    </p>
                    <p>
                        <span className='rowTitle'>End:&nbsp;</span>
                        <span>{endMoment.format('h:mm a')}</span>
                    </p>
                </Modal.Content>
                {deleteSection}
            </Modal>
        </Transition>
    )
};

export default EventDetailView;
