// Main ReactJS libraries
import React, {Component} from "react"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

import RegularButton from "../../components/CustomButtons/RegularButton"

import { userService } from "../../services/userService"

// Importing class's stylesheet
import styles from "../../assets/jss/layouts/authenticationStyle"


class ConfirmEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmed: ""
        }
    }

    componentDidMount() {
        userService.confirm(this.props.match.params.token)
            .then(response => {
                if (response) {
                    this.setState({
                        confirmed: response.message
                    })
                } else {
                    this.setState({
                        confirmed: "Unable to confirm account!"
                    })
                }
            })
            .catch(err => console.log(err))
    }

    render() {
        // const { classes } = this.props
        return (

            <div>
                <h2>{this.state.confirmed}</h2>
                <RegularButton color="primary" onClick={() => {
                    this.props.history.push("/login")
                }}>{"Login!"}</RegularButton>
            </div>
        )
    }
}

export default withStyles(styles)(ConfirmEmail)