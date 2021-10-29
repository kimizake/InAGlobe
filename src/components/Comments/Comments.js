import React, {Component} from "react"
import Spinner from 'react-spinner-material'

import {
    withStyles,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    TextField,
    IconButton,
} from "@material-ui/core"
import {Close} from "@material-ui/icons"

import RegularButton from "../CustomButtons/RegularButton"

// Imports of helper or service functions
import config from "../../config"
import {commentsService} from "../../services/commentsService"

import styles from "../../assets/jss/components/commentsStyle"
import 'react-confirm-alert/src/react-confirm-alert.css'

import {EventSourcePolyfill} from 'event-source-polyfill'


class Comments extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: "",
            dialogBoxOpened: false,
            selectedCommentId: 0,
            postLoading: false,
            comments: [],
            userType: JSON.parse(localStorage.getItem('user')).permissions,
            userId: JSON.parse(localStorage.getItem('user')).userId,
        }
        this.eventSource = new EventSourcePolyfill(config.apiUrl + '/comment-stream/' + this.props.projectId, {
            mode: 'cors',
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
            }
        })
    }


    async componentDidMount() {
        console.log("Did Mount")
        this.getComments()
        try {
            this.interval = setInterval(async () => {
                console.log("Getting comments!")
                this.getComments()
            }, 2000)
        } catch (e) {
            console.log(e)
        }

        this.eventSource.addEventListener('commentstream', (json) => this.handleCommentUpdates(json))
        this.eventSource.addEventListener('error', console.log)
    }


    getComments = () => {
        commentsService.getComments(this.props.projectId)
            .then(c => c.json())
            .then(json => {
                console.log(json)
                this.setState({
                    comments: json.comments
                })
            })
            .catch(err => console.log(err))
    }


    componentWillUnmount() {
        console.log("Will unmount")
        this.eventSource.removeEventListener('commentstream', (json) => this.handleCommentUpdates(json))
        this.eventSource.removeEventListener('error', (err) => {
            console.log(err)
        })
        this.eventSource.close()
        clearInterval(this.interval)
    }

    handleCommentUpdates = (json) => {
        const v = JSON.parse(json.data)
        console.log(v)
        if (v.message === 'Comment deleted!') {
            const array = [...this.state.comments]
            const index = array.findIndex(function (item) {
                return item.commentId === v.comment.commentId
            })
            if (index !== -1) {
                array.splice(index, 1)
                console.log(array)
                this.setState({
                    comments: array
                })
            }
        } else if (v.message === 'Comment added!') {
            this.setState({
                comments: this.state.comments.concat(v.comment)
            })
        }
    }


    handleFormChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    post = () => {
        const today = new Date()
        this.setState({
            postLoading: true,
            date: `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
        })

        commentsService.postComment(this.props.projectId, this.state.text)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                this.setState({
                    postLoading: false,
                    text: ""
                })
            })
            .catch(console.log)
    }

    deleteComment = (commentId) => {
        commentsService.deleteComment(commentId)
            .then(response => {
                console.log(response)
            })
            .catch(console.log)

    }

    hasPermissions = (ownerId) => {
        return (this.state.userType === 0 || this.state.userId === ownerId)
    }

    renderConfirmDialog = () => {
        return (
            <Dialog
                open={this.state.dialogBoxOpened}
                onClose={() => {
                    this.setState({dialogBoxOpened: false})
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete comment?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this comment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            this.setState({dialogBoxOpened: false})
                        }}
                        color="primary"
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => {
                            this.deleteComment(this.state.selectedCommentId)
                            this.setState({dialogBoxOpened: false})
                        }}
                        color="primary"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.root}>
                <List>
                    {this.state.comments.map(comment => (
                        <div className={classes.root}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar
                                        alt="Profile Picture"
                                        src="https://picsum.photos/200"
                                        onClick={() => this.props.history.push("/main/userprofile/" + comment.ownerId)}
                                    />
                                </ListItemAvatar>
                                {this.hasPermissions(comment.ownerId) ?
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            onClick={() => {
                                                this.setState({
                                                    selectedCommentId: comment.commentId,
                                                    dialogBoxOpened: true
                                                })
                                            }}
                                        >
                                            <Close/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                    :
                                    <></>
                                }
                                <ListItemText
                                    primary={comment.ownerFirstName + " " + comment.ownerLastName}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                {comment.date}
                                            </Typography>
                                            {` — ${comment.text}`}
                                        </React.Fragment>
                                    }
                                    onClick={() => this.props.history.push("/main/userprofile/" + comment.ownerId)}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li"/>
                        </div>
                    ))}
                </List>
                <div className={classes.commentsPostDiv}>
                    <TextField
                        id="text"
                        className={classes.commentsPostText}
                        placeholder="Enter your comment here..."
                        margin="normal"
                        variant="outlined"
                        value={this.state.text}
                        disabled={this.state.postLoading}
                        inputProps={{
                            'aria-label': 'bare',
                            onChange: this.handleFormChange
                        }}
                    />
                    <RegularButton
                        color="primary"
                        className={classes.commentsPostButton}
                        onClick={this.post}
                        disabled={this.state.postLoading}
                    >
                        {this.state.postLoading ?
                            <Spinner size={20} spinnerColor={"#FFFFFF"} spinnerWidth={3} visible={true}/> : "Post"}
                    </RegularButton>
                </div>
                {this.renderConfirmDialog()}
            </div>
        )
    }
}

export default withStyles(styles)(Comments)