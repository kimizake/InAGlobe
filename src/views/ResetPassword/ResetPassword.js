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

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password1: {
                value: "",
                error: ""
            },
            password2: {
                value: "",
                error: ""
            },
            sending: false,
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
    };

    handleValidation = () => {
        let success = true;
        let passwordError = "";

        if (this.state.password1.value !== this.state.password2.value) {
            passwordError = "Passwords must match!"
            success = false;
        } else if (this.state.password1.value === "") {
            passwordError = "Password cannot be empty!";
            success = false;
        } else if (this.state.password1.value.length < 8) {
            passwordError = "Password length must be at least 8 characters!";
            success = false;
        }

        this.setState(prevState => ({
            password2: {
                ...prevState.password2,
                error: passwordError
            }
        }));

        return success;
    };

    sendPressed = () => {
        this.setState({
            sending: true
        });

        if (this.handleValidation()) {
            userService.reset_password(this.props.match.params.token, this.state.password1.value)
                .then(response => {
                    this.setState({
                        sentMessage: response.message,
                        sending: false
                    });
                    this.props.history.push("/")
                })
                .catch(err => console.log(err))
        } else {
            this.setState({
                sending: false
            });
        }

    };

    render() {
        const {classes} = this.props;
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
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password1"
                                    onChange={this.handleFormChange}
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <TextField
                                    error={!(this.state.password2.error === "")}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    helperText={this.state.password2.error}
                                    name="password2"
                                    onChange={this.handleFormChange}
                                    label="Re-Enter Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
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
                            {this.state.sending ? <CircularProgress className={classes.loading}/> : "Reset Password"}
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

export default withStyles(styles)(ResetPassword)
