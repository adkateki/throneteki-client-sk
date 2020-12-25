import React from 'react';
import PropTypes from 'prop-types';

class EventsDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
	 	value: { value: props.currentEvent ? props.currentEvent.name : 'None'},
        };

    }

    handleChange(event) {
        const selectedName = event.target.value;
        this.updateEvent(selectedName);
    }

    updateEvent(eventName) {
        this.setState({ value: eventName });
        let event = this.props.events.find(ev => ev.name === eventName);
        if(this.props.setCurrentEvent) {
            this.props.setCurrentEvent(event);
            this.props.loadDecks(event);
        }
        if(this.props.onChange) {
            this.props.onChange(event);
            this.props.loadDecks(event);
        }
    }

    render() {
        return (<React.Fragment>
            <label htmlFor='current-event'>Events:</label>
            <select id='current-event' className='form-control' value={ this.props.currentEvent ? this.props.currentEvent.name : 'None' } onChange={ this.handleChange.bind(this) }>
                <option value='None'>None</option>
                { this.props.events.map(event => <option key={ event.name } value={ event.name }>{ event.name }</option>) }
            </select>
        </React.Fragment>);
    }
}

EventsDropdown.displayName = 'EventsDropdown';
EventsDropdown.propTypes = {
    currentEvent: PropTypes.object,
    onChange: PropTypes.func,
    events: PropTypes.array,
    setCurrentEvent: PropTypes.func
};

export default EventsDropdown;
