// Main ReactJS libraries
import React, {Component} from 'react'
// Material UI libraries
import {withStyles, Grid, Icon, Tooltip, Zoom } from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import ProjectCard from "./ProjectCard"

// Importing class's stylesheet
import styles from "../../assets/jss/views/projectListStyle"
import { initGA, PageView } from "../../components/Tracking/Tracking";
import { projectService } from "../../services/projectsService";
import GoogleMapReact from 'google-map-react'
import Geocode from "react-geocode"
import { PersonPinCircle } from '@material-ui/icons'

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: this.props.data,
            searchQuery: '',
            searchResults: [],
            markers: []
        }
        Geocode.setApiKey(process.env.REACT_APP_GEOCODE_KEY)
        Geocode.setLanguage("en")
    }

    static defaultProps = {
        center: {
            lat: 0.0,
            lng: 0.0
        },
        zoom: 1,
    }

    componentDidMount() {
        // By default search query is empty string, so search displays all projects.
        this.setState({
            searchResults: this.state.projects,
        })
        this.getCoordsList(this.state.searchResults)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // When project data changes on higher level, we update our current state ...
        if (prevProps.data !== this.props.data) {
            this.setState({
                projects: this.props.data,
                // ... we also have to update search results to account for these changes ...
                searchResults: this.props.data.filter(project =>
                    project.title.toLowerCase().includes(
                        this.state.searchQuery
                    )
                ),
            })
            this.getCoordsList(this.state.searchResults)
        }
        // ... or if a new search query has been entered.
        if (prevState.searchQuery !== this.state.searchQuery) {
            this.setState({
                searchResults: this.state.projects.filter(project =>
                    project.title.toLowerCase().includes(
                        this.state.searchQuery
                    )
                ),
            })
            this.getCoordsList(this.state.searchResults)
        }
    }

    getCoordsList = (projects) => {
        projects.forEach(project => {
            Geocode.fromAddress(project.location).then(response => {
                const { lat, lng } = response.results[0].geometry.location
                console.log(`The coordinates for ${project.title} are (${lat}, ${lng})`)
                // const bufferLat = ((Math.random() / 10000) - 0.00050).toPrecision(6)
                // const bufferLng = ((Math.random() / 10000) - 0.00050).toPrecision(6)
                this.setState({
                    markers: [...this.state.markers, {latitude: lat, longitude: lng, name: project.title, projectId: project.id}]
                })
            })
        })
    }

    onSearch = (query) => {
        this.setState({
            searchQuery: query.toLowerCase(),
        })
    };

    render() {
        const {classes} = this.props;
        return (
            <ResponsiveDrawer
                name={"Project List"}
                onSearch={this.onSearch}
            >
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} style={{ height: "500px" }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS_API_KEY }}
                                defaultCenter={this.props.center}
                                defaultZoom={this.props.zoom}
                            >
                                {this.state.markers.map(marker => (
                                    <Tooltip 
                                        title={marker.name} 
                                        TransitionComponent={Zoom}
                                        lat={marker.latitude}
                                        lng={marker.longitude}
                                        arrow
                                    >
                                        <Icon color="primary" onClick={() => this.props.history.push(`/main/projectlist/proposalpage/${marker.projectId}`)}>
                                            <PersonPinCircle />
                                        </Icon>
                                    </Tooltip>
                                ))}
                            </GoogleMapReact>
                        </Grid>
                        {this.state.searchResults.map(card => (
                            <Grid item xs={12} sm={12} md={6} key={card.id}>
                                <ProjectCard data={card}/>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProjectList)
