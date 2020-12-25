import React from 'react';
import PropTypes from 'prop-types';

import AbilityTargeting from './AbilityTargeting';
import AbilityTimer from './AbilityTimer';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';

class ActivePlayerPrompt extends React.Component {
    onButtonClick(event, button) {
        event.preventDefault();

        this.props.stopAbilityTimer();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(button);
        }
    }

    onCancelTimerClick(event, button) {
        event.preventDefault();

        this.props.stopAbilityTimer();

        if(button.method || button.arg) {
            this.props.onButtonClick(button);
        }
    }

    onMouseOver(event, card) {
        if(card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if(card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    getButtons() {
        let buttonIndex = 0;

        let buttons = [];

        if(!this.props.buttons) {
            return null;
        }

        for(const button of this.props.buttons) {
            if(button.timer) {
                continue;
            }

            let clickCallback = button.timerCancel ? event => this.onCancelTimerClick(event, button) :
                event => this.onButtonClick(event, button);
            let buttonClassName = button.arg === 'report' ? 'btn btn-default report-button' : 'btn btn-default prompt-button'; 
            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className={buttonClassName}
                    onClick={ clickCallback }
                    onMouseOver={ event => this.onMouseOver(event, button.card) }
                    onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }> { button.icon && <div className={ `with-background thronesicon thronesicon-${button.icon}` } /> } { button.text }</button>);

            buttonIndex++;

            buttons.push(option);
        }

        return buttons;
    }

    handleLookupValueSelected(command, method, promptId, cardName) {
        if(this.props.onButtonClick) {
            this.props.onButtonClick({ command: command, arg: cardName, method: method, promptId: promptId });
        }
    }

    getControls() {
        if(!this.props.controls) {
            return null;
        }

        return this.props.controls.map(control => {
            switch(control.type) {
                case 'targeting':
                    return (
                        <AbilityTargeting
                            onMouseOut={ this.props.onMouseOut }
                            onMouseOver={ this.props.onMouseOver }
                            source={ control.source }
                            targets={ control.targets } />);
                case 'card-name':
                    return <CardNameLookup cards={ this.props.cards } onValueSelected={ this.handleLookupValueSelected.bind(this, control.command, control.method, control.promptId) } />;
                case 'trait-name':
                    return <TraitNameLookup cards={ this.props.cards } onValueSelected={ this.handleLookupValueSelected.bind(this, control.command, control.method, control.promptId) } />;
            }
        });
    }

    render() {
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        let timer = null;

        let promptText = [];
        if(this.props.promptText && this.props.promptText.includes('\n')) {
            let split = this.props.promptText.split('\n');
            for(let token of split) {
                promptText.push(token);
                promptText.push(<br />);
            }
        } else {
            promptText.push(this.props.promptText);
        }

        if(this.props.timerStartTime) {
            timer = (
                <AbilityTimer startTime={ this.props.timerStartTime } limit={ this.props.timerLimit } />);
        }
        let phaseClassName='phase-indicator';
        if(this.props.winner){
            phaseClassName='phase-indicator-winner';
        } 
        return (<div>
            { timer }
            <div className={ phaseClassName +" "+ this.props.phase } onClick={ this.props.onTitleClick }>
                { this.props.phase } phase
            </div>
            { promptTitle }
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{ promptText }</h4>
                    { this.getControls() }
                    { this.getButtons() }
                </div>
            </div>
        </div>);
    }
}

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
ActivePlayerPrompt.propTypes = {
    buttons: PropTypes.array,
    cards: PropTypes.object,
    controls: PropTypes.array,
    onButtonClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTitleClick: PropTypes.func,
    phase: PropTypes.string,
    promptText: PropTypes.string,
    promptTitle: PropTypes.string,
    socket: PropTypes.object,
    stopAbilityTimer: PropTypes.func,
    timerLimit: PropTypes.number,
    timerStartTime: PropTypes.instanceOf(Date),
    user: PropTypes.object,
    winner: PropTypes.string
};

export default ActivePlayerPrompt;
