export function receiveUsers(users) {
    return {
        type: 'RECEIVE_USERS',
        users: users
    };
}

export function receiveLobbyMessage(message) {
    return {
        type: 'RECEIVE_LOBBY_MSG',
        message: message
    };
}

export function receiveLobbyMessages(messages) {
    return {
        type: 'RECEIVE_LOBBY_MSGS',
        messages: messages
    };
}

export function removeLobbyMessage(messageId) {
    return {
        types: ['REMOVE_MESSAGE', 'MESSAGE_REMOVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/messages/${messageId}`,
            cache: false,
            type: 'DELETE'
        }
    };
}

export function clearChatStatus() {
    return {
        type: 'CLEAR_CHAT_STATUS'
    };
}

export function triesUpdating(){
    return {
        type: 'TRIES_UPDATING'
    };
}

export function setAchievementMode(booleanMode, message) {
    return {
        type: 'SET_ACHIEVEMENT_MODE',
        achievementMode: booleanMode,
        warning: message
    };
}

export function updateTries(){
    return (dispatch, getState) => {
        let state = getState();

        if(state.lobby.socket) {
            state.lobby.socket.emit('updatetries');
        }

        return dispatch(triesUpdating());
    };
}

