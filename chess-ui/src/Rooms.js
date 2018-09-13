import React from 'react';
import { List, Icon, Header } from 'semantic-ui-react';

export default function Rooms({ joined, joinable, activeRoom, enterRoom, leaveRoom }) {
    const joinedRooms = joined.map((room) => (
        <List.Item key={room.id}>
            { room.id === activeRoom && (
                <List.Content floated='right'>
                    <a onClick={() => leaveRoom(room.id)}>Leave</a>
                </List.Content>)
            }
            <Icon name={room.id === activeRoom ? 'right triangle' : ''} />
            <List.Content>
                <a onClick={() => enterRoom(room.id)}>{ room.name }</a>
            </List.Content>
        </List.Item>
    ));
    const joinableRooms = joinable.map((room) => (
        <List.Item key={room.id}>
            <Icon name="" />
            <List.Content>
                <a onClick={() => enterRoom(room.id)}>{ room.name }</a>
            </List.Content>
        </List.Item>
    ));

    return (
        <div>
            <Header as="h4">Active Rooms</Header>
            <List divided relaxed>
                { joinedRooms }
            </List>
            <Header as="h4">Joinable Rooms</Header>
            <List divided relaxed>
                { joinableRooms }
            </List>
        </div>
    );
}
