/* LevelItem section, used by Skill and Language */
import React from 'react';
import Cookies from 'js-cookie';
import { Select } from '../Form/Select.jsx'


export class AddNewItem extends React.Component {
    constructor(props) {
        super(props);

        this.itemName = this.props.itemName ? this.props.itemName : "";
        this.itemNameFirstUpper = this.props.itemName ?
            this.props.itemName.charAt(0).toUpperCase() + this.props.itemName.slice(1)
            : "";

        this.state = {
            newData: { name: "", level: "" },
        };

        this.close = this.close.bind(this);
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    add() {
        if (this.state.newData.name === "") {
            TalentUtil.notification.show("Invalid " + this.itemName + " name", "error", null, null);
            return;
        }
        if (this.state.newData.level === "") {
            TalentUtil.notification.show("Invalid " + this.itemName + " level", "error", null, null);
            return;
        }
        this.props.addFunc(this.state.newData);
        this.close();
    };

    render() {
        const addPlaceHolder = "Add " + this.itemNameFirstUpper;
        const editPlaceHolder = this.itemNameFirstUpper + " Level";
        return (
            this.props.show ?
                <div className="ui grid">
                    <div className="row">
                        <div className="ui five wide column">
                            <input
                                type='text'
                                name='name'
                                placeholder={addPlaceHolder}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="ui five wide column">
                            <Select
                                type='text'
                                name='level'
                                placeholder={editPlaceHolder}
                                options={this.props.levelOptions}
                                controlFunc={this.handleChange}
                            />
                        </div>
                        <div className="ui six wide column">
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

        const item = this.props.item ? this.props.item : { id: null, name: "", level: "" };
        this.itemName = this.props.itemName ? this.props.itemName : "";

        this.state = {
            newData: item,
            showEdit: false
        };

        this.showEdit = this.showEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    add() {
        if (this.state.newData.name === "") {
            TalentUtil.notification.show("Invalid " + this.props.itemName + " name", "error", null, null);
            return;
        }
        if (this.state.newData.level === "") {
            TalentUtil.notification.show("Invalid " + this.props.itemName + " level", "error", null, null);
            return;
        }
        this.props.addFunc(this.state.newData);
        this.closeEdit();
    };

    delete() {
        this.props.deleteFunc(this.state.newData);
    }

    renderView() {
        return (
            <tr>
                <td>{this.state.newData.name}</td>
                <td>{this.state.newData.level}</td>
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
                <td>
                    <input
                        type='text'
                        name='name'
                        value={this.state.newData.name}
                        onChange={this.handleChange}
                    />
                </td>
                <td>
                    <Select
                        type='text'
                        name='level'
                        selectedOption={this.state.newData.level}
                        options={this.props.levelOptions}
                        controlFunc={this.handleChange}
                    />
                </td>
                <td>
                    <button type="button" className="ui primary basic button" onClick={this.add}>Update</button>
                    <button type="button" className="ui negative basic button" onClick={this.closeEdit}>Cancel</button>
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

export default class LevelItem extends React.Component {
    constructor(props) {
        super(props);
        this.itemName = this.props.itemName ? this.props.itemName : "";
        this.itemNameFirstUpper = this.props.itemName ?
            this.props.itemName.charAt(0).toUpperCase() + this.props.itemName.slice(1)
            : "";
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
        const getUrl = 'https://advanceservicesprofile.azurewebsites.net/profile/profile/get' + this.itemNameFirstUpper;
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
                this.updateWithoutSave(res.data);
            }.bind(this),
            error: function (res) {
            }
        })
    }

    addItem(data) {
        var cookies = Cookies.get('talentAuthToken');
        const addUrl = 'https://advanceservicesprofile.azurewebsites.net/profile/profile/add' + this.itemNameFirstUpper;
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
                    TalentUtil.notification.show(this.itemNameFirstUpper + "s updated successfully", "success", null, null)
                    this.getItems();
                } else {
                    TalentUtil.notification.show(this.itemNameFirstUpper + "s did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show("Error while updating " + this.itemName + " details", "error", null, null);
            }
        })
    }

    deleteItem(data) {
        var cookies = Cookies.get('talentAuthToken');
        const deleteUrl = 'https://advanceservicesprofile.azurewebsites.net/profile/profile/delete' + this.itemNameFirstUpper;
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
                    TalentUtil.notification.show(this.itemNameFirstUpper + "s updated successfully", "success", null, null)
                    this.getItems();
                } else {
                    TalentUtil.notification.show(this.itemNameFirstUpper + "s did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show("Error while updating " + this.itemName + " details", "error", null, null);
            }
        })
    }

    renderTableItems(itemData) {
        const itemArray = Array.isArray(itemData) ? itemData : Object.values(itemData);

        if (!itemArray || itemArray.length === 0) {
            return [];
        }
        const rows = [];
        itemArray.forEach(item => {
            rows.push(
                <ItemRow
                    key={item.id}
                    item={item}
                    addFunc={this.addItem}
                    deleteFunc={this.deleteItem}
                    levelOptions={this.props.levelOptions}
                    itemName={this.props.itemName}
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
                    levelOptions={this.props.levelOptions}
                    itemName={this.props.itemName}
                />
                <table className="ui table">
                    <thead>
                        <tr>
                            <th>{this.itemNameFirstUpper}</th>
                            <th>Level</th>
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
