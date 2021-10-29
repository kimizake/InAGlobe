// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {
    withStyles,
    Avatar,
    Button,
    Box,
    CircularProgress,
    Container,
    CssBaseline,
    FormControl,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Select,
    TextField,
    Typography, FormControlLabel
} from '@material-ui/core'


// Imports of different components in project
import Copyright from "../../components/Copyright/Copyright"

// Importing helper or service functions
import {userService} from "../../services/userService"

// Importing class's stylesheet
import styles from "../../assets/jss/views/signUpStyle"
import privacyPolicy from '../../assets/data/privacy-policy.pdf'
import termsOfService from '../../assets/data/terms-and-conditions-template.pdf'
import Checkbox from "@material-ui/core/Checkbox";

class SignUp extends Component {

    constructor(props) {
        super(props)
        userService.logout()
        this.state = {
            email: {
                error: "",
                value: ""
            },
            password: {
                error: "",
                value: ""
            },
            confirmPassword: {
                error: "",
                value: ""
            },
            firstName: {
                error: "",
                value: ""
            },
            lastName: {
                error: "",
                value: ""
            },
            agree: {
                error: "",
                checked: false
            },
            userType: "STUDENT",
            labelWidth: 0,
            signingUp: false
        }
        this.inputLabel = null
    }

    handleValidation = () => {
        let success = true
        let emailError = ""
        let firstNameError = ""
        let lastNameError = ""
        let passwordError = ""
        let confirmPasswordError = ""
        let agreeError = ""

        if (!this.state.agree.checked) {
            agreeError = "You must agree to both the Terms of Service and the Privacy Policy."
            success = false
        }

        if (this.state.userType.value === "STUDENT" || this.state.userType.value === "ACADEMIC") {
            if (!this.state.email.value.match(/^[\w\d]+@[\w\d]+\.(ac|org)\..*$/)) {
                emailError = "Must have .ac or .org email!";
                success = false
            }
        }

        if (this.state.firstName.value === "") {
            firstNameError = "First name cannot be empty!"
            success = false
        }

        if (this.state.lastName.value === "") {
            lastNameError = "Last name cannot be empty!"
            success = false
        }

        if (this.state.password.value === "") {
            passwordError = "Password cannot be empty!"
            success = false
        }

        if (this.state.confirmPassword.value === "") {
            confirmPasswordError = "Confirm Password cannot be empty!"
            success = false
        }

        var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
        if (!this.state.password.value.match(passw)) {
            passwordError = "Password must be between 6-20 characters," +
                " contain one uppercase and one lowercase character as well as a number!"
            success = false
        }

        if (this.state.confirmPassword.value !== this.state.password.value) {
            confirmPasswordError = "Must match the password provided above!"
            success = false
        }


        this.setState(prevState => ({
            email: {
                ...prevState.email,
                error: emailError
            },
            firstName: {
                ...prevState.firstName,
                error: firstNameError
            },
            lastName: {
                ...prevState.lastName,
                error: lastNameError
            },
            password: {
                ...prevState.password,
                error: passwordError
            },
            confirmPassword: {
                ...prevState.confirmPassword,
                error: confirmPasswordError
            },
            agree: {
                ...prevState.agree,
                error: agreeError
            }
        }));
        return success
    }

    handleFormChange = (e) => {
        const {name, value} = e.target
        this.setState({
            [name]: {
                error: "",
                value: value
            }
        })
    }

    signUpPressed = () => {
        // You can authenticate here
        this.setState({
            signingUp: true
        })


        if (this.handleValidation()) {
            console.log(this.state.signingUp)
            userService.signUp(
                this.state.firstName.value,
                this.state.lastName.value,
                this.state.email.value,
                this.state.password.value,
                this.state.userType)
                .then(response => {
                    console.log(response)
                    this.props.history.push("/login")
                })
                .catch(err => {
                    console.log(err)
                    this.setState(prevState => ({
                        signingUp: false,
                        email: {
                            ...prevState.email,
                            error: "Email already exists!"
                        }
                    }))
                })
        } else {
            this.setState({
                signingUp: false
            })
        }

    }

    componentDidMount() {
        this.setState({
            labelWidth: this.inputLabel.offsetWidth
        })
    }

    render() {
        const {classes} = this.props
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <this.props.icon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!(this.state.firstName.error === "")}
                                    name="firstName"
                                    onChange={this.handleFormChange}
                                    variant="outlined"
                                    required
                                    helperText={this.state.firstName.error}
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoComplete="fname"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!(this.state.lastName.error === "")}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    helperText={this.state.lastName.error}
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    onChange={this.handleFormChange}
                                    autoComplete="lname"
                                />
                            </Grid>
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
                            <Grid item xs={12}>
                                <TextField
                                    error={!(this.state.password.error === "")}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    helperText={this.state.password.error}
                                    name="password"
                                    onChange={this.handleFormChange}
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!(this.state.password.error === "")}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    helperText={this.state.confirmPassword.error}
                                    name="confirmPassword"
                                    onChange={this.handleFormChange}
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl
                                    variant="outlined"
                                    required
                                    fullWidth
                                >
                                    <InputLabel ref={inputLabel => {
                                        this.inputLabel = inputLabel
                                    }} id="userTypeLabel">Select User Type</InputLabel>
                                    <Select
                                        labelId="userTypeLabel"
                                        id="userType"
                                        name="userType"
                                        onChange={this.handleFormChange}
                                        labelWidth={this.state.labelWidth}
                                    >
                                        <MenuItem value={"HUMANITARIAN"}>Humanitarian</MenuItem>
                                        <MenuItem value={"ACADEMIC"}>Academic</MenuItem>
                                        <MenuItem value={"STUDENT"}>Student</MenuItem>
                                    </Select>
                                </FormControl>
                                <Grid item xs={12}>
                                    <>
                                    <FormControlLabel style={{display: "table", textAlign: "center"}}
                                                      control={<Checkbox value="agree" color="primary"
                                                                         checked={this.state.agree.checked}
                                                                         onChange={this.handleAgreeCheckBoxClick}/>}
                                                      label={<>
                                                          I agree to the
                                                          <a href={termsOfService} style={{cursor: "pointer"}}> Terms of
                                                              Service </a>
                                                          and the
                                                          <a href={privacyPolicy} style={{cursor: "pointer"}}> Privacy
                                                              Policy</a>
                                                      </>}
                                    />
                                    <div style={{color: "red"}}>{this.state.agree.error}</div>
                                    </>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.signUpPressed}
                        >
                            {this.state.signingUp ? <CircularProgress className={classes.loading}/> : "Sign Up"}
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/login/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright/>
                </Box>
            </Container>
        )
    }

    handleAgreeCheckBoxClick = () => {
        this.setState(prevState => ({
                agree: {
                    checked: !prevState.agree.checked,
                    error: ""
                }
            })
        )
    }
}

export default withStyles(styles)(SignUp)
