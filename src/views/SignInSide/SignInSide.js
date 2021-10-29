// Main ReactJS libraries
import React, { Component } from 'react'
import { withRouter } from "react-router-dom"

// Material UI libraries
import {
    withStyles,
    Avatar,
    Box,
    Checkbox,
    CircularProgress,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core'

// Imports of different components and layouts in project
import Copyright from '../../components/Copyright/Copyright'
import RegularButton from "../../components/CustomButtons/RegularButton"

// Importing class's stylesheet
import styles from "../../assets/jss/views/signInSideStyle"

import { userService } from "../../services/userService"

class SignInSide extends Component {

    constructor(props) {
        super(props)

        const remembered = JSON.parse(localStorage.getItem("remember"))
        userService.logout()

        if (remembered) {
            this.state = {
                email: remembered.email,
                password: remembered.password,
                loginFailed: false,
                loggingIn: false,
                remember: true
            }
        } else {
            this.state = {
                email: "",
                password: "",
                loginFailed: false,
                loggingIn: false,
                remember: false
            }
        }
    }

    handleFormChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    loginPressed = () => {
        // You can authenticate here
        this.setState({
            loggingIn: true
        })
        userService.login(this.state.email, this.state.password)
            .then(token => {
                console.log(token)
                if (token === "") {
                    this.setState({
                        loginFailed: true,
                        loggingIn: false
                    })
                } else {
                    if (this.state.remember) {
                        localStorage.setItem("remember", JSON.stringify({ email: this.state.email, password: this.state.password }))
                    } else {
                        localStorage.setItem("remember", JSON.stringify({ email: "", password: "" }))
                    }

                    this.props.history.push("/main")
                    this.setState({
                        loginFailed: false
                    });
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    loginFailed: true,
                    loggingIn: false
                })
            })
    }

    render() {
        const {classes} = this.props

        return (
            <div>
                <Grid container component="main" className={classes.root}>
                    <CssBaseline/>
                    <Grid item xs={false} sm={4} md={7} className={classes.image}/>
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <this.props.icon/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    defaultValue={this.state.email}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.handleFormChange}
                                    autoFocus
                                    onKeyPress={event => event.key === "Enter" ? this.loginPressed() : null}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    defaultValue={this.state.password}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleFormChange}
                                    onKeyPress={event => event.key === "Enter" ? this.loginPressed() : null}
                                />
                                <FormControlLabel
                                    control={<Checkbox 
                                                color="primary" 
                                                checked={this.state.remember} 
                                                onChange={e => {
                                                    this.setState({ 
                                                        remember: e.target.checked 
                                                    })
                                                }}
                                            />}
                                    label="Remember Me"
                                />
                                <RegularButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.loginPressed}
                                >
                                    {this.state.loggingIn ? <CircularProgress className={classes.loading}/> : "Login"}
                                </RegularButton>
                                <Grid container>
                                    <Grid item>
                                        <Link href="/login/signup" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item>
                                        <Link href="/login/requestpassword" variant="body2">
                                            {"Forgotten your password?"}
                                        </Link>
                                    </Grid>
                                </Grid>

                                <Box mt={5}>
                                    <Copyright/>
                                </Box>
                            </form>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(SignInSide))
