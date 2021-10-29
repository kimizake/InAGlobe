// Main ReactJS libraries
import React, {Component} from "react"
import {Switch, Redirect} from "react-router-dom"

// Material UI libraries
import {withStyles} from "@material-ui/styles"

// Importing web path data for logins
import {mainRoutes} from "../../routes"

// Importing class's stylesheet
import styles from "../../assets/jss/layouts/mainPageStyle"
import {PrivateRoute} from "../../helpers/PrivateRoute"
import {projectService} from "../../services/projectsService"

// Importing helper or service functions
import {EventSourcePolyfill} from "event-source-polyfill";
import config from "../../config";
import {Route} from "react-router";


class MainPage extends Component {

    constructor(props) {
        super(props)
        this.getProjectList()
        this.state = {
            projects: [],
            '/home': {
                needApproval: []
            },
            '/projectlist': [],
            '/proposalpage/:id': []
        }
        this.getProjectList = this.getProjectList.bind(this)
        this.handleProjectUpdates = this.handleProjectUpdates.bind(this)
        this.eventSource = new EventSourcePolyfill(config.apiUrl + '/project-stream/', {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
            }
        })
    }

    async componentDidMount() {
        this.eventSource.addEventListener('project-stream', json => this.handleProjectUpdates(json));
        this.eventSource.addEventListener('error', (err) => {
            console.log(err)
        });
        try {
            this.interval = setInterval(async () => {
                this.getProjectList();
            }, 2000)
        } catch (e) {
            console.log(e);
        }
    };

    componentWillUnmount() {
        this.eventSource.removeEventListener('project-stream', json => this.handleProjectUpdates(json));
        this.eventSource.removeEventListener('error', (err) => {
            console.log(err)
        });
        this.eventSource.close();
        console.log("Unmounting");
        clearInterval(this.interval);
    };

    handleProjectUpdates(json) {
        const v = JSON.parse(json.data);
        if (v.message === 'Project added to db!') {
            this.setState({
                projects: this.state.projects.concat(v.project)
            })
        }
        else {
            const array = [...this.state.projects]
            const index = array.findIndex(function (item) {
                return item.id === v.project.id
            })
            if (index !== -1) {
                if (v.message === 'Project updated!') {
                    Object.keys(v.project).forEach((key) => {
                        array[index][key] = v.project[key]
                    })
                } else if (v.message === 'Project approved!' || v.message === 'Project disapproved!') {
                    Object.keys(v.project).forEach((key) => {
                        array[index][key] = v.project[key]
                    })
                } else if (v.message === 'Project deleted!') {
                    array.splice(index, 1)
                }
                this.setState({
                    projects: array
                })
            }
        }
        this.setState({
            '/home': {
                needApproval: this.state.projects.filter(project => project.status === "Needs Approval"),
            },
            '/projectlist': this.state.projects,
        })
    }

    getProjectList = () => {
        console.log("Getting projects!");
        projectService.getProjects()
            .then(data => {
                data.projects.forEach(project =>
                    project.status = (project.status === 0 ? "Needs Approval" : "Approved")
                )
                localStorage.setItem("projects", JSON.stringify(data))
                this.setState({
                    projects: data.projects,
                    '/home': {
                        needApproval: data.projects.filter(project => project.status === "Needs Approval")
                    },
                    '/projectlist': data.projects,
                    '/proposalpage/:id': data.projects,
                });
            })
            .catch(console.log)
    }

    render() {
        return (
            <Switch>
                {mainRoutes.map((prop, key) => {
                    return (
                        <PrivateRoute
                            path={prop.layout + prop.path}
                            key={key}
                            exact
                            component={prop.component}
                            data={this.state[prop.path]}
                        />
                    )
                })}
                {/*<Route path='/analytics' component={() => {*/}
                    {/*window.location.href = 'http://www.google.com';*/}
                    {/*return null*/}
                {/*}}/>*/}
                <Redirect strict from="/main" to="/main/home"/>
            </Switch>
        )
    }
}

export default withStyles(styles)(MainPage)