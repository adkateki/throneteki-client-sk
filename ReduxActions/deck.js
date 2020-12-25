import { formatDeckAsShortCards } from 'throneteki-deck-helper';

export function loadDecks(event) {
    let eventName = 'None';
    let apiUrl = '/api/decks';
    if(event && event._id != 'none'){
        eventName = event.name;
        apiUrl = '/api/decks/events/'+eventName;
    }
    return {
        types: ['REQUEST_DECKS', 'RECEIVE_DECKS'],
        shouldCallAPI: (state) => {
            return state.cards.singleDeck || state.cards.decks.length === 0;
        },
        APIParams: { url: `${apiUrl}`, cache: false }
    };
}

export function loadDeck(deckId, event) {
    let eventName = 'None';
    let apiUrl = '/api/decks';
    if(event && event._id != 'none'){
        eventName = event.name;
        apiUrl = '/api/decks/events/'+eventName;
    }
    return {
        types: ['REQUEST_DECK', 'RECEIVE_DECK'],
        shouldCallAPI: (state) => {
            let ret = state.cards.decks.length === 0 || !state.cards.decks.some(deck => {
                return deck._id === deckId;
            });

            return ret;
        },
        APIParams: { url: `${apiUrl}/${deckId}`, cache: false }
    };
}

export function selectDeck(deck) {
    return {
        type: 'SELECT_DECK',
        deck: deck
    };
}

export function addDeck() {
    return {
        type: 'ADD_DECK'
    };
}

export function updateDeck(deck) {
    return {
        type: 'UPDATE_DECK',
        deck: deck
    };
}

export function deleteDeck(deck, event) {
    let eventName = 'None';
    let apiUrl = '/api/decks';
    if(event && event._id != 'none'){
        eventName = event.name;
        apiUrl = '/api/decks/events/'+eventName;
    }
    console.log(apiUrl);
    return {
        types: ['DELETE_DECK', 'DECK_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `${apiUrl}/${deck._id}`,
            type: 'DELETE'
        }
    };
}

export function saveDeck(deck, event) {
    let formattedDeck = formatDeckAsShortCards(deck);
    formattedDeck.deckName = deck.name;
    let eventName = 'None';
    if(event) eventName = event.name;
    let str = JSON.stringify({
        deck: formattedDeck,
        eventName: eventName
    });

    return {
        types: ['SAVE_DECK', 'DECK_SAVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${(deck._id || '')}`,
            type: deck._id ? 'PUT' : 'POST',
            data: str
        }
    };
}

export function clearDeckStatus() {
    return {
        type: 'CLEAR_DECK_STATUS'
    };
}
