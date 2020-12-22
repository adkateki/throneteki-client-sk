import React from 'react';
import PropTypes from 'prop-types';

class EventsDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: props.currentEvent ? props.currentEvent.name : 'None' };
        //if the currentRestrictedList is not set, update the restrictedList with the first RL in the list to set the initial state
        //this solves the problem, that the display of the dropdown (showing a selected entry) doesn´t correspond to the state 
        if(!props.currentEvent) {
            this.updateEvent(props.events[0].name);
        }
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
        }
        if(this.props.onChange) {
            this.props.onChange(event);
        }
    }

    render() {
        return (<React.Fragment>
            <label htmlFor='current-event'>Events::</label>
            <select id='current-event' className='form-control' value={ this.state.value } onChange={ this.handleChange.bind(this) }>
                <option value='None'>None</option>
                { this.props.events.map(event => <option value={ event.name }>{ event.name }</option>) }
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
