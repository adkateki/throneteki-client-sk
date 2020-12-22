import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Site/Panel';
import * as actions from '../../actions';
import Form from '../Form/Form';

class DeleteEventGames extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmitClick = this.onSubmitClick.bind(this);

    }

    componentWillMount() {
        this.props.loadEvents();
    }

    onSubmitClick(state) {
        event.preventDefault();
        this.props.socket.emit('removeeventgames', state.eventName);
    }


    render() {
        return (<div className='col-sm-offset-2 col-sm-8'>
            <Panel title='Delete Event'>
                <Form name='deleteEventGames' apiLoading={ this.props.apiState && this.props.apiState.loading } buttonClass='col-sm-offset-4 col-sm-3' buttonText='Select' onSubmit={ this.onSubmitClick } />
            </Panel>
        </div>);
    }
}

DeleteEventGames.displayName = 'DeleteEventGames';
DeleteEventGames.propTypes = {
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(DeleteEventGames);
