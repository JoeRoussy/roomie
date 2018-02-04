import { Button, Comment, Container, Menu, Icon } from 'semantic-ui-react';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const ListComments = ({
    chatLog
}) => chatLog.map((message,i) => (
    <Comment key= {i}>
        <Comment.Content>
            <Comment.Author as='a'>{message.userName}</Comment.Author>
            <Comment.Metadata>
                <div>{message.timestamp}</div>
            </Comment.Metadata>
            <Comment.Text>{message.body}</Comment.Text>
        </Comment.Content>
    </Comment>
));

const ChatView = ({
    chatLog
}) => (
    <div>
        <Comment.Group id='chatView'>
            {ListComments({chatLog})}
        </Comment.Group>
    </div>
);


export default ChatView;
