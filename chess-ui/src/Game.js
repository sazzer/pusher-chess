import React from 'react';
import axios from 'axios';
import { Grid, List } from 'semantic-ui-react';
import Pusher from 'pusher-js';

var pusher = new Pusher('PUSHER_APP_KEY', {
    cluster: 'PUSHER_CLUSTER',
    forceTLS: true
  });

const PIECES = {
    'WK': '♔',
    'WQ': '♕',
    'WR': '♖',
    'WB': '♗',
    'WN': '♘',
    'WP': '♙',
    'BK': '♚',
    'BQ': '♛',
    'BR': '♜',
    'BB': '♝',
    'BN': '♞',
    'BP': '♟'
}

export default class Game extends React.Component {
    state = {
        board: [],
        players: {}
    };

    render() {
        const board = this.state.board
            .map((row, rowIndex) => {
                return row.map((piece, columnIndex) => {
                    const pieceSymbol = PIECES[piece];
                    if (pieceSymbol) {
                        return <text key={rowIndex + '-' + columnIndex} x={columnIndex} y={rowIndex + 0.8} style={{font: '1px sans-serif'}}>{pieceSymbol}</text>
                    }
                }).filter((value) => value);
            });

        let activeCell;
        if (this.state.activeCell) {
            activeCell = <rect x={this.state.activeCell.x} y={this.state.activeCell.y} width="1" height="1" fillOpacity="0.5" fill="#F00" />
        }

        const players = Object.keys(this.state.players).map((player) => {
            const color = this.state.players[player];
            return (
                <List.Item>
                    <List.Header>{ color }</List.Header>
                    { player }
                </List.Item>
            );
        });

        return (
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="-.05 -.05 8.1 8.1">
                            <rect x="-.5" y="-.5" width="9" height="9" style={{fill: '#F4A460'}} />
                            <path fill="#FFEBCD" d="M0,0H8v1H0zm0,2H8v1H0zm0
                            2H8v1H0zm0,2H8v1H0zM1,0V8h1V0zm2,0V8h1V0zm2
                            0V8h1V0zm2,0V8h1V0z"/>

                            { [].concat.apply([], board) }

                            { activeCell }
                            <rect x="0" y="0" width="8" height="8" fillOpacity="0.1" onClick={(e) => this._handleBoardClick(e)} />
                        </svg>
                    </Grid.Column>
                    <Grid.Column>
                        <List>
                            { players }
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    componentDidMount() {
        const room = this.props.room;

        const channel = pusher.subscribe(`game-${room}`);
        channel.bind('board-updated', () => {
            this._refreshGame();
        });
        this._refreshGame();
    }

    componentWillUnmount() {
        const room = this.props.room;

        const channel = pusher.unsubscribe(`game-${room}`);
    }

    _handleBoardClick(e) {
        const dim = e.target.getBoundingClientRect();
        const x = e.clientX - dim.left;
        const y = e.clientY - dim.top;

        const cellX = Math.floor((x / 200) * 8);
        const cellY = Math.floor((y / 200) * 8);

        if (this.state.activeCell) {
            if (this.state.activeCell.x === cellX && this.state.activeCell.y === cellY) {
                this.setState({
                    activeCell: null
                });
            } else {
                axios.request({
                    method: 'POST',
                    url: 'http://localhost:4000/games/' + this.props.room,
                    data: {
                        player: this.props.user.id,
                        fromRow: this.state.activeCell.y,
                        fromColumn: this.state.activeCell.x,
                        toRow: cellY,
                        toColumn: cellX
                    }
                });
                this.setState({
                    activeCell: null
                });
            }
        } else {
            this.setState({
                activeCell: {
                    x: cellX,
                    y: cellY
                }
            });
        }
    }

    _refreshGame() {
        axios.request({
            url: 'http://localhost:4000/games/' + this.props.room
        })
        .then((response) => {
            this.setState({
                board: response.data.board,
                players: response.data.players
            });
        });
    }
}
