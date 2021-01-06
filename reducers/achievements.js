function selectAchievement(state, achievement) {
    if(state.achievements.length !== 0) {
        state.selectedAchievement = achievement;
    } else {
        delete state.selectedAchievement;
    }

    return state;
}

function processAchievements(achievements, state) {
    if(!achievements) {
        return;
    }

    return achievements.map(achievement => processAchievement(achievement, state));
}

function getTitles(userAchievements, state){
    if(!userAchievements){
       return;
    }
//    console.log(state.achievements);
    return state.achievements.map(achievement => 
                          userAchievements[achievement.code] && userAchievements[achievement.code].progress > achievement.target ? achievement.title : null
                     ).filter(title => title != null);;
}

function processAchievement(achievement, state) {
    if(!state.userAchievements || !achievement ) {
        return Object.assign({ status: {} }, achievement);
    }

    let formattedDeck = formatDeckAsFullCards(deck, state);
    const fallbackRestrictedList = state.restrictedList ? state.restrictedList.slice(0, 1) : undefined;
    const restrictedLists = state.currentRestrictedList ? [state.currentRestrictedList] : fallbackRestrictedList;

    if(!restrictedLists) {
        formattedDeck.status = {};
    } else {
        formattedDeck.status = validateDeck(formattedDeck, { packs: state.packs, restrictedLists });
    }

    return formattedDeck;
}

export default function(state = { achievements: []}, action) {
    let newState;
    switch(action.type) {
        case 'REQUEST_ACHIEVEMENTS':
            newState = Object.assign({}, state, {
            });
            if(newState.selectedAchievement && !newState.selectedAchievement._id) {
                if(newState.achievements.length !== 0) {
                    newState.selectedAchievement = newState.achievements[0];
                }
            }
            return newState;
        case 'RECEIVE_ACHIEVEMENTS':
            newState = Object.assign({}, state, {
		achievements: action.response.achievements
            });
            newState = selectAchievement(newState, newState.achievements[0]);
            return newState;
        case 'SELECT_ACHIEVEMENT':
            return Object.assign({}, state, {
                selectedAchievement: action.achievement
            });
        case 'RECEIVE_USERACHIEVEMENTS':
            newState = Object.assign({}, state, {
		userAchievements: action.response.userAchievements,
                titles: getTitles(action.response.userAchievements, state)
            });
            return newState;
        case 'CLEAR_USERACHIEVEMENTS':
            newState = Object.assign({}, state, {
            });
            delete newState['userAchievements'];
            delete newState['titles'];
            return newState;
        default:
            return state;
    }
}
