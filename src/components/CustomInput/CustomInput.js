// Main ReactJS libraries
import React, { Component } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

// Material UI libraries
import { 
	withStyles,
	FormControl, 
	TextField 
} from "@material-ui/core"
import { 
	Clear, 
	Check 
} from "@material-ui/icons"

// Importing class's stylesheet
import styles from "../../assets/jss/components/customInputStyle"

class CustomInput extends Component {

	render() {
		const {
			classes,
			formControlProps,
			labelText,
			id,
			inputProps,
			error,
			success,
			extraLines
		} = this.props
		
		const underlineClasses = classNames({
			[classes.underlineError]: error,
			[classes.underlineSuccess]: success && !error,
			[classes.underline]: true
		})
		const marginTop = classNames({
			[classes.marginTop]: labelText === undefined
		})
		return (
			<FormControl
				{...formControlProps}
				className={classes.formControl}
			>
				{!extraLines ? (
					<TextField 
						classes={{
							root: marginTop,
							disabled: classes.disabled,
							underline: underlineClasses
						}}
						label={labelText}
						id={id}
						{...inputProps}
					/>
				) : (
					<TextField 
						classes={{
							root: marginTop,
							disabled: classes.disabled,
							underline: underlineClasses
						}}
						label={labelText}
						multiline
						id={id}
						{...inputProps}
					/>
				)}
				{error ? (
					<Clear className={classes.feedback + " " + classes.labelRootError} />
				) : success ? (
					<Check className={classes.feedback + " " + classes.labelRootSuccess} />
				) : null}
			</FormControl>
		)
	}
}

CustomInput.propTypes = {
	labelText: PropTypes.node,
	labelProps: PropTypes.object,
	id: PropTypes.string,
	inputProps: PropTypes.object,
	formControlProps: PropTypes.object,
	error: PropTypes.bool,
	success: PropTypes.bool
}

export default withStyles(styles)(CustomInput)