import React, {Component, Fragment} from "react"

import {
    withStyles,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@material-ui/core"
import NotificationsIcon from '@material-ui/icons/Notifications'

import CardsList from "../CardsList/CardsList"
import timeDiff from "../../helpers/DynamicTimeDiff"

import styles from "../../assets/jss/components/notificationsStyle"
import Button from "@material-ui/core/Button";

class Notifications extends Component {

    render() {
        const {classes, notifyList, title, approveFunction} = this.props
        const displayApproveButton = this.props.hasOwnProperty("approveFunction")

        const contentStruct = (card) => {
            return (
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar
                            alt="Profile Picture"
                            src={card.profilePic}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Fragment>
                                <b>
                                    {card.userName}
                                </b>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.timeDiff}
                                >
                                    {timeDiff(new Date(card.date))}
                                </Typography>
                            </Fragment>
                        }
                        secondary={
                            <Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="textPrimary"
                                >
                                    {card.projectName}
                                </Typography>
                                <br/>
                                {card.details}
                            </Fragment>
                        }
                    />
                    {displayApproveButton ?
                        <div style={{height: "5px"}}>
                            <Button
                                onClick={() => approveFunction(card.projectId, card.userId, card.notifyId)}>Approve</Button>
                        </div>
                        : <></>
                    }
                </ListItem>
            )
        }

        return (
            <CardsList 
                cardData={notifyList} 
                title={title} 
                contentStruct={contentStruct}
                EmptyIcon={NotificationsIcon}
                emptyText="All Caught Up!"
            />
        )
    }
}

export default withStyles(styles)(Notifications)