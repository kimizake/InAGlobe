// Main ReactJS libraries
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {withRouter} from 'react-router-dom'

// Material UI libraries
import {
    withStyles,
    AppBar,
    CssBaseline,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core'
import { Menu, Warning, Assessment } from '@material-ui/icons'

// Importing webpath data for drawer links
import {drawerRoutes} from '../../routes'

// Imports of different components in project
import RegularButton from "../CustomButtons/RegularButton"
import Search from "../Search/Search"

// Importing images from assets
import logo from '../../assets/img/logo.png'

// Importing class's stylesheet
import styles from "../../assets/jss/components/responsiveDrawerStyle"
import 'react-perfect-scrollbar/dist/css/styles.css'


class ResponsiveDrawer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mobileOpen: false,
            userPermissions: JSON.parse(localStorage.getItem('user')).permissions
        }
    }

	handleDrawerToggle = () => {
		this.setState({
            mobileOpen: !this.state.mobileOpen
        })
    }

    render() {
        const {classes, container, name} = this.props

        var alert = null
        const user = JSON.parse(localStorage.getItem("user"))
        // console.log(user)
        if (!user.location || !user.shortDescription || !user.longDescription) {
            alert = (
                <Tooltip title="Incomplete user profile!">
                    <Warning/>
                </Tooltip>
            )
        }

        const drawer = (
            <div>
                <div className={classes.toolbar} style={{textAlign: "left"}}>
                    <span className={classes.logoImage}>
                        <img src={logo} alt="logo" className={classes.img}/>
                    </span>
                    <span className={classes.logoText}>
                        <p className={classes.logoTextFont}>InAGlobe</p>
                    </span>
                </div>
                <List>
                    {drawerRoutes.map(route => (
                        route.icon !== null && route.userLevel >= this.state.userPermissions
                            ?
                            <ListItem
                                button
                                onClick={() => this.props.history.push(route.layout + route.path)}
                                key={route.name}
                                className={classes.centering}
                            >
                                {this.state.mobileOpen ?
                                    <ListItemIcon>
                                        <route.icon fontSize="large"/>
                                    </ListItemIcon> :
                                    <ListItemIcon className={classes.iconColor}>
                                        <route.icon fontSize="large"/>
                                    </ListItemIcon>}

                                <ListItemText
                                    primary={route.name}
                                    classes={{
                                        primary: classes.listItemText,
                                        root: classes.drawerSectionSize
                                    }}
                                />

                                {route.name === "User Profile" ? alert : null}
                            </ListItem>
                            :
                            null
                    ))}
                    {this.state.userPermissions === 0 ?
                        <ListItem
                            button
                            onClick={() => window.open("https://analytics.google.com/")}
                            key={"Analytics"}
                            className={classes.centering}
                        >
                            {this.state.mobileOpen ?
                                <ListItemIcon><Assessment fontSize="large"/></ListItemIcon> :
                                <ListItemIcon className={classes.iconColor}><Assessment
                                    fontSize="large"/></ListItemIcon>}

                            <ListItemText
                                primary={"Analytics"}
                                classes={{
                                    primary: classes.listItemText,
                                    root: classes.drawerSectionSize
                                }}
                            />
                        </ListItem> : null}
                </List>
                <div className={classes.logoutButton}>
                    <RegularButton onClick={() => this.props.history.push("/login")}
                                   color="primary">LogOut</RegularButton>
                </div>
            </div>
        )

        return (
            <PerfectScrollbar component="div" className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" color="secondary" className={classes.appBar} elevation={0}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {name}
                        </Typography>
                        {name === "Project List" ?
                            <Search
                                onSearch={this.props.onSearch}
                            />
                            : null
                        }
                    </Toolbar>
                </AppBar>
                <nav
                    className={classes.drawer}
                    aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor="left"
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.permanentDrawer
                            }}
                            variant="permanent"
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    {this.props.children}
                </main>
            </PerfectScrollbar>

        )
    }
}

ResponsiveDrawer.propTypes = {
    container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
}

export default withRouter(withStyles(styles)(ResponsiveDrawer))
