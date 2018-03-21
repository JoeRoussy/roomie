import React from 'react';
import { Container, Modal, Button, Icon} from 'semantic-ui-react'

const DeleteItemModal = ({
    header,
    content,
    onAccept,
    onDecline,
    displayModal
}) => (
    <Container fluid >
        <Modal open={displayModal}>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>
                {content}
            </Modal.Content>
            <Modal.Actions>
                <Button type='button' positive onClick={()=>{onAccept()}}><Icon name='checkmark'/> Yes </Button>
                <Button type='button' negative onClick={()=>{onDecline()}}><Icon name='remove'/> No </Button>
            </Modal.Actions>
        </Modal>
    </Container>
);

export default DeleteItemModal;
