import React, { Component } from 'react'
import ScrollMenu from "react-horizontal-scrolling-menu"

import { 
    withStyles, 
    Avatar, 
    Grid,
    Hidden,
    Link, 
    Typography,
    IconButton,
} from "@material-ui/core"
import { 
    ArrowBackIos, 
    ArrowForwardIos, 
    Create, 
    LocationOn,
} from "@material-ui/icons"

import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

import styles from "../../assets/jss/views/userProfileStyle"
import imageNull from "../../assets/img/imageNull.png"

import exampleProfile from "../../assets/data/UserProfileData"
import { userService } from "../../services/userService"
import cloneDeep from "lodash.clonedeep"
import config from "../../config"

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth,
            data: {
                firstName: "",
                lastName: "",
                email: "",
                location: "",
                profilePicture: "",
                permissions: -1,
                userId: -1,
                shortDescription: "",
                longDescription: "",
                images: [],
                documents: []
            }
        }
        this.pictureList = null
    }

    updateDimensions = () => {
        this.setState({ 
            width: window.innerWidth
        })
    }

    get = () => {
        const currentUser = JSON.parse(localStorage.getItem("user"))
        const id = this.props.match.params.id

        if (id) {
            userService.getProfile(id)
            .then(data => {
                console.log(data)
                this.setState({
                    data: data
                })
            })
            .catch(console.log)
        } else {
            delete currentUser.token
            this.setState({
                data: currentUser
            })
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        if (this.pictureList) this.pictureList.scrollTo(0)
        this.get()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    render() {
        const { classes } = this.props

        let userTypeText
        switch (this.state.data.permissions) {
            case -1:
                userTypeText = "Waiting"
                break
            case 0:
                userTypeText = "Admin"
                break
            case 1:
                userTypeText = "Humanitarian"
                break
            case 2:
                userTypeText = "Academic"
                break
            case 3:
                userTypeText = "Student"
                break
            default:
                console.log("Big User Type Error!!!!")
        }

        var scrollMenu = null
        if (this.state.data.images) {
            scrollMenu = (
                <ScrollMenu 
                    ref={element => this.pictureList = element}
                    data={this.state.data.images.map((pic, index) => (
                            <img
                                key={index}
                                alt={`Album Data ${index}`}
                                src={config.s3Bucket + pic}
                                className={classes.scrollViewImage}
                            />
                    ))}
                    arrowLeft={
                        <IconButton aria-label="scroll-left">
                            <ArrowBackIos fontSize="small"/>
                        </IconButton>
                    }
                    arrowRight={
                        <IconButton aria-label="scroll-right">
                            <ArrowForwardIos fontSize="small"/>
                        </IconButton>
                    }
                    hideArrows={true}
                    hideSingleArrow={true}
                    alignOnResize={true}
                    scrollToSelected={true}
                    transition={0.6}
                    innerWrapperStyle={{
                        marginTop: "0", 
                        marginBottom: "10px"
                    }}
                />
            )
        }
        

        return (
            <ResponsiveDrawer name={"User Profile"}>
                <Grid container>
                    {this.props.match.params.id
                        ? 
                        null
                        :
                        <Grid item xs={12} className={classes.rightAlign}>
                            <IconButton
                                onClick={() => this.props.history.push("/main/editprofile")}
                            >
                                <Create fontSize="medium" />
                            </IconButton>
                            <Typography component="h5" variant="h5" className={classes.editProfile}>
                                {":Edit Profile"}
                            </Typography>
                        </Grid>
                    }
                    <Grid item xs={12} className={classes.centering}>
                        {this.state.data.profilePicture
                            ?
                            <Avatar 
                                alt="Profile Picture"
                                src={config.s3Bucket + this.state.data.profilePicture}
                                className={classes.avatar}
                            />
                            :
                            <Avatar 
                                alt="Profile Picture"
                                src={imageNull}
                                className={classes.avatar}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} className={classes.centering}>
                        <Typography component="h3" variant="h2">
                            {`${this.state.data.firstName} ${this.state.data.lastName}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <Typography component="h5" variant="h5">
                            <b>Email Address: </b>
                            {this.state.data.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <Typography component="h5" variant="h5">
                            <b>User Type: </b>
                            {userTypeText}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <Typography component="h5" variant="h5">
                            <b>Location: </b>
                            {this.state.data.location
                                ?
                                this.state.data.location
                                :
                                <font color="grey">No Location Available</font>
                            }
                        </Typography>
                        <Link 
                            href={`https://www.google.com/maps/search/${this.state.data.location ? this.state.data.location.replace(" ", "+") : ""}`}
                            className={classes.mapsLinkIcon}
                        >
                            <LocationOn />
                        </Link>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>Summary: </b>
                            </Typography>
                            <br />
                            <Typography component="span" variant="body1">
                                {this.state.data.shortDescription
                                    ?
                                    this.state.data.shortDescription
                                    :
                                    <font color="grey">No Summary Available</font>
                                }
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>Biography: </b>
                            </Typography>
                            <br />
                            <Typography component="span" variant="body1">
                                {this.state.data.longDescription
                                    ?
                                    this.state.data.longDescription
                                    :
                                    <font color="grey">No Biography Available</font>
                                }
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>Album Pictures: </b>
                            </Typography>
                            <br />
                            
                            {this.state.data.images.length !== 0
                                ? 
                                <div>
                                    <Hidden xsDown implementation="css">
                                        <div style={{ width: `calc(${this.state.width}px - 350px)` }}>
                                            {scrollMenu}
                                        </div>
                                    </Hidden>
                                    <Hidden smUp implementation="css">
                                        <div style={{ width: `calc(${this.state.width}px - 85px)` }}>
                                            {scrollMenu}
                                        </div>
                                    </Hidden>
                                </div>
                                :
                                <font color="grey" style={{ fontSize: "1.4em" }}>No Album Pictures Available</font>
                            }
                        </div>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>User Documents: </b>
                            </Typography>
                            <br />
                            {this.state.data.documents.length !== 0
                                ?
                                this.state.data.documents.map(document => (
                                    <Link href={config.s3Bucket + document}>
                                        {/[^/]*$/.exec(document)[0]}{"\n"}
                                    </Link>
                                ))
                                :
                                <font color="grey" style={{ fontSize: "1.4em" }}>No Documents Available</font>
                            }
                        </div>
                    </Grid>
                </Grid>
            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(Profile)