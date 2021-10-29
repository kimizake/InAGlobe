// Main ReactJS libraries
import React, {Component} from "react"
import {withRouter} from "react-router-dom"


// Material UI libraries
import {
    withStyles,
    Card,
    CardContent,
    CardActions,
    ButtonBase
} from "@material-ui/core"

// Imports of different components in project
import RegularButton from "../../components/CustomButtons/RegularButton"

import ProjectDialogue from "../../components/Projects/ProjectModals"

import config from "../../config"

// Import class's stylesheet
import styles from "../../assets/jss/views/projectCardStyle"
import {GAEvent, initGA} from "../../components/Tracking/Tracking";

class ProjectCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: JSON.parse(localStorage.getItem('user')).permissions,
            userId: JSON.parse(localStorage.getItem('user')).userId,
            projectId: this.props.data.id,
            deleteBox: false
        };
        this.openProposalPage = this.openProposalPage.bind(this);
        this.hasPermission = this.hasPermission.bind(this);
    }

    componentDidMount() {
        initGA();
    }

    openProposalPage() {
        GAEvent("Project", "Learn More Button", this.props.data.id + "|" + this.props.data.title);
        const dataValue = JSON.stringify(this.props.data);
        localStorage.setItem(`proposalPage/${this.props.data.id}`, dataValue);
        this.props.history.push(`/main/projectlist/proposalpage/${this.props.data.id}`)
    }

    hasPermission = (ownerId) => {
        return (this.state.userType === 0 || this.state.userId === parseInt(ownerId))
    };

    render() {
        const {classes} = this.props;
        const {
            title,
            organisation,
            status,
            shortDescription,
            images
        } = this.props.data;

        return (
            <Card className={classes.cardDiv}>
                <ButtonBase className={classes.cardAction} onClick={this.openProposalPage}>
                    <img
                        className={classes.cardImgTop}
                        alt="Provided for a Card."
                        src={config.s3Bucket + images[0]}
                    />
                    <CardContent>
                        <h3>{title}</h3>
                        <h4>{organisation}</h4>
                        <h5>{status}</h5>
                        <p>{shortDescription}</p>
                    </CardContent>
                </ButtonBase>
                <CardActions className={classes.buttonDiv}>
                    <RegularButton
                        color="primary"
                        className={classes.learnMoreButton}
                        onClick={this.openProposalPage}
                    >
                        Learn More
                    </RegularButton>
                    {this.hasPermission(this.props.data.projectOwner) ?
                        <ProjectDialogue ProjectData={this.props.data}/> :
                        <></>
                    }
                </CardActions>
            </Card>

        )
    }
}

export default withRouter(withStyles(styles)(ProjectCard))
