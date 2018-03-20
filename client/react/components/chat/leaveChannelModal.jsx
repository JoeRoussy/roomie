import React, {Component} from 'react';
import { Input,Container,Modal,Button,Icon} from 'semantic-ui-react'

const LeaveChannelModal = ({
    channel,
    onAccept,
    onDecline,
    displayModal,
    toggleDisplay
}) => (
    <Container fluid >
        <Modal open={displayModal}>
            <Modal.Header>Leave Channel</Modal.Header>
            <Modal.Content>
                Are you sure you want to leave {channel.name}?
            </Modal.Content>
            <Modal.Actions>
                <Button positive onClick={()=>{onAccept()}}>Yes <Icon name='checkmark'/></Button>
                <Button negative onClick={()=>{onDecline()}}>No <Icon name='remove'/></Button>
            </Modal.Actions>
        </Modal>

    </Container>
);

export default LeaveChannelModal;
