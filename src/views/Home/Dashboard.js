// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {
    withStyles,
    Grid,
} from '@material-ui/core'
import {
    UpdateOutlined,
    SentimentDissatisfiedOutlined,
    SentimentSatisfiedOutlined
} from "@material-ui/icons"


// Imports of different components in project
import CardScrollView from '../../components/ScrollView/CardScrollView'
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import Notifications from '../../components/Notifications/Notifications'
import Deadlines from "../../components/Deadlines/Deadlines"
import ProjectApprovals from '../../components/Approvals/ProjectApprovals'
// import GridContainer from "../../components/Grid/GridContainer"
// import GridItem from "../../components/Grid/GridItem"
// import ProjectCard from "../ProjectList/ProjectCard"

import config from '../../config'
import {dashboardService} from "../../services/dashboardService"

// Importing class's stylesheet
import styles from "../../assets/jss/views/homePageStyle"
import {projectService} from "../../services/projectsService"

// Example data
// import data from "../../assets/data/ProjectData"
// import notifications from "../../assets/data/NotificationData"
// import deadlines from "../../assets/data/DeadlinesData"

class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.joinRequestClicked = this.joinRequestClicked.bind(this)

        this.state = {
            user: {},
            projects: [],
            requests: [],
            userType: JSON.parse(localStorage.getItem('user')).permissions
        }

    }

    joinRequestClicked = (project_id, user_id, index, isApproved) => {
        var token = JSON.parse(localStorage.getItem('user')).token
        var bearer = 'Bearer ' + token
        if (!isApproved) {
            fetch(config.apiUrl + '/dashboard/', {
                method: 'delete',
                headers: {
                    'Authorization': bearer,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({"projectId": project_id, "userId": user_id}),
            }).then((response) => {
                // Redirect here based on response
                console.log(response)
                alert("Request disapproved.")
                this.setState({
                    requests: this.state.requests.filter((_, i) => i !== index)
                })
            })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            fetch(config.apiUrl + `/joiningApprove/`, {
                method: 'post',
                headers: {
                    'Authorization': bearer,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user_id,
                    projectId: project_id
                })
            }).then(response => {
                // Redirect here based on response
                console.log(response)
                alert("Request approved.")
                this.setState({
                    requests: this.state.requests.filter((_, i) => i !== index)
                })
            }).catch(err => console.log(err))
        }
    }

    async componentDidMount() {
        this.setState({
            user: localStorage.getItem('user'),
        })

        this.getDashboardData()
        try {
            this.interval = setInterval(async () => {
                console.log("Getting dashboard!")
                this.getDashboardData()
            }, 2000)
        } catch (e) {
            console.log(e)
        }
        this.getDashboardData()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    getDashboardData() {
        var token = JSON.parse(localStorage.getItem('user')).token
        var bearer = 'Bearer ' + token

        dashboardService.getDashboard()
            .then(data => {
                console.log(data)
                data.projects.forEach(project => project.status = (project.status === 0 ? "Needs Approval" : "Approved"))
                this.setState({
                    projects: data.projects
                })
            })
            .catch(console.log)

        // Get the list of project join requests
        fetch(config.apiUrl + '/joiningApprove/', {
            method: 'get',
            headers: {
                'Authorization': bearer
            },
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    requests: data.requests
                })
                console.log(data.requests)
            })
            .catch(console.log)
    }

    render() {
        const {classes} = this.props

        let dashboardComponents
        switch (this.state.userType) {
            case 0:
                dashboardComponents = (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={4}>
                            <Notifications
                                notifyList={[]}
                                title="Notifications"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Deadlines
                                deadlineList={[]}
                                title="Upcoming Deadlines"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <ProjectApprovals
                                approvalList={this.state.requests.map((request, i) => {
                                    return {
                                        notifyId: i,
                                        userId: request.user_id,
                                        projectId: request.project_id,
                                        userProfilePic: request.user_profile_pic,
                                        userName: request.user_first_name + " " + request.user_last_name,
                                        projectName: request.project_title,
                                        details: request.project_short_description,
                                        registrationDate: request.request_date_time
                                    }
                                })}
                                title="User Approvals for Projects"
                                approveFunction={this.joinRequestClicked}
                                {...this.props}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={[]}
                                title="Projects Updates"
                                EmptyIcon={UpdateOutlined}
                                emptyText="No Updates for any Ongoing Projects"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={this.props.data.needApproval}
                                title="Projects to Approve"
                                EmptyIcon={UpdateOutlined}
                                emptyText="No Approvals Needed for New Projects"
                            />
                        </Grid>
                    </Grid>
                )
                break
            case 1:
                dashboardComponents = (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={4}>
                            <Notifications
                                notifyList={[]}
                                title="Notifications"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Deadlines
                                deadlineList={[]}
                                title="Upcoming Deadlines"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <ProjectApprovals
                                approvalList={[]}
                                title="Student/Academic Waiting to Join Project"
                                {...this.props}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={this.state.projects.filter(project => project.status === "Approved")}
                                title="Your Approved Projects"
                                EmptyIcon={SentimentDissatisfiedOutlined}
                                emptyText="No Ongoing Projects. Try joining some!"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={this.state.projects.filter(project => project.status === "Needs Approval")}
                                title="Your Project Proposals Waiting for Admin Approval"
                                EmptyIcon={SentimentSatisfiedOutlined}
                                emptyText="All Projects Approved!"
                            />
                        </Grid>
                    </Grid>
                )
                break
            case 2:
                dashboardComponents = (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            <Notifications
                                notifyList={[]}
                                title="Notifications"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Deadlines
                                deadlineList={[]}
                                title="Upcoming Deadlines"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={this.state.projects.filter(project => project.joined === 2)}
                                title="Ongoing Projects Joined"
                                EmptyIcon={SentimentDissatisfiedOutlined}
                                emptyText="No Ongoing Projects. Try joining some!"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={this.state.projects.filter(project => project.joined === 1)}
                                title="Waiting for Approval to Join Project"
                                EmptyIcon={SentimentSatisfiedOutlined}
                                emptyText="All Projects Approved!"
                            />
                        </Grid>
                    </Grid>
                )
                break
            case 3:
                dashboardComponents = (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            <Notifications
                                notifyList={[]}
                                title="Notifications"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Deadlines
                                deadlineList={[]}
                                title="Upcoming Deadlines"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={this.state.projects.filter(project => project.joined === 2)}
                                title="Ongoing Projects Joined"
                                EmptyIcon={SentimentDissatisfiedOutlined}
                                emptyText="No Ongoing Projects. Try joining some!"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardScrollView
                                {...this.props}
                                className={classes.root}
                                cardData={this.state.projects.filter(project => project.joined === 1)}
                                title="Waiting for Approval to Join Project"
                                EmptyIcon={SentimentSatisfiedOutlined}
                                emptyText="All Projects Joins Approved!"
                            />
                        </Grid>
                    </Grid>
                )
                break
            default:
                console.log("Error in user type!")
        }

        return (
            // <div className={classes.root}>
            //     <GridContainer spacing={2}>
            //         {this.state.projects.map(card => (
            //             <GridItem xs={12} sm={12} md={6} key={card.id}>
            //                 <ProjectCard data={card}/>
            //             </GridItem>
            //         ))} 
            //     </GridContainer>
            // </div>
            <ResponsiveDrawer name={"Dashboard"}>
                {dashboardComponents}
            </ResponsiveDrawer>

        )
    }
}

export default withStyles(styles)(Dashboard)
