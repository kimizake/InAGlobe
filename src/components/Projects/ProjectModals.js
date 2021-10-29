import React from 'react';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

import {projectService} from '../../services/projectsService'

var data = {};

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));


export default function ProjectDialogue(props) {
    const classes = useStyles();

    return (
        <>
            <EditModal classes={classes} ProjectData={props.ProjectData} />
            <DeleteModal classes={classes} ProjectData={props.ProjectData} />
        </>
    );
}

function EditModal(props) {
    const [openEdit, setOpenEdit] = React.useState(false);

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleSave = () => {
        setOpenEdit(false);
        projectService.updateProject(props.ProjectData.id, data)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err)
        })
    };

    return (
        <div className={props.classes.root}>
            <Fab color="secondary" aria_label="edit" onClick={handleClickOpenEdit}>
                <EditIcon />
            </Fab>
            <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="edit-dialogue">
                <DialogTitle id="edit-title-dialogue">
                    Edit project
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To update this project, just fill out the form.
                    </DialogContentText>
                    <EditTextFields
                        ProjectData={props.ProjectData}
                        title={props.ProjectData.title}
                        shortDescription={props.ProjectData.shortDescription}
                        detailedDescription={props.ProjectData.detailedDescription}
                    />
                </DialogContent>
                <DialogActions>
                    <Fab aria_label="close" onClick={handleCloseEdit}>
                        <CloseIcon />
                    </Fab>
                    <Fab color="primary" aria_label="save" onClick={handleSave}>
                        <SaveIcon />
                    </Fab>
                </DialogActions>
            </Dialog>
        </div>
    )
}

function EditTextFields(props){
    const [title, setTitle] = React.useState(props.title);
    const [shortDescription, setShortDescription] = React.useState(props.shortDescription);
    const [detailedDescription, setDetailedDescription] = React.useState(props.detailedDescription);

    const changeTitle = (e) => {
        setTitle(e.target.value);
        data['title'] = e.target.value;
    };
    const changeShortDescription = (e) => {
        setShortDescription(e.target.value);
        data['shortDescription'] = e.target.value;
    };
    const changeDetailedDescription = (e) => {
        setDetailedDescription(e.target.value);
        data['detailedDescription'] = e.target.value;
    };

    return (
        <div>
            <TextField
                id="title"
                label="title"
                variant="outlined"
                defaultValue={title}
                onChange={changeTitle}
                margin="normal"
                fullWidth
                autoFocus
            />
            <TextField
                id="shortDescription"
                label="shortDescription"
                variant="outlined"
                defaultValue={shortDescription}
                onChange={changeShortDescription}
                margin="normal"
                fullWidth
                multiline
                rows="2"
                autoFocus
            />
            <TextField
                id="detailedDescription"
                label="detailedDescription"
                variant="outlined"
                defaultValue={detailedDescription}
                onChange={changeDetailedDescription}
                margin="normal"
                fullWidth
                multiline
                rows="4"
                autoFocus
            />
        </div>
    )

}

function DeleteModal(props){
    const [openDelete, setOpenDelete] = React.useState(false);

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleDelete = () => {
        setOpenDelete(false);
        projectService.deleteProject(props.ProjectData.id)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err)
        })
    };

    return (
        <div className={props.classes.root}>
            <Fab aria_label="delete" onClick={handleClickOpenDelete}>
                <DeleteOutlineIcon />
            </Fab>
            <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="delete-dialogue">
                <DialogTitle id="delete-title-dialogue">
                    Delete Project?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-content-dialogue">
                        Are you sure you want to delete this project?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="outlined" onClick={handleCloseDelete}>
                        No
                    </Button>
                    <Button color="secondary" variant="outlined" onClick={handleDelete}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}