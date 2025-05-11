import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx'
import * as Yup from 'yup';

export class Address extends React.Component {
    constructor(props) {
        super(props)

        const address = props.addressData ?
            Object.assign({}, props.addressData)
            : {
                number: "",
                street: "",
                suburb: "",
                postCode: "",
                city: "",
                country: "",
            }
        this.state = {
            showEditSection: false,
            newData: address
        }

        this.schema = Yup.object().shape({
            number: Yup.string().required('Address number required.'),
            street: Yup.string().required('Street name required.'),
            suburb: Yup.string().required('Suburb required.'),
            postCode: Yup.number().required('Postal code required'),
            city: Yup.string().required('City required.'),
            country: Yup.string().required('Country required.'),
        })

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveData = this.saveData.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    openEdit() {
        const newData = Object.assign({}, this.props.addressData);
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
        const countries = Object.keys(Countries).map(c => ({ value: c, title: c }));
        const cities = (this.state.newData.country === "") ? [] : Countries[this.state.newData.country];
        const uniqCities = [...new Set(cities)].map(c => ({ value: c, title: c }));;
        return (
            <div className="ui grid">
                <div className='row'>
                    <div className='ui four wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={this.state.newData.number}
                            controlFunc={this.handleChange}
                            maxLength={10}
                            placeholder="Street number"
                            errorMessage="Please enter a valid street number"
                        />
                    </div>
                    <div className='ui eight wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={this.state.newData.street}
                            controlFunc={this.handleChange}
                            maxLength={40}
                            placeholder="Street name"
                            errorMessage="Please enter a valid street name"
                        />
                    </div>
                    <div className='ui four wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={this.state.newData.suburb}
                            controlFunc={this.handleChange}
                            maxLength={20}
                            placeholder="Suburb"
                            errorMessage="Please enter a valid suburb"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className='ui six wide column'>
                        <div className="field">
                            <label>Country</label>
                            <Select
                                name="country"
                                selectedOption={this.state.newData.country}
                                controlFunc={this.handleChange}
                                options={countries}
                                placeholder="Country"
                            />
                        </div>
                    </div>
                    <div className='ui six wide column'>
                        <div className="field">
                            <label>Country</label>
                            <Select
                                name="city"
                                selectedOption={this.state.newData.city}
                                controlFunc={this.handleChange}
                                options={uniqCities}
                                placeholder="City"
                            />
                        </div>
                    </div>
                    <div className='ui four wide column'>
                        <ChildSingleInput
                            inputType="text"
                            label="Post Code"
                            name="postCode"
                            value={this.state.newData.postCode}
                            controlFunc={this.handleChange}
                            maxLength={12}
                            placeholder="Post Code"
                            errorMessage="Please enter a valid post code"
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='ui six wide column'>
                        <div className='field'>
                            <button type="button" className="ui teal button" onClick={this.saveData}>Save</button>
                            <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderDisplay() {
        let streetAddress = this.props.addressData ?
            `${this.props.addressData.number} ${this.props.addressData.street} ${this.props.addressData.suburb} ${this.props.addressData.postCode}`
            : "";
        let city = this.props.addressData ? this.props.addressData.city : "";
        let country = this.props.addressData ? this.props.addressData.country : "";

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {streetAddress}</p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
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

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (event.target.value) {
            const newData = {};
            newData[event.target.name] = event.target.value;
            this.props.saveProfileData(newData);
        }
        else {
            TalentUtil.notification.show("Invalid nationality", "error", null, null);
        }
    }


    render() {
        let countries = [];
        try {
            if (Countries && typeof Countries === 'object' && !Array.isArray(Countries) && Object.keys(Countries).length > 0) {
                countries = Object.keys(Countries).map(c => ({ value: c, title: c }));
            }
        }
        catch (error) {
            console.error('Error processing Countries:', error);
        }

        return (
            <div className="ui grid">
                <div className='row'>
                    <div className='ui sixteen wide column'>
                        <div className='field'>
                            <Select
                                name="nationality"
                                selectedOption={this.props.nationalityData || ""}
                                controlFunc={this.handleChange}
                                options={countries}
                                placeholder="Select your nationality"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}