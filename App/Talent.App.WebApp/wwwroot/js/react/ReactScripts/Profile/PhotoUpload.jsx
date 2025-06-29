/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react';
export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);

        this.loadImage = this.loadImage.bind(this);
        this.selectFileToUpload = this.selectFileToUpload.bind(this);
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.fileUploadHandler = this.fileUploadHandler.bind(this);
        this.maxFileSize = 2097152;
        this.maxNoOfFiles = 1;
        this.acceptedFileType = ["image/gif", "image/jpeg", "image/png", "image/jpg"];

        this.state = {
            selectedFile: null,
            imageSrc: null,
            showUpload: false,
        }
    };

    loadImage() {

        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: 'https://advanceservicesprofile.azurewebsites.net/profile/profile/getProfilePhoto',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                this.setState({
                    imageSrc: res.data,
                });
            }.bind(this)
        });
    }

    componentDidMount() {
        this.loadImage();
    }

    selectFileToUpload() {
        document.getElementById('selectFile').click();
    }

    fileSelectedHandler(event) {

        let localSelectedFile = this.state.selectedFile;
        let localImageSrc = this.state.imageSrc;
        let localCurrentNoOfFiles = this.state.currentNoOfFiles;

        if (localCurrentNoOfFiles >= this.maxNoOfFiles) {
            TalentUtil.notification.show("Exceed Maximum number of files allowable to upload", "error", null, null);
        }
        else if (event.target.files[0].size > this.maxFileSize || this.acceptedFileType.indexOf(event.target.files[0].type) == -1) {
            TalentUtil.notification.show("Max file size is 2 MB and supported file types are *.jpg, *.jpeg, *.png, *.gif", "error", null, null);
        }
        else {
            localSelectedFile = event.target.files[0];
            localImageSrc = window.URL.createObjectURL(event.target.files[0]);
        }
        this.setState({
            selectedFile: localSelectedFile,
            imageSrc: localImageSrc,
            showUpload: true,
        })
    }

    fileUploadHandler() {
        if (this.state.selectedFile != null) {
            let data = new FormData();
            if (this.state.selectedFile != "") {
                data.append('file', this.state.selectedFile);
            }


            var cookies = Cookies.get('talentAuthToken');

            $.ajax({
                url: 'https://advanceservicesprofile.azurewebsites.net/profile/profile/UpdateProfilePhoto',
                headers: {
                    'Authorization': 'Bearer ' + cookies
                },
                type: "POST",
                data: data,
                cache: false,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.success) {
                        TalentUtil.notification.show("Profile photo updated successfully", "success", null, null)
                        this.setState({ showUpload: false });
                        this.loadImage();
                    } else {
                        TalentUtil.notification.show(res.message, "error", null, null);
                    }
                }.bind(this),
                error: function (res, status, error) {
                    //Display error
                    TalentUtil.notification.show("There is an error when updating Images - " + error, "error", null, null);
                }
            });

        }
    }

    render() {
        let showProfileImg = null;
        if ((this.state.imageSrc === null) || (this.state.imageSrc === '')) {
            showProfileImg = (
                <span key="new">
                    <i
                        className="huge circular camera retro icon"
                        style={{ alignContent: 'right', verticalAlign: 'top' }}
                        onClick={this.selectFileToUpload}
                    >
                    </i>
                </span>
            );
        }
        else {
            showProfileImg = (
                <span>
                    <img
                        style={{ height: 112, width: 112, borderRadius: 55 }}
                        className="ui small"
                        src={this.state.imageSrc} alt="Image Not Found"
                        onClick={this.selectFileToUpload}
                    />
                </span>
            );
        }

        return (
            <div className="ui grid container">
                <div className="ui twelve wide column">
                    <div className="field">
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="work_sample_uploader" className="profile-photo">
                                {showProfileImg}
                            </label>
                            <input id="selectFile" type="file" style={{ display: 'none' }} onChange={this.fileSelectedHandler} accept="image/*" />
                        </div>
                        <div>
                            {this.state.showUpload ? (
                                <button
                                    type="button"
                                    className="ui teal button"
                                    onClick={this.fileUploadHandler}
                                >
                                    <Icon name='upload'></Icon>Upload
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
