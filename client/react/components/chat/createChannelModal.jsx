import React, {Component} from 'react';
import { Input,Container,Modal,Button,Icon} from 'semantic-ui-react'

const CreateChannelModal = ({
    onChange,
    onConfirm,
    onClose,
    text,
    displayModal,
}) => (
    <Container fluid >
        <Modal open={displayModal} onClose={onClose}>
            <Modal.Header>Create Channel</Modal.Header>
            <Modal.Content>
                <Input
                    placeholder='Channel Name'
                    onChange={onChange}
                    value={text}
                    fluid
                />
            </Modal.Content>
            <Modal.Actions>
                <Button positive onClick={()=>{onConfirm()}}>Create <Icon name='checkmark'/></Button>
                <Button negative onClick={()=>{onClose()}}>Cancel <Icon name='remove'/></Button>
            </Modal.Actions>
        </Modal>

    </Container>
);

export default CreateChannelModal;
