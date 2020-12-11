import React from 'react';
import PropTypes from 'prop-types';

import AchievementRow from './AchievementRow';

class AchievementsList extends React.Component {
    render() {
        let { activeAchievement, className, achievements, onSelectAchievement } = this.props;

        return (
            <div className={ className }>
                {
                    !achievements || achievements.length === 0
                        ? 'No achievements'
                        : achievements.map((achievement, index) => { 
                                let userAchievement = null;
                                if(this.props.userAchievements && this.props.userAchievements.hasOwnProperty(achievement.code)) userAchievement=this.props.userAchievements[achievement.code];
				return <AchievementRow active={ activeAchievement && activeAchievement._id === achievement._id } achievement={ achievement } key={ index } onSelect={ onSelectAchievement } userAchievement= {userAchievement}  />
                          })
                }
            </div>);
    }
}

AchievementsList.propTypes = {
    activeAchievement: PropTypes.object,
    className: PropTypes.string,
    achievements: PropTypes.array,
    onSelectAchievement: PropTypes.func,
    userAchievements: PropTypes.object,
};

export default AchievementsList;
