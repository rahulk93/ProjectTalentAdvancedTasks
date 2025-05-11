/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import * as Yup from 'yup';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.schema = Yup.object().shape({
            summary:
                Yup.string()
                .required('Summary is required.')
                .max(150,'Summary must be no more than 150 characters.'),
            description:
                Yup.string()
                    .required('Description is required.')
                    .min(150,'Description must be at least 150 characters.')
                    .max(600, 'Description must be no more than 600 characters.'),
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    };

    handleChange(event) {
        const data = {};
        data[event.target.name] = event.target.value;
        this.props.updateWithoutSave(data);
    }

    handleSave(event) {
        try {
            const formData = {summary: this.props.summary, description: this.props.description };
            const valid = this.schema.validateSync(formData);

            this.props.updateProfileData(formData);
        } catch(error) {
            TalentUtil.notification.show(error, "error", null, null);
        }
    }

    render() {
        return (
            <div className='ui sixteen wide column'>
                <div className='field'>
                    <input
                        name="summary"
                        placeholder="Please provide a short summary about yourself"
                        maxLength="150"
                        value={this.props.summary || ""}
                        onChange={this.handleChange}
                    />
                    <label>Summary must be no more than 150 characters.</label>
                </div>
                <div className='field'>
                    <textarea
                        name="description"
                        placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add."
                        maxLength="600"
                        value={this.props.description || ""}
                        onChange={this.handleChange}
                    />
                    <label>Description must be between 150-600 characters.</label>
                </div>
                <div className="sixteen wide column">
                    <div>
                        <input type="button" className="ui teal button right floated" onClick={this.handleSave} value="Save"></input>
                    </div>
                </div>
            </div>
        )
    }
}



