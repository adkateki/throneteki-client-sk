import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AchievementStatusLabel from './AchievementStatusLabel';

class AchievementRow extends React.Component {
    constructor() {
        super();

        this.handleAchievementClick = this.handleAchievementClick.bind(this);
    }

    handleAchievementClick() {
        if(this.props.onSelect) {
            this.props.onSelect(this.props.achievement);
        }
    }

    render() {
        const { achievement } = this.props;

        return (
            <div className={ this.props.active ? 'achievement-row active' : 'achievement-row' } key={ this.props.achievement.name } onClick={ this.handleAchievementClick }>
              { achievement.card &&  <div className='col-xs-1 deck-image'><img className='card-small' src={ '/img/cards/' + this.props.achievement.card.code + '.png' } /></div> }
                <span className='col-xs-9 col-md-9 col-lg-10 achievement-name'>
                    <span>"{ this.props.achievement.name }"</span>
                    { this.props.userAchievement && <AchievementStatusLabel className='pull-right text-shadow' achievement={ achievement } userAchievement={ this.props.userAchievement } />}
                </span>
            </div>);
    }
}

AchievementRow.displayName = 'AchievementRow';
AchievementRow.propTypes = {
    active: PropTypes.bool,
    achievement: PropTypes.object.isRequired,
    userAchievement: PropTypes.object,
    onSelect: PropTypes.func
};

export default AchievementRow;
