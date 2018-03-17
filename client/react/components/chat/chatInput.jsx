import React, {Component} from 'react';
import { Input,Container} from 'semantic-ui-react'

const chatInput = ({
    onChange,
    onKeyUp,
    text,
    disabled
}) => (
    <Container fluid >
            <Input
                className='chatInput'
                placeholder='Write a message'
                onChange={onChange}
                onKeyUp={onKeyUp}
                value={text}
                disabled={disabled}
            />
    </Container>
);

export default chatInput;
