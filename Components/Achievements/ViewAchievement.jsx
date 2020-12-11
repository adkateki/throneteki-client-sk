import React from 'react';
import PropTypes from 'prop-types';

import ConfirmedButton from '../Form/ConfirmedButton';
import Panel from '../Site/Panel';
import AchievementSummary from './AchievementSummary';

class ViewAchievement extends React.Component {
    constructor() {
        super();

    }

    render() {
        let { achievement, user } = this.props;

        return (
            <div className='col-sm-7'>
                <Panel title={ achievement.name }>
                    <AchievementSummary achievement={ achievement } user={ user } />
                </Panel>
            </div>);
    }
}

ViewAchievement.propTypes = {
    achievement: PropTypes.object.isRequired,
    user: PropTypes.object
};

export default ViewAchievement;
