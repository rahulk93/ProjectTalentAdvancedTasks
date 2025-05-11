/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import LevelItem from './LevelItem.jsx'

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const levelOptions = [
            { value: "Beginner", title: "Beginner" },
            { value: "Intermediate", title: "Intermediate" },
            { value: "Expert", title: "Expert" }
        ];
        return (
            <LevelItem
                levelOptions={levelOptions}
                itemName="skill"
                itemData={this.props.skillData}
                updateProfileData={this.props.updateProfileData}
            />
        )
    }
}

