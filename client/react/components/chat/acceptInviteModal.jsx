import React, {Component} from 'react';
import { Input,Container,Modal,Button,Icon} from 'semantic-ui-react'

const AcceptInviteModal = ({
    channel,
    onAccept,
    onDecline,
    displayModal,
    toggleDisplay
}) => (
    <Container fluid >
        <Modal open={displayModal}>
            <Modal.Header>Channel Invitation</Modal.Header>
            <Modal.Content>
                You have been invted to the channel {channel.name}.
            </Modal.Content>
            <Modal.Actions>
                <Button positive onClick={()=>{onAccept()}}>Accept <Icon name='checkmark'/></Button>
                <Button negative onClick={()=>{onDecline()}}>Decline <Icon name='remove'/></Button>
            </Modal.Actions>
        </Modal>

    </Container>
);

export default AcceptInviteModal;
