import React from 'react';
import PropTypes from 'prop-types';

import DeckRow from './DeckRow';

class DeckList extends React.Component {
    render() {
        let { activeDeck, className, decks, currentEvent, onSelectDeck } = this.props;
//        currentEvent && currentEvent.name !== 'None' ? decks = currentEvent.decks : decks = this.props.decks;  

        return (
            <div className={ className }>
                {
                    !decks || decks.length === 0
                        ? 'You have no decks, try adding one'
                        : decks.map((deck, index) => <DeckRow active={ activeDeck && activeDeck._id === deck._id } deck={ deck } key={ index } onSelect={ onSelectDeck } />)
                }
            </div>);
    }
}

DeckList.propTypes = {
    activeDeck: PropTypes.object,
    className: PropTypes.string,
    decks: PropTypes.array,
    currentEvent: PropTypes.object,
    onSelectDeck: PropTypes.func
};

export default DeckList;
