import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AchievementStatus from './AchievementStatus';
import AchievementStatusLabel from './AchievementStatusLabel';
import AltCard from '../GameBoard/AltCard';

class AchievementSummary extends React.Component {
    constructor() {
        super();
    }

    getBannersToRender() {
        let banners = [];

        if(this.props.achievement.bannerCards) {
            for(const card of this.props.achievement.bannerCards) {
                banners.push(<div className='pull-right' key={ card.code ? card.code : card }>
                    <span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.label }</span>
                </div>);
            }
        }

        return <div className='info-row row'><span>Banners:</span>{ banners }</div>;
    }

    render() {
        if(!this.props.achievement ) {
            return <div>Waiting for selected achievement...</div>;
        }

        let banners = this.getBannersToRender();

        return (
            <div className='achievement-summary col-xs-12'>
                <div className='achievementlist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.achievement.faction ? <img className='img-responsive' src={ '/img/cards/' + this.props.achievement.faction.value + '.png' } /> : null }</div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><span>Faction:</span> <span className={ 'pull-right' }>{ this.props.achievement.faction ? this.props.achievement.faction.name : 'Any' } </span> </div>
                        <div className='info-row row' ref='agenda'><span>Agenda:</span>  <span className='pull-right' >{ this.props.achievement.agenda && this.props.achievement.agenda.name ? this.props.achievement.agenda.name : 'Any' }</span> </div>
                        { (this.props.achievement.agenda && this.props.achievement.agenda.label === 'Alliance') ? banners : null }
                        <div className='info-row row' ref='achievementTarget'><span>Target:</span><span className='pull-right'>{ this.props.achievement.target } </span></div>
                        { (this.props.user) && (this.props.userAchievement) && <div className='info-row row' ref='achievementCompletion'><span>Progress:</span><span className='pull-right'>{ this.props.userAchievement.progress } </span></div> }
                        { (this.props.user) && (this.props.userAchievement) && <div className='info-row row'><span>Status:</span>
                            <AchievementStatusLabel className='pull-right text-shadow' achievement={ this.props.achievement } userAchievement={ this.props.userAchievement } />
                        </div> }
                    </div>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.achievement.agenda && this.props.achievement.agenda.code ? <img className='img-responsive' src={ '/img/cards/' + this.props.achievement.agenda.code + '.png' } /> : null }</div>
                </div>
                <div className='col-xs-12 no-x-padding achievement-text' >
                    <div className='achievement'>
                        <span>{ this.props.achievement.text }</span>
                    </div>
                </div>
            </div>);
    }
}

AchievementSummary.displayName = 'AchievementSummary';
AchievementSummary.propTypes = {
    currentRestrictedList: PropTypes.object,
    achievement: PropTypes.object,
    userAchievement: PropTypes.object,
    user: PropTypes.object
};

export default AchievementSummary;
