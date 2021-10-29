// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalPreviewPageStyle"
import ProposalPage from './ProposalPage'

class ProposalPreviewPage extends Component {
    render() {
        return (
            <ProposalPage {...this.props} isPreview={true} />
        )
    }
}

export default withStyles(styles)(ProposalPreviewPage)
