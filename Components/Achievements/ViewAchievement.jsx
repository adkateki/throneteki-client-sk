import React from 'react';
import PropTypes from 'prop-types';

import ConfirmedButton from '../Form/ConfirmedButton';
import Panel from '../Site/Panel';
import AchievementSummary from './AchievementSummary';
import Sticky from 'react-stickynode';

class ViewAchievement extends React.Component {
    constructor() {
        super();

    }

    render() {
        let { achievement, user, userAchievement } = this.props;

        return (
            <div className='view-achievement col-sm-7'>
                <Panel title={achievement.name}>
                    <AchievementSummary achievement={ achievement } user={ user } userAchievement={ userAchievement }/>
                </Panel>
            </div>);
    }
}

ViewAchievement.propTypes = {
    achievement: PropTypes.object.isRequired,
    user: PropTypes.object,
    userAchievement: PropTypes.object

};

export default ViewAchievement;
