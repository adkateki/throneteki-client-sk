import React from 'react';
import PropTypes from 'prop-types';

import { Typeahead } from 'react-bootstrap-typeahead';
import TypeaheadLookupNoButton from './TypeaheadLookupNoButton';

export class TitleLookup extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(selectedTitle) {
        this.props.sendGameMessage('changeTitle', selectedTitle);
    }

    render() {
        let selectedTitle = this.props.selectedTitle;
        return (
    	       this.props.titles.length>0 ? <Typeahead labelKey={ '' } options={ this.props.titles } onChange={ this.props.onSelectedTitle } defaultSelected={selectedTitle ? [selectedTitle] : [this.props.titles[0]]} filterBy={(option, props) =>{
                                      if (props.selected.length) {
					      // Display all the options if there's a selection.
					      return true;
					    }
					    // Otherwise filter on some criteria.
					    return option.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;
                              }
                           }/> : <div>You have no titles</div>
        );
    }
}

TitleLookup.displayName = 'TitleLookup';
TitleLookup.propTypes = {
    titles: PropTypes.array,
    selectedTitle: PropTypes.string,
    onSelectedTitle: PropTypes.func
};

export default TitleLookup;
