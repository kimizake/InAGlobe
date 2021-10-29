// Main ReactJS libraries
import React, {Component} from "react"

// Material UI libraries
import {withStyles} from "@material-ui/styles"


// Importing class's stylesheet
import styles from "../../assets/jss/layouts/authenticationStyle"
import {userService} from "../../services/userService";

import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress';

class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: {
                value: "",
                error: ""
            },
            sending: false,
            sentMessage: ""
        }
    }

    handleFormChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: {
                error: "",
                value: value
            }
        });
    }

    sendPressed = () => {
        this.setState({
            sending: true
        });

        userService.send_reset_email(this.state.email.value)
            .then(response => {
                this.setState({
                    sentMessage: response.message,
                    sending: false
                });
            })
            .catch(err => console.log(err))
    };

    render() {
        const { classes } = this.props
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <p>{"\n"}</p>
                    <p>{"\n"}</p>
                    <p>{"\n"}</p>
                    <p>{"\n"}</p>
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    error={!(this.state.email.error === "")}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    helperText={this.state.email.error}
                                    label="Email Address"
                                    name="email"
                                    onChange={this.handleFormChange}
                                    autoComplete="email"
                                />
                            </Grid>
                        </Grid>
                        <p>{"\n"}</p>
                        <p>{"\n"}</p>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.sendPressed}
                            className={classes.submit}
                        >
                            {this.state.sending ? <CircularProgress className={classes.loading}/> : "Send Reset Link"}
                        </Button>
                        <Typography component="h1" variant="h5">
                            {this.state.sentMessage}
                        </Typography>
                    </form>
                </div>
            </Container>
        )
    }
}

export default withStyles(styles)(SendEmail)
