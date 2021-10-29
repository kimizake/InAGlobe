// Main ReactJS libraries
import React, { Component } from "react"

// Material UI libraries
import {  
    Link,
    Typography,
} from '@material-ui/core'

class Copyright extends Component {

    render() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Group 29 @ '}
                <Link color="inherit" href="https://www.inaglobe.com">
				    InAGlobe Education
			    </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        )
    }
    
}

export default Copyright