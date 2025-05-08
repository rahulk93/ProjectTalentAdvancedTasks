import React from 'react'
import { Form, FormField, Checkbox } from 'semantic-ui-react';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        this.statusList = {
            "active": "Actively looking for a job",
            "notLooking": "Not looking for a job at the moment",
            "open": "Currently employed but open to offers",
            "later": "Will be available on later date",
        };

        this.handleChange = this.handleChange.bind(this);
        this.isChecked = this.isChecked.bind(this);
    }

    isChecked(statusValue) {
        const jobSeekingStatus = this.props.status ? this.props.status.status : null;
        return (jobSeekingStatus === statusValue);
    }

    handleChange(event, data) {
        const newData = {};
        newData[data.name] = data.value;
        this.props.updateProfileData(this.props.componentId, newData);
    }

    render() {
        return (
            <div className='row'>
                <div className='ui sixteen wide column'>
                    <div className="field">
                        <FormField>
                            <label>Current Status</label>
                        </FormField>
                        {Object.keys(this.statusList).map((s) =>
                            <FormField key={s}>
                                <Checkbox
                                    radio
                                    label={this.statusList[s]}
                                    name='status'
                                    value={this.statusList[s]}
                                    checked={this.isChecked(this.statusList[s])}
                                    onChange={this.handleChange}
                                />
                            </FormField>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}