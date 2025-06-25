/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Icon } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        const linkedAccounts = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: "",
            }

        this.state = {
            showEditSection: false,
            newData: linkedAccounts
        }
        this.schema = Yup.object().shape({
            linkedIn: Yup.string().matches(TalentUtil.linkedInRegExp, 'Invalid LinkedIn URL.'),
            github: Yup.string().matches(TalentUtil.githubRegExp, 'Invalid GitHub URL.'),
        })

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveData = this.saveData.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    openEdit() {
        const newData = Object.assign({}, this.props.linkedAccounts);
        this.setState({
            showEditSection: true,
            newData: newData
        });
    }

    closeEdit() {
        this.setState({
            showEditSection: false,
        });
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newData);
        data[event.target.name] = event.target.value;
        this.setState({
            newData: data
        });
    }

    saveData() {
        try {
            const valid = this.schema.validateSync(this.state.newData);
            this.props.updateProfileData(this.props.componentId, this.state.newData);
            this.closeEdit();
        } catch (error) {
            TalentUtil.notification.show(error, "error", null, null);
        }
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.newData.linkedIn}
                    controlFunc={this.handleChange}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter a LinkedIn Url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.newData.github}
                    controlFunc={this.handleChange}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter a valid GitHub Url"
                />

                <button type="button" className="ui teal button" onClick={this.saveData}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        );
    }

    renderDisplay() {
        return (
            <div className='row'>
                <div className="ui four wide column">
                    <button
                        type="button"
                        className="fluid ui linkedin button"
                        onClick={() => window.open(this.props.linkedAccounts.linkedIn)}
                    >
                        <Icon name='linkedin'></Icon>LinkedIn
                    </button>
                </div>
                <div className="ui four wide column">
                    <button
                        type="button"
                        className="fluid ui floated black button"
                        onClick={() => window.open(this.props.linkedAccounts.github)}
                    >
                        <Icon name='github'></Icon>GitHub
                    </button>
                </div>
                <div className="ui eight wide column">
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }


    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }
}