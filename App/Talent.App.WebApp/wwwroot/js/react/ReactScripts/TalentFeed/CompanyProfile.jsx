import React from 'react';
import Cookies from 'js-cookie';
import { Card, Icon, Loader, Image } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            employerData: null
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://advanceservicesprofile.azurewebsites.net/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let employerData = null;
                if (res.employer) {
                    employerData = res.employer
                }
                this.setState({
                    employerData: employerData,
                    isLoading: false
                });
            }.bind(this),
            error: function (res) {
            }
        })
    }

    renderProfilePhoto() {
        const { employerData } = this.state;
        const profilePhoto = employerData ? employerData.profilePhotoUrl : null;

        if (profilePhoto) {
            return (
                <Image avatar src={profilePhoto} alt="Profile Photo" />
            );
        } else {
            return (
                <Image avatar src="/images/image.png" alt="Profile Photo" />
            );
        }
    }

    render() {
        const { isLoading, employerData } = this.state;
        const name = employerData ? employerData.companyContact.name : '';
        const city = employerData ? employerData.companyContact.location.city : '';
        const country = employerData ? employerData.companyContact.location.country : '';
        const phone = employerData ? employerData.companyContact.phone : '';
        const email = employerData ? employerData.companyContact.email : '';
        const skills = employerData ? employerData.skills : [];
        const skillString = skills.length > 0 ? skills.join(', ') : 'We currently do not have specific skills that we desire.';


        if (isLoading) {
            return <Loader active inline='centered' />;
        }

        return (
            <Card>
                <Card.Content>
                    <div className="center aligned author">
                        {this.renderProfilePhoto()}
                    </div>
                    <div className="center aligned header">{name}</div>
                    <Card.Meta>
                        <div className="center aligned address">
                            <p
                            ><i className="fas fa-map-marker-alt"></i>
                                &nbsp;
                                {city}, {country}
                            </p>
                        </div>
                    </Card.Meta>
                    <div className="center aligned description">
                        <p>{skillString}</p>
                    </div>
                </Card.Content>
                <Card.Content extra>
                    <div className="left aligned">
                        <p><Icon name='phone' />: {phone}</p>
                        <p><Icon name='mail' />: {email}</p>
                    </div>
                </Card.Content>
            </Card>
        );
    }

}