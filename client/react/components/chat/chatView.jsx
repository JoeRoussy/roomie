import { Button, Comment, Container, Menu, Icon } from 'semantic-ui-react';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';

import './styles.css';

const ProcessBody = ({
    message
}) => {
    const body = message.body;
    if(body){
        const parts = body.split(' ');
        return parts.map((part, i)=>{
            const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
            const regex = new RegExp(expression);
            if(part.match(regex)){
                return <a href = { part } target="_blank"> {part} </a>
            }
            else{
                return part + ' ';
            }
        })
    }
    return "";
}

const ListComments = ({
    chatLog,
    users
}) => {
    return chatLog.map((message,i) => {
        //Check incase a message from a user not in this chat
        if(!users[message.userId]){
            return
        }
        if(message.failed){
            return (
                <Comment key= {i}>
                    <Comment.Avatar src={`${process.env.ASSETS_ROOT}${users[message.userId].profilePictureLink}`} />
                    <Comment.Content>
                        <Comment.Author as='a'>{users[message.userId].name}</Comment.Author>
                        <Comment.Metadata>
                            <div>{moment(message.createdAt).fromNow()}</div>
                        </Comment.Metadata>
                        <Comment.Text>{ProcessBody({message})}</Comment.Text>
                        <Comment.Actions>
                            <Comment.Action><Icon color='red' name='warning sign' />Failed to send this message</Comment.Action>
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>
            )
        }
        return (
            <Comment key= {i}>
                <Comment.Avatar src={`${process.env.ASSETS_ROOT}${users[message.userId].profilePictureLink}`} />
                <Comment.Content>
                    <Comment.Author as='a'>{users[message.userId].name}</Comment.Author>
                    <Comment.Metadata>
                        <div>{moment(message.createdAt).fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text>{ProcessBody({message})}</Comment.Text>
                </Comment.Content>
            </Comment>
        )
    });
}


const ChatView = ({
    chatLog,
    users
}) => (
    <div>
        <Comment.Group id='chatView'>
            {ListComments({chatLog,users})}
        </Comment.Group>
    </div>
);


export default ChatView;
