// Main ReactJS libraries
import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router-dom"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

// Importing webpath data for logins
import { loginRoutes } from "../../routes"

// Importing class's stylesheet
import styles from "../../assets/jss/layouts/authenticationStyle"


class Authentication extends Component {
    render() {
        // const { classes } = this.props
        const { path } = this.props.match
        return (
            <Switch>
                {loginRoutes.map((prop, key) => {
                    return (
                        <Route 
                            path={path + prop.path}
                            key={key}
                            render={(props) => <prop.component {...props} icon={prop.icon} />}
                        />
                    )
                })}
                <Redirect strict from="/login" to="/login/signin" />
            </Switch>
        )
    }
}

export default withStyles(styles)(Authentication)