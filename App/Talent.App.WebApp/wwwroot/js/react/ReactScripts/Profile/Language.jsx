/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import LevelItem from './LevelItem.jsx'

export default class Language extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const levelOptions = [
            {value: "Basic", title: "Basic"},
            {value: "Conversational", title: "Conversational"},
            {value: "Fluent", title: "Fluent"},
            {value: "Native/Bilingual", title: "Native/Bilingual"}
        ];
        return(
            <LevelItem
                levelOptions={levelOptions}
                itemName="language"
                itemData={this.props.languageData}
                updateProfileData={this.props.updateProfileData}
            />
        )
    }
}
