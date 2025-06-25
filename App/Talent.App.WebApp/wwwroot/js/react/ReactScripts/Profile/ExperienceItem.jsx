/* ExperienceItem section, used by Experience */
import React from 'react';
import Cookies from 'js-cookie';
import { Select } from '../Form/Select.jsx'
import * as Yup from 'yup';
import { UTCDatePicker } from '../Form/UTCDatePicker.jsx'

const schema = Yup.object().shape({
    end:
        Yup.date()
            .min(Yup.ref('start'), "End date should be after start date."),
    start:
        Yup.date()
            .required("Start date is required"),
    responsibilities:
        Yup.string()
            .required("Responsibilities is required."),
    position:
        Yup.string()
            .required('Experience position is required.'),
    company:
        Yup.string()
            .required('Company name is required.'),

});

export class AddNewItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newData: { company: "", position: "", responsibilities: "", start: null, end: null },
        };

        this.close = this.close.bind(this);
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    };

    close() {
        this.props.closeFunc();
    };

    handleChange(event) {
        const data = Object.assign({}, this.state.newData);
        data[event.target.name] = event.target.value;
        this.setState({
            newData: data
        });
    }

    handleDateChange(name, date) {
        const data = Object.assign({}, this.state.newData);
        data[name] = date;
        this.setState({
            newData: data
        });
    }

    add() {
        try {
            const valid = schema.validateSync(this.state.newData);

            this.props.addFunc(this.state.newData);
            this.setState({ newData: { start: null, end: null } });
            this.close();
        } catch (error) {
            TalentUtil.notification.show(error, "error", null, null);
        }
    };

    render() {
        return (
            this.props.show ?
                <div className="ui grid">
                    <div className="row">
                        <div className="ui eight wide column">
                            <div className="field">
                                <label>Company:</label>
                                <input
                                    type='text'
                                    name='company'
                                    placeholder='Company'
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="ui eight wide column">
                            <div className="field">
                                <label>Position:</label>
                                <input
                                    type='text'
                                    name='position'
                                    placeholder='Position'
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="ui eight wide column">
                            <div className="field">
                                <label>Start Date:</label>
                                <UTCDatePicker
                                    selected={this.state.newData.start}
                                    onChange={(date) => this.handleDateChange("start", date)}
                                />
                            </div>
                        </div>
                        <div className="ui eight wide column">
                            <div className="field">
                                <label>End Date:</label>
                                <UTCDatePicker
                                    selected={this.state.newData.end}
                                    onChange={(date) => this.handleDateChange("end", date)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="ui sixteen wide column">
                            <div className="field">
                                <label>Responsibilities:</label>
                                <input
                                    type='text'
                                    name='responsibilities'
                                    placeholder='Responsibilities'
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="ui sixteen wide column">
                            <button type="button" className="ui teal button" onClick={this.add}>Add</button>
                            <button type="button" className="ui button" onClick={this.close}>Cancel</button>
                        </div>
                    </div>
                </div>
                : ""
        )
    }
}

export class ItemRow extends React.Component {
    constructor(props) {
        super(props);

        const item = this.props.item ?
            this.props.item
            : { id: null, company: "", position: "", responsibilities: "", start: null, end: null };

        this.state = {
            newData: item,
            showEdit: false
        };

        this.showEdit = this.showEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.delete = this.delete.bind(this);
    };

    showEdit() {
        this.setState({
            showEdit: true
        });
    };

    closeEdit() {
        this.setState({
            showEdit: false
        });
    };

    handleChange(event) {
        const data = Object.assign({}, this.state.newData);
        data[event.target.name] = event.target.value;
        this.setState({
            newData: data
        });
    }

    handleDateChange(name, date) {
        const data = Object.assign({}, this.state.newData);
        data[name] = date;
        this.setState({
            newData: data
        });
    }

    add() {
        try {
            const valid = schema.validateSync(this.state.newData);

            this.props.addFunc(this.state.newData);
            this.closeEdit();
        } catch (error) {
            TalentUtil.notification.show(error, "error", null, null);
        }
    };

    delete() {
        this.props.deleteFunc(this.state.newData);
    }

    renderView() {
        const startFormat = TalentUtil.formatHelpers.formatDateWritten(this.state.newData.start);
        const endFormat = TalentUtil.formatHelpers.formatDateWritten(this.state.newData.end);
        return (
            <tr>
                <td>{this.state.newData.company}</td>
                <td>{this.state.newData.position}</td>
                <td>{this.state.newData.responsibilities}</td>
                <td>{startFormat}</td>
                <td>{endFormat}</td>
                <td className="right aligned">
                    <i className="pencil alternate icon" onClick={this.showEdit}></i>
                    <i className="close icon" onClick={this.delete}></i>
                </td>
            </tr>
        )
    }

    renderEdit() {
        return (
            <tr>
                <td colSpan="6">
                    <div className="ui grid">
                        <div className="row">
                            <div className="ui eight wide column">
                                <div className="field">
                                    <label>Company:</label>
                                    <input
                                        type='text'
                                        name='company'
                                        value={this.state.newData.company}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="ui eight wide column">
                                <div className="field">
                                    <label>Position:</label>
                                    <input
                                        type='text'
                                        name='position'
                                        value={this.state.newData.position}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="ui eight wide column">
                                <div className="field">
                                    <label>Start Date:</label>
                                    <UTCDatePicker
                                        selected={this.state.newData.start}
                                        onChange={(date) => this.handleDateChange("start", date)}
                                    />
                                </div>
                            </div>
                            <div className="ui eight wide column">
                                <div className="field">
                                    <label>End Date:</label>
                                    <UTCDatePicker
                                        selected={this.state.newData.end}
                                        onChange={(date) => this.handleDateChange("end", date)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="ui sixteen wide column">
                                <div className="field">
                                    <label>Responsibilities:</label>
                                    <input
                                        type='text'
                                        name='responsibilities'
                                        value={this.state.newData.responsibilities}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="ui sixteen wide column">
                                <button type="button" className="ui teal button" onClick={this.add}>Update</button>
                                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>                </div>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    render() {
        return (
            this.state.showEdit ? this.renderEdit() : this.renderView()
        )
    }
}

export default class ExperienceItem extends React.Component {
    constructor(props) {
        super(props);

        const itemData = this.props.itemData ? this.props.itemData : [];

        this.state = {
            showAddNew: false,
            itemData: itemData
        }

        this.openAddNew = this.openAddNew.bind(this);
        this.closeAddNew = this.closeAddNew.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.getItems = this.getItems.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    };

    openAddNew() {
        this.setState({
            showAddNew: true
        });
    }

    closeAddNew() {
        this.setState({
            showAddNew: false
        });
    }

    updateWithoutSave(newValues) {
        const newData = Object.assign({}, newValues);
        this.setState({
            itemData: newData
        });
    }

    componentDidMount() {
        this.getItems();
    }

    getItems() {
        var cookies = Cookies.get('talentAuthToken');
        const getUrl = 'https://advanceservicesprofile.azurewebsites.net/profile/profile/getExperience';
        $.ajax({
            url: getUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                res.data.sort((a, b) => new Date(b.start) - new Date(a.start));
                this.updateWithoutSave(res.data);
            }.bind(this),
            error: function (res) {
            }
        })
    }

    addItem(data) {
        var cookies = Cookies.get('talentAuthToken');
        const addUrl = 'https://advanceservicesprofile.azurewebsites.net/profile/profile/addExperience';
        $.ajax({
            url: addUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(data),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Work experience updated successfully", "success", null, null)
                    this.getItems();
                } else {
                    TalentUtil.notification.show("Work experience did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show("Error while updating work experience details", "error", null, null);
            }
        })
    }

    deleteItem(data) {
        var cookies = Cookies.get('talentAuthToken');
        const deleteUrl = 'https://advanceservicesprofile.azurewebsites.net/profile/profile/deleteExperience';
        $.ajax({
            url: deleteUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(data),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Work experience updated successfully", "success", null, null)
                    this.getItems();
                } else {
                    TalentUtil.notification.show("Work experience did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show("Error while updating work experience details", "error", null, null);
            }
        })
    }

    renderTableItems(itemData) {
        const itemArray = Array.isArray(itemData) ? itemData : Object.values(itemData);

        if (!itemArray || itemArray.length === 0) {
            return [];
        }
        const rows = [];
        //TODO order itemArray on Start date?
        itemArray.forEach(item => {
            rows.push(
                <ItemRow
                    key={item.id}
                    item={item}
                    addFunc={this.addItem}
                    deleteFunc={this.deleteItem}
                />
            );
        });

        return rows;
    }

    render() {
        return (
            <div className='ui sixteen wide column'>
                <AddNewItem
                    show={this.state.showAddNew}
                    closeFunc={this.closeAddNew}
                    addFunc={this.addItem}
                />
                <table className="ui table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Responsibilities</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>
                                <button type="button" className="ui right floated teal button" onClick={this.openAddNew}>+ Add New</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableItems(this.state.itemData)}
                    </tbody>
                </table>
            </div>
        )
    }
}
