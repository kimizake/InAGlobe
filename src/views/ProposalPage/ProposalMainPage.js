// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {withStyles} from '@material-ui/core'

// Imports of different components in project
import Comments from '../../components/Comments/Comments'
import ProposalPage from "./ProposalPage"
import RegularButton from '../../components/CustomButtons/RegularButton'
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import ProjectDialogue from "../../components/Projects/ProjectModals"
import config from "../../config"

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"
import {GAEvent} from "../../components/Tracking/Tracking"

class ProposalMainPage extends Component {

    constructor(props) {
        super(props)
        const userType = JSON.parse(localStorage.getItem('user')).permissions
        console.log(this.props)
        const projectData = this.getProjectData()
        this.state = {
            userId: JSON.parse(localStorage.getItem('user')).userId,
            userType: userType,
            projectData: projectData,
            buttonDisabled: !(userType === 0 || (userType !== 1 && projectData.status === "Approved")),
            buttonMessage: this.getButtonMessage(userType, projectData.status, projectData.joined),
            comments: [],
            showModal: false,
        }
        this.actionButtonClicked = this.actionButtonClicked.bind(this)
        this.getButtonMessage = this.getButtonMessage.bind(this)
        this.hasPermissions = this.hasPermissions.bind(this)

        console.log("UserType:" + this.state.userType)
        console.log(userType)
        console.log(this.state.buttonDisabled)
    }

    componentWillReceiveProps () {
        this.getProjectData()
    }

    getProjectData() {
        const projectData = this.props.data.filter(project =>
            project.id === parseInt(this.props.match.params.id)
        )


        const localKey = "pdata" + this.props.match.params.id
        if (!(projectData.length === 0)) {
            this.setState({
               projectData: projectData[0]
            })
            localStorage.setItem(localKey, JSON.stringify(projectData[0]))
            return projectData[0]
        } else {
            const localProjectData = localStorage.getItem(localKey)
            console.log(localProjectData)
            if (localProjectData === null) {
                this.props.history.push("/main/home")
            } else {
                this.setState({
                    "projectData": JSON.parse(localProjectData)
                })
                return JSON.parse(localProjectData)
            }
        }
    }

    actionButtonClicked = () => {
        const token = JSON.parse(localStorage.getItem('user')).token
        const bearer = 'Bearer ' + token
        GAEvent("Project", this.state.buttonMessage + " clicked",toString(this.state.projectData.id))
        let new_project_data
        if (this.state.userType === 0) {
            new_project_data = this.state.projectData
            new_project_data.status = new_project_data.status === "Approved" ? "Needs Approval" : "Approved"
            this.setState({
                projectData: new_project_data,
                buttonMessage: this.getButtonMessage(this.state.userType, new_project_data.status, new_project_data.joined)
            })
            fetch(config.apiUrl + '/approve/', {
                method: 'post',
                headers: {
                    'Authorization': bearer,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({"projectId": this.state.projectData.id}),
            }).then((response) => {
                // Redirect here based on response
                console.log(response)
            }).catch((err) => {
                console.log(err)
            })
        } else if ((this.state.userType === 2 || this.state.userType === 3)) {
            if (this.state.projectData.joined === 0) {
                new_project_data = this.state.projectData
                new_project_data.joined = 1
                this.setState({
                    projectData: new_project_data,
                    buttonMessage: this.getButtonMessage(this.state.userType, new_project_data.status, new_project_data.joined)
                })

                fetch(config.apiUrl + '/dashboard/', {
                    method: 'post',
                    headers: {
                        'Authorization': bearer,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({"projectId": this.state.projectData.id})
                }).then((response) => {
                    // Redirect here based on response
                    console.log(response)
                })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                new_project_data = this.state.projectData
                new_project_data.joined = 0
                this.setState({
                    projectData: new_project_data,
                    buttonMessage: this.getButtonMessage(this.state.userType, new_project_data.status, new_project_data.joined)
                })

                fetch(config.apiUrl + '/dashboard/', {
                    method: 'delete',
                    headers: {
                        'Authorization': bearer,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({"projectId": this.state.projectData.id, "userId": this.state.userId}),
                }).then((response) => {
                    // Redirect here based on response
                    console.log(response)
                })
                    .catch((err) => {
                        console.log(err)
                    })

            }

        }
    }

    getButtonMessage = (userType, status, joined) => {
        if (userType === 0) {
            if (status === "Needs Approval") {
                return "Approve"
            }
            return "Disapprove"
        } else if (userType === 1) {
            return status
        } else if (joined === 0) {
            return "Request joining"
        } else if (joined === 1) {
            return "Cancel request"
        } else {
            return "Leave project"
        }
    }

    hasPermissions = (ownerId) => {
        return (this.state.userType === 0 || this.state.userId === parseInt(ownerId))
    }

    render() {
        const {classes, match} = this.props
        return (
            <ResponsiveDrawer name={"Project Page"}>
                <ProposalPage {...this.props} data={this.state.projectData} isPreview={false}>
                    <div className={classes.buttonsDiv}>
                        <RegularButton
                            color="primary"
                            onClick={this.actionButtonClicked}
                            disabled={this.state.buttonDisabled}
                        >
                            {this.state.buttonMessage}
                        </RegularButton>
                        {this.state.projectData.joined === 2
                            ?
                            <RegularButton
                                color="primary"
                                onClick={() => this.props.history.push(`/main/projectlist/checkpoint/${match.params.id}`)}
                            >
                                Add Checkpoint Progress
                            </RegularButton>
                            :
                            null
                        }
                        {this.hasPermissions(this.state.projectData.projectOwner) ?
                            <ProjectDialogue ProjectData={this.state.projectData}/> :
                            <></>
                        }
                    </div>
                    <div className={classes.commentsDiv}>
                        <Comments {...this.props} projectId={this.state.projectData.id}/>
                    </div>
                </ProposalPage>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)
