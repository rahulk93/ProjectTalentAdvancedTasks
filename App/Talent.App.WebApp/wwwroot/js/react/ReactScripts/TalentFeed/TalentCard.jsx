import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Form, Card, Grid, Button, Image, Popup, Icon, ButtonGroup, GridColumn } from 'semantic-ui-react'
import styles from './TalentCard.module.css';

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showVideo: true
        };
        this.showVideo = this.showVideo.bind(this);
        this.showTalentSnapshot = this.showTalentSnapshot.bind(this);
    };

    showVideo() {
        this.setState({ showVideo: true });
    };

    showTalentSnapshot() {
        this.setState({ showVideo: false });
    };

    renderSwitchButton() {
        const { showVideo } = this.state;
        let { icon, onClick } = { icon: '', onClick: null };
        if (showVideo) {
            icon = 'user';
            onClick = this.showTalentSnapshot;
        } else {
            icon = 'video';
            onClick = this.showVideo;
        }
        return (
            <Button basic icon={icon} onClick={onClick} />
        );

    };

    render() {
        const talent = this.props.talent;
        const { showVideo } = this.state;
        const skills = talent.skills ? talent.skills : [];
        const photoUrl = talent.profilePhotoUrl ? talent.profilePhotoUrl : '/images/image.png';
        const skillButtons = skills.map((skill, index) => (
            <Button key={index} basic color='blue'>{skill}</Button>
        ));
        const talentVideoUrl = null;
        const videoObj = talentVideoUrl ? (
            <ReactPlayer
                url={talent.videoUrl}
                playing={false}
                controls={true}
                width='100%'
                height='100%'
                fluid={true}
            />
        ) : (
            <Image
                src="/images/video_placeholder.png"
                fluid
            />
        );
        const cardContentRow = showVideo ? (
            <div>
                {videoObj}
            </div>
        ) : (
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column className={styles['talent-gridColumnLeft']} width={8}>
                        <Image
                            src={photoUrl}
                            fluid
                        />
                    </Grid.Column>
                    <Grid.Column className={styles['talent-gridColumnRight']} width={8}>
                        <div className={styles['talent-details']}>
                            <h4>Talent snapshot</h4>
                            <Form>
                                <Form.Field>
                                    <label>CURRENT EMPLOYER</label>
                                    <p>{talent.currentEmployment}</p>
                                </Form.Field>
                                <Form.Field>
                                    <label>VISA STATUS</label>
                                    <p>{talent.visa}</p>
                                </Form.Field>
                                <Form.Field>
                                    <label>POSITION</label>
                                    <p>{talent.level}</p>
                                </Form.Field>
                            </Form>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
        return (
            <Card fluid>
                <Card.Header className={styles['card-header']}>
                    {talent.name}
                    <Icon name="star outline" size='large' style={{ float: "right" }} />
                </Card.Header>
                <Card.Content className={styles['card-content']}>
                    {cardContentRow}
                </Card.Content>
                <Card.Content extra className={styles['card-content']}>
                    <Button.Group fluid>
                        {this.renderSwitchButton()}
                        <Button basic icon="file pdf outline" />
                        <Button basic icon="linkedin" />
                        <Button basic icon="github" />
                    </Button.Group>
                </Card.Content>
                <Card.Content extra>
                    <ButtonGroup>
                        {skillButtons}
                    </ButtonGroup>
                </Card.Content>
            </Card>
        );
    };
}
