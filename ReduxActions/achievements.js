export function loadAchievements() {
    return {
        types: ['REQUEST_ACHIEVEMENTS', 'RECEIVE_ACHIEVEMENTS'],
        shouldCallAPI: (state) => {
            return state.achievements.achievements.length==0;
        },
        APIParams: { url: '/api/achievements', cache: false },
        skipAuth: true
    };
}
export function loadUserAchievements() {
    return {
        types: ['REQUEST_USERACHIEVEMENTS', 'RECEIVE_USERACHIEVEMENTS'],
        shouldCallAPI: (state) => {
             return !state.achievements.userAchievements;
//	     return true;
        },
        APIParams: { url: '/api/userachievements', cache: false },
        skipAuth: false
    };
}
export function loadAchiSets() {
    return {
        types: ['REQUEST_ACHISETS', 'RECEIVE_ACHISETS'],
        shouldCallAPI: (state) => {
            return !state.achievements.achiSets;
        },
        APIParams: { url: '/api/achisets', cache: false },
        skipAuth: true
    };
}

export function selectAchievement(achievement) {
    return {
        type: 'SELECT_ACHIEVEMENT',
        achievement: achievement
    };
}

