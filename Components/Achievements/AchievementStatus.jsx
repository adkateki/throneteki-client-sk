import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


class AchievementStatus extends React.Component {
    render() {
        let { achievement, userAchievement } = this.props;
        let className = classNames('achievement-status', this.props.className, {
            'label-warning': userAchievement.progress < achievement.target,
            'label-success': userAchievement.progress >= achievement.target
        });

        return (
            <span className={ className }>
        
            </span>);
    }
}

AchievementStatus.propTypes = {
    className: PropTypes.string,
    achievement: PropTypes.object.isRequired,
    userAchievement: PropTypes.object
};

export default AchievementStatus;
