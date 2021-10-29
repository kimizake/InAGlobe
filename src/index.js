// Main ReactJS libraries
import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { createBrowserHistory } from "history"
import { Router, Route, Switch, Redirect } from "react-router-dom"

// Importing and applying a global stylesheet
import "./assets/css/material-dashboard-react.css?=1.8.0"

// Imports of different components and layouts in project
import * as serviceWorker from "./serviceWorker"
import Authentication from "./layouts/Authentication/Authentication"
import MainPage from './layouts/MainPage/MainPage'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { PrivateRoute } from "./helpers/PrivateRoute"

const hist = createBrowserHistory()

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#f494a2",
            contrastText: "#FFF"
		},
		secondary: {
            main: "#5E92A8"
		}
	}
})

const trackingId = process.env.REACT_APP_GA_ID
console.log(trackingId)
ReactGA.initialize(trackingId)

hist.listen(location => {
    ReactGA.set({ page: location.pathname }) // Update the user's current page
    ReactGA.pageview(location.pathname) // Record a pageview for the given page
    console.log(location.pathname)
})

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<Router history={hist}>
			<Switch>
				<Route path="/login" component={Authentication} />
				<PrivateRoute path="/main" component={MainPage} />
                <Redirect to="/login" />
			</Switch>
		</Router>
	</ThemeProvider>,
	document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
