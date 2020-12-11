import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import AchievementsList from '../Components/Achievements/AchievementsList';
import ViewAchievement from '../Components/Achievements/ViewAchievement';
import * as actions from '../actions';

class Achievements extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadAchievements();
        if(this.props.user) {
            this.props.loadUserAchievements();

       }else{
            this.props.clearUserAchievements(this.props.userAchievements);
       }

    }

    componentDidUpdate() {
        if(this.props.user) {
            this.props.loadUserAchievements();

       }else{
            this.props.clearUserAchievements(this.props.userAchievements);
       }

    }


    render() {

        let content = null;
        let userAchievement = null;

        let successPanel = null;
        if(!!this.props.selectedAchievement) {
                          if(!!this.props.userAchievements) userAchievement = this.props.userAchievements[this.props.selectedAchievement.code];
        }
        if(this.props.apiLoading || !this.props.achievements) {
            content = <div>Loading achievements from the server...</div>;
        } else if(!this.props.apiSuccess) {
            content = <AlertPanel type='error' message={ this.props.apiMessage } />;
        } else {
            content = (
                <div className='full-height'>
                    <div className='col-xs-12'>
                        { successPanel }
                    </div>
                    <div className='col-sm-5 full-height'>
                        <Panel title='Achievements'>
                            <AchievementsList className='deck-list' activeAchievement={ this.props.selectedAchievement } achievements={ this.props.achievements } onSelectAchievement={ this.props.selectAchievement } userAchievements ={ this.props.userAchievements }/>
                        </Panel>
                    </div>
                   {(!!this.props.selectedAchievement) && <ViewAchievement achievement={ this.props.selectedAchievement } achievements={ this.props.achievements } user={ this.props.user } userAchievement={userAchievement}/>
                   }
                </div>);
        }

        return content;
    }
}

Achievements.displayName = 'Achievements';
Achievements.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    achievements: PropTypes.array,
    loadAchievements: PropTypes.func,
    loadUserAchievements: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    selectAchievement: PropTypes.func,
    selectedAchievement: PropTypes.object,
    user: PropTypes.object,
    userAchievements: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.REQUEST_ACHIEVEMENTS ? state.api.REQUEST_ACHIEVEMENTS.loading : undefined,
        apiMessage: state.api.REQUEST_ACHIEVEMENTS ? state.api.REQUEST_ACHIEVEMENTS.message : undefined,
        apiSuccess: state.api.REQUEST_ACHIEVEMENTS ? state.api.REQUEST_ACHIEVEMENTS.success : undefined,
        achievements: state.achievements.achievements,
        loading: state.api.loading,
        selectedAchievement: state.achievements.selectedAchievement,
	user: state.account.user,
        userAchievements: state.achievements.userAchievements

    };
}

export default connect(mapStateToProps, actions)(Achievements);
