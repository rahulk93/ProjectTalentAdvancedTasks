/* Experience section */
import React from 'react';
import ExperienceItem from './ExperienceItem.jsx'

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <ExperienceItem
                itemData={this.props.experienceData}
                updateProfileData={this.props.updateProfileData}
            />
        )
    }
}
