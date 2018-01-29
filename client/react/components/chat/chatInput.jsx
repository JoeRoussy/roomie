import React, {Component} from 'react';
import { Input,Container} from 'semantic-ui-react'

import './styles.css';

const chatInput = ({
    onChange,
    onKeyUp,
    text
}) => (
    <Container fluid >
            <Input
                className='chatInput'
                placeholder='Write a message'
                onChange={onChange}
                onKeyUp={onKeyUp}
                value={text}
            />
    </Container>
);

export default chatInput;
