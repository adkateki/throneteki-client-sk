import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';

import NewGame from './NewGame';
import NewEventGames from './NewEventGames';
import DeleteEventGames from './DeleteEventGames';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import Modal from '../Site/Modal';
import Checkbox from '../Form/Checkbox';
import SwitchButton from '../Form/SwitchButton';

import * as actions from '../../actions';

const GameState = Object.freeze({
    None: 0,
    NewGame: 1,
    PendingGame: 2,
    PasswordedGame: 3,
    Started: 4,
    NewEventGames: 5,
    DeleteEventGames: 6
});

class GameLobby extends React.Component {
    constructor(props) {
        super(props);

        this.onNewGameClick = this.onNewGameClick.bind(this);
        this.onNewEventGamesClick = this.onNewEventGamesClick.bind(this);
        this.onDeleteEventGamesClick = this.onDeleteEventGamesClick.bind(this);
        this.onQuickJoinClick = this.onQuickJoinClick.bind(this);
        this.onModalHidden = this.onModalHidden.bind(this);
        this.onUnlinkClick = this.onUnlinkClick.bind(this);
        this.onGetPatreonTriesClick = this.onGetPatreonTriesClick.bind(this);


        let savedFilter = localStorage.getItem('gameFilter');
        
        if(savedFilter) {
            savedFilter = JSON.parse(savedFilter);
        } else {
            savedFilter = {};
        }



        let filterDefaults = {
            beginner: true,
            casual: true,
            competitive: true,
            showOnlyNewGames: false
        };

        this.state = {
            gameState: GameState.None,
            filter: Object.assign(filterDefaults, savedFilter)
//            achievementMode: achievementMode
        };
    }

    componentDidMount() {
        $('#pendingGameModal').on('hide.bs.modal', this.onModalHidden);

        if(window.Notification && Notification.permission !== 'granted') {
            Notification.requestPermission((status) => {
                if(Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    }

    componentWillReceiveProps(props) {
        if(!props.currentGame) {
            this.props.setContextMenu([]);
        }

        if(props.user) {
            this.setState({ errorMessage: undefined });
        }

        this.setGameState(props);

        if(!this.isPendingGameStillCurrent(props) || this.isGameInProgress(props)) {
            this.setState({ gameState: props.currentGame && props.currentGame.started ? GameState.Started : GameState.None }, () => {
                $('#pendingGameModal').modal('hide');
            });
        } else if(!this.isPasswordGameStillCurrent(props) && !props.currentGame) {
            $('#pendingGameModal').modal('hide');
        } else if(!this.props.passwordGame && props.passwordGame) {
            $('#pendingGameModal').modal('show');
        }

        if(props.currentGame && !this.props.currentGame && !props.currentGame.started) {
            // Joining a game
            $('#pendingGameModal').modal('show');
            this.setState({ gameState: GameState.PendingGame });
        }
    }

    setGameState(props) {
        if(props.passwordGame) {
            this.setState({ gameState: GameState.PasswordedGame });
        } else if(props.currentGame && !props.currentGame.started) {
            this.setState({ gameState: GameState.PendingGame });
        } else if(props.currentGame && props.currentGame.started) {
            this.setState({ gameState: GameState.Started });
        } else if(!props.currentGame && props.newGame && props.user) {
            this.setState({ gameState: GameState.NewGame });
        } else if(!props.currentGame && props.newEventGames && props.user) {
            this.setState({ gameState: GameState.NewEventGames });
        } else if(!props.currentGame && props.deleteEventGames && props.user) {
            this.setState({ gameState: GameState.DeleteEventGames });
        }
    }

    isPendingGameStillCurrent(props) {
        if(this.props.newGame && !props.newGame) {
            return false;
        }

        if(this.props.currentGame && !props.currentGame) {
            return false;
        }

        return true;
    }

    isPasswordGameStillCurrent(props) {
        if(this.props.passwordGame && !props.passwordGame) {
            return false;
        }

        return true;
    }

    isGameInProgress(props) {
        if(props.currentGame && props.currentGame.started && (!this.props.currentGame || !this.props.currentGame.started)) {
            return true;
        }

        return false;
    }

    startNewGame() {
        if(!this.props.user) {
            this.setState({ errorMessage: 'Please login before trying to start a new game' });

            return;
        }

        $('#pendingGameModal').modal('show');

        this.props.startNewGame();
    }
    startNewEventGames() {
        if(!this.props.user) {
            this.setState({ errorMessage: 'Please login before trying to start a new game' });

            return;
        }

        $('#pendingGameModal').modal('show');

        this.props.startNewEventGames();
    }

    startDeleteEventGames() {
        if(!this.props.user) {
            this.setState({ errorMessage: 'Please login before trying to start a new game' });

            return;
        }

        $('#pendingGameModal').modal('show');

        this.props.startDeleteEventGames();
    }

    onNewGameClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: false });

        this.startNewGame();
    }
    onNewEventGamesClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: false });

        this.startNewEventGames();
    }

    onDeleteEventGamesClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: false });
        this.startDeleteEventGames();
    }

    onQuickJoinClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: true });

        this.startNewGame();
    }


    onGetPatreonTriesClick(event) {
        event.preventDefault();

        this.props.updateTries();
    }

    onModalHidden(event) {
        if($(event.target).attr('id') !== 'pendingGameModal') {
            return;
        }

        switch(this.state.gameState) {
            case GameState.NewGame:
                this.props.cancelNewGame();
                break;
            case GameState.PasswordedGame:
                this.props.cancelPasswordJoin();
                break;
            case GameState.PendingGame:
                if(!this.props.currentGame.started) {
                    this.props.leaveGame(this.props.currentGame.id);
                }
                break;
            case GameState.NewEventGames:
                this.props.cancelNewEventGames();
                break;
            case GameState.DeleteEventGames:
                this.props.cancelDeleteEventGames();
                break;
        }

        this.setGameState(this.props);
    }

    onCheckboxChange(field, event) {
        let filter = Object.assign({}, this.state.filter);

        filter[field] = event.target.checked;

        this.setState({ filter: filter });

        //localStorage.setItem('gameFilter', JSON.stringify(filter));
    }

    onUnlinkClick() {
	this.props.unlinkPatreon();
    }


    onAchievementModeToggle(checked){
        let warning=null;
        if(checked && this.props.user && !this.props.user.achievementTries){
            warning='You have no achievement tries';
        }
        this.props.setAchievementMode(checked, warning);
    //    this.setState({ achievementMode: checked });
    }


    isPatreonLinked() {
	return this.props.user && ['linked', 'pledged'].includes(this.props.user.patreon);
    }
 
    isPatreonPledged() {
	return this.props.user && ['pledged'].includes(this.props.user.patreon);
    }
 
    patreonHasTries(){
        return this.props.user && this.props.user.patreonTries>0;
    }

    render() {
        let modalProps = {
            id: 'pendingGameModal',
            className: 'settings-popup row',
            bodyClassName: 'col-xs-12',
            title: ''
        };
        let modalBody = null;

        switch(this.state.gameState) {
            case GameState.None:
            default:
                break;
            case GameState.NewGame:
                modalProps.title = 'Game Options';
                modalProps.okButton = 'Create';
                modalBody = <NewGame defaultGameName={ this.props.user.username + '\'s game' } quickJoin={ this.state.quickJoin } />;
                break;
            case GameState.PendingGame:
                modalProps.title = this.props.currentGame ? this.props.currentGame.name : '';
                modalBody = this.props.currentGame ? <PendingGame /> : null;
                break;
            case GameState.PasswordedGame:
                modalProps.title = 'Password Required';
                modalBody = <PasswordGame />;
                break;
            case GameState.NewEventGames:
                modalProps.title = 'Event Games Options';
                modalProps.okButton = 'Generate Games';
                modalBody = <NewEventGames defaultGameName={ this.props.user.username + '\'s game' } quickJoin={ this.state.quickJoin } />;
                break;
            case GameState.DeleteEventGames:
                modalProps.title = 'Delete event games';
                modalProps.okButton = 'Delete Event Games';
                modalBody = <DeleteEventGames defaultGameName={ this.props.user.username + '\'s game' } quickJoin={ this.state.quickJoin } />;
                break;
        }

        let triesFeedback = this.props.apiSuccess === false ? 'testerror' : 'testsuccess';
        let callbackUrl = process.env.NODE_ENV === 'production' ? 'https://teki.skthrone.com/patreon' : 'http://sktest.megametateki.com:8080/patreon';
        let achiTries = (this.props.user && this.props.user.achievementTries) || 0;
        let achievementClass = this.props.achievementMode && this.props.user && this.props.user.achievementTries ? "achievement-mode" : null;
        return (
            <div className='full-height'>
                <div className='col-md-offset-2 col-md-8 full-height'>
                    { this.props.bannerNotice ? <AlertPanel type='error' message={ this.props.bannerNotice } /> : null }
                    { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }
                    <Panel title='Current Games'>
                        { this.props.user && this.props.user.permissions.canManageEvents && <button className='btn btn-primary' onClick={ this.onNewEventGamesClick } disabled={ !!this.props.currentGame || !this.props.user }>Event games</button>}
                        { this.props.user && this.props.user.permissions.canManageEvents && <button className='btn btn-primary' onClick={ this.onDeleteEventGamesClick } disabled={ !!this.props.currentGame || !this.props.user }>Delete Event</button>}
                        <div className='col-xs-12 game-controls'>
                            <div className='col-xs-3 join-buttons'>
                                <SwitchButton name='achievementmode' onChange={ this.onAchievementModeToggle.bind(this) } checked={ this.props.achievementMode } warning={ this.props.achievementWarning }/>
                                <button className={'btn btn-primary '+achievementClass} onClick={ this.onNewGameClick } disabled={ !!this.props.currentGame || !this.props.user }>New Game</button>
                                <button className='btn btn-primary' onClick={ this.onQuickJoinClick } disabled={ !!this.props.currentGame || !this.props.user }>Quick Join</button>                            
                            </div>
                            <div className='col-xs-9 game-filter'>
                                <Panel type='tertiary'>
                                    <Checkbox name='beginner' label='Beginner' fieldClass='col-xs-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'beginner') } checked={ this.state.filter['beginner'] } />
                                    <Checkbox name='casual' label='Casual' fieldClass='col-xs-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'casual') } checked={ this.state.filter['casual'] } />
                                    <Checkbox name='competitive' label='Competitive' fieldClass='col-xs-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'competitive') } checked={ this.state.filter['competitive'] } />
                                    <Checkbox name='showOnlyNewGames' label='Only show new games' fieldClass='col-xs-6' noGroup onChange={ this.onCheckboxChange.bind(this, 'showOnlyNewGames') } checked={ this.state.filter['showOnlyNewGames'] } />
                                </Panel>
                            </div>
                        </div>
                        { this.props.user && this.props.achievementMode && <div className='col-xs-12'>
                                <div className='col-xs-12'>
					<div className='col-xs-3 achievement-tries'>Achievement tries: {(this.props.user) && achiTries} </div>
					<div className='col-xs-4'><button className={'btn btn-primary '+achievementClass} onClick={ this.onGetPatreonTriesClick } disabled={ !!this.props.currentGame || !this.isPatreonLinked() || !this.patreonHasTries() }>{(this.props.user && this.props.user.patreonTries !== undefined) ? 'Get '+this.props.user.patreonTries+' Patreon tries' : 'Get Patreon Tries' }</button></div>

                                        { !this.isPatreonLinked() && <a className={'btn btn-default col-xs-3 '+achievementClass} href={ `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=7YiiPdg-nnCzaeJobdypBhaw5ykUhBD_CuYgMglaGqAy_AeTOv2-zPqOpYFpkf_n&redirect_uri=${callbackUrl}` }><img src='/img/Patreon_Mark_Coral.jpg' style={ {height:'21px'} } />&nbsp;Link Your Patreon</a> }
                                        { this.isPatreonLinked() && <button type='button' className='btn btn-default col-xs-3' onClick={ this.onUnlinkClick }>Unlink Patreon account</button> }
					<div className='col-xs-2 support-patreon'><a href="https://www.patreon.com/thethroneofcards">Support the Patreon</a> </div>

                                </div>
                        </div>}
                        <div className='col-xs-12'>
                            { this.props.games.length === 0 ? <AlertPanel type='info' message='No games are currently in progress.' /> : <GameList games={ this.props.games } gameFilter={ this.state.filter } /> }
                        </div>
                    </Panel>
                </div>
                <Modal { ...modalProps }>
                    { modalBody }
                </Modal>
            </div>);
    }
}

GameLobby.displayName = 'GameLobby';
GameLobby.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    achievementMode: PropTypes.bool,
    achievementWaring: PropTypes.string,
    bannerNotice: PropTypes.string,
    cancelNewGame: PropTypes.func,
    cancelNewEventGames: PropTypes.func,
    cancelDeleteEventGames: PropTypes.func,
    cancelPasswordJoin: PropTypes.func,
    currentGame: PropTypes.object,
    games: PropTypes.array,
    getPatreonTries: PropTypes.func,
    updateTries: PropTypes.func,
    leaveGame: PropTypes.func,
    newGame: PropTypes.bool,
    newEventGames: PropTypes.bool,
    deleteEventGames: PropTypes.bool,
    passwordGame: PropTypes.object,
    setContextMenu: PropTypes.func,
    setAchievementMode: PropTypes.func,
    startNewGame: PropTypes.func,
    startNewEventGames: PropTypes.func,
    startDeleteEventGames: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        achievementMode: state.lobby.achievementMode,
        achievementWarning: state.lobby.achievementWarning,
        bannerNotice: state.lobby.notice,
        currentGame: state.lobby.currentGame,
        games: state.lobby.games,
        newGame: state.lobby.newGame,
        newEventGames: state.lobby.newEventGames,
        deleteEventGames: state.lobby.deleteEventGames,
        passwordGame: state.lobby.passwordGame,
        socket: state.lobby.socket,
        user: state.account.user,
        apiLoading: state.api.ACCOUNT_TRIES_REQUEST ? state.api.ACCOUNT_TRIES_REQUEST.loading : undefined,
        apiMessage: state.api.ACCOUNT_TRIES_REQUEST ?
            state.api.ACCOUNT_TRIES_REQUEST.status === 401 ? 'Invalid username or password.  Please check and try again' : state.api.ACCOUNT_TRIES_REQUEST.message : undefined,
        apiSuccess: state.api.ACCOUNT_TRIES_REQUEST ? state.api.ACCOUNT_TRIES_REQUEST.success : undefined
    };
}

export default connect(mapStateToProps, actions)(GameLobby);

