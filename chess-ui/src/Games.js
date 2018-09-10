import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';
import { TokenProvider, ChatManager } from '@pusher/chatkit';
import Rooms from './Rooms';
import Chat from './Chat';
import axios from 'axios';

export default class Games extends React.Component {
    state = {
        joined: [],
        joinable: []
    };

    constructor(props) {
        super(props);
        this.chatManager = new ChatManager({
            instanceLocator: 'CHATKIT_INSTANCE_LOCATOR',
            tokenProvider: new TokenProvider({
                url: "http://localhost:4000/auth",
            }),
            userId: props.username
        });
        this.chatManager.connect().then(currentUser => {
            this.setState({
                currentUser: currentUser
            });

            currentUser.getJoinableRooms().then((rooms) => {
                let lobby = rooms.find(room => room.name === 'Lobby');
                if (lobby) {
                    currentUser.joinRoom({ roomId: lobby.id });
                } else {
                    lobby = currentUser.rooms.find(room => room.name === 'Lobby');
                }
                if (lobby) {
                    this.setState({
                        lobbyId: lobby.id,
                        activeRoom: lobby.id
                    });
                }
            });

            setInterval(this._pollRooms.bind(this), 5000);
            this._pollRooms();
        }).catch((e) => {
            console.log('Failed to connect to Chatkit');
            console.log(e);
        });
    }

    _pollRooms() {
        const { currentUser } = this.state;

        currentUser.getJoinableRooms()
            .then((rooms) => {
                this.setState({
                    joined: currentUser.rooms,
                    joinable: rooms
                })
            });
    }

    _enterRoom(id) {
        const { currentUser } = this.state;
        currentUser.joinRoom({ roomId: id })
            .then(() => {
                this.setState({
                    activeRoom: id
                });
                this._pollRooms();
            })
            .catch(() => {
                console.log('Failed to enter room');
            });
    }

    _leaveRoom(id) {
        const { currentUser } = this.state;
        currentUser.leaveRoom({ roomId: id })
            .then(() => {
                this._pollRooms();
            })
            .catch(() => {
                console.log('Failed to leave room');
            });
    }

    _startedGame(roomId, white, black) {
        axios.request({
            url: 'http://localhost:4000/games',
            method: 'POST',
            data: {
                room: roomId,
                whitePlayer: white,
                blackPlayer: black
            }
        })
        .then((response) => {
            console.log(response);
            this.setState({
                activeRoom: roomId
            });
            this._pollRooms();
        });
    }

    render() {
        const { currentUser } = this.state;
        let chat;
        if (currentUser) {
            const room = currentUser.rooms.find((room) => room.id == this.state.activeRoom);
            if (room) {
                const game = this.state.activeRoom !== this.state.lobbyId && this.state.activeRoom;
                chat = <Chat user={currentUser} room={room} key={room.id} startedGame={this._startedGame.bind(this)} game={game} />
            }
        }

        return (
            <Segment>
                <Grid>
                    <Grid.Column width={4}>
                        <Rooms joined={this.state.joined}
                               joinable={this.state.joinable}
                               activeRoom={this.state.activeRoom}
                               enterRoom={this._enterRoom.bind(this)}
                               leaveRoom={this._leaveRoom.bind(this)} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        { chat }
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    }
}
