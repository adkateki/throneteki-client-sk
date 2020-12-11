import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {achievementStatusLabel} from './AchievementHelper';

export default function AchievementStatusLabel({className, achievement, userAchievement}) {
    const text = userAchievement ? achievementStatusLabel(achievement, userAchievement) : 'Loading...';
    let fullClassName = classNames(className, 'label', {
        'label-warning': userAchievement.progress < achievement.target,
        'label-success': userAchievement.progress >= achievement.target
    });
    return <span className={ fullClassName }>{ text }</span>;
}

AchievementStatusLabel.propTypes = {
    className: PropTypes.string,
    achievement: PropTypes.object.isRequired,
    userAchievement: PropTypes.object
};
