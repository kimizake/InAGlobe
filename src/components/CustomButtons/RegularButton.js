// Main ReactJS libraries
import React, { Component } from "react"
import classNames from "classnames"

// Material UI libraries
import { 
    withStyles, 
    Button,
} from "@material-ui/core"

// Importing class's stylesheet
import styles from "../../assets/jss/components/regularButtonStyle"

class RegularButton extends Component {
    render() {
        const {
            classes,
            color,
            round,
            children,
            disabled,
            simple,
            size,
            block,
            link,
            justIcon,
            className,
            muiClasses,
            ...rest
        } = this.props

        const btnClasses = classNames({
            [classes.button]: true,
            [classes[size]]: size,
            [classes[color]]: color,
            [classes.round]: round,
            [classes.disabled]: disabled,
            [classes.simple]: simple,
            [classes.block]: block,
            [classes.link]: link,
            [classes.justIcon]: justIcon,
            [className]: className
        })

        return (
            <Button {...rest} classes={muiClasses} className={btnClasses}>
                {children}
            </Button>
        )
    }
}

export default withStyles(styles)(RegularButton)