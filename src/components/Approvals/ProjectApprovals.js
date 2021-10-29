import React, { Component } from "react"

import CardsList from "../CardsList/CardsList"
import timeDiff from "../../helpers/DynamicTimeDiff"

import { 
    withStyles, 
    Grid,
    CardContent, 
    IconButton, 
    Typography, 
    Avatar,
} from "@material-ui/core"
import { 
    Done, 
    Close, 
    SentimentDissatisfiedOutlined 
} from '@material-ui/icons'

import styles from "../../assets/jss/components/projectApprovalsStyle"

class ProjectApprovals extends Component {
    render() {
        const { classes, approvalList, title, approveFunction} = this.props
        const contentStruct = (card) => {
            return (
                <Grid container justify="left" spacing={0}>
                    <Grid item xs={2} className={classes.profilePic}>
                        <Avatar 
                            alt="Profile Picture"
                            src={card.userProfilePic}
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <CardContent component="div" onClick={() => this.props.history.push("/main/userprofile/" + card.userId)}>
                            <Typography component="h3" variant="body1" className={classes.userApproval}>
                                {card.userName}
                            </Typography>
                            <Typography component="h3" variant="body2" className={classes.userRegisterDate}>
                                <b>
                                    A few mins ago
                                </b>
                            </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={1} className={classes.acceptButton}>
                        <IconButton aria-label="accept-icon" onClick={() => {approveFunction(card.projectId, card.userId, card.notifyId, true)}}>
                            <Done fontSize="medium" className={classes.acceptIcon}/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.declineButton}>
                        <IconButton aria-label="reject-icon" onClick={() => approveFunction(card.projectId, card.userId, card.notifyId, false)}>
                            <Close fontSize="medium" className={classes.declineIcon}/>
                        </IconButton>
                    </Grid>
                </Grid>
            )
        }

        return (
            <CardsList 
                title={title} 
                cardData={approvalList} 
                contentStruct={contentStruct} 
                EmptyIcon={SentimentDissatisfiedOutlined} 
                emptyText="No More Registrations!"
                groupBy="projectId"
            />
        )
    }
}

export default withStyles(styles)(ProjectApprovals)